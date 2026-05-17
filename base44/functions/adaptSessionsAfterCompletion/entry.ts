import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { event, data } = body;

    if (event.type !== 'update' || !data?.status || data.status !== 'completed') {
      return Response.json({ success: true });
    }

    const sessionId = event.entity_id;
    const session = data;

    // Récupérer les logs de la séance complétée
    const logs = await base44.entities.SeriesLog.filter({ session_id: sessionId });
    const program = await base44.entities.Program.filter({ id: session.program_id });
    const activeProgram = program[0];

    if (!logs.length || !activeProgram) {
      return Response.json({ success: true });
    }

    // Analyser les notes pour détecter des signaux
    const notes = (session.notes || '').toLowerCase();
    const noteSignals = {
      pain: /douleur|mal|gêne|pincement|inflammation/.test(notes),
      easy: /facile|trop léger|simple|pas assez dur/.test(notes),
      hard: /trop dur|très dur|épuisant|impossible/.test(notes),
      discomfort: /inconfortable|mal positionné|mauvaise position/.test(notes),
    };

    // Calculer les performances moyennes et analyser la progression
    const performanceByExercise = {};
    logs.forEach(log => {
      if (!performanceByExercise[log.exercise_name]) {
        performanceByExercise[log.exercise_name] = {
          totalReps: 0,
          totalWeight: 0,
          counts: 0,
          modes: [],
          qualities: [],
          qualitiesBySet: {},
          feedbacks: [],
        };
      }
      performanceByExercise[log.exercise_name].totalReps += log.reps_done || 0;
      performanceByExercise[log.exercise_name].totalWeight += log.weight || 0;
      performanceByExercise[log.exercise_name].counts += 1;
      if (log.mode) performanceByExercise[log.exercise_name].modes.push(log.mode);
      if (log.execution_quality) {
        performanceByExercise[log.exercise_name].qualities.push(log.execution_quality);
        performanceByExercise[log.exercise_name].qualitiesBySet[log.set_number] = log.execution_quality;
      }
      if (log.feedback) performanceByExercise[log.exercise_name].feedbacks.push(log.feedback);
    });

    // Analyser la détérioration de qualité (danger = passe de bon à mauvais trop rapidement)
    const analyzeQualityDeterioration = (exercise) => {
      const perf = performanceByExercise[exercise];
      if (!perf || !perf.qualities.length) return { isDangerous: false, deterioration: 0 };

      const qualitiesBySet = Object.entries(perf.qualitiesBySet)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .map(([_, q]) => q);

      if (qualitiesBySet.length < 2) return { isDangerous: false, deterioration: 0 };

      const qualityScore = { good: 3, degraded: 2, bad: 1 };
      let maxDrop = 0;

      for (let i = 0; i < qualitiesBySet.length - 1; i++) {
        const drop = qualityScore[qualitiesBySet[i]] - qualityScore[qualitiesBySet[i + 1]];
        maxDrop = Math.max(maxDrop, drop);
      }

      // Danger si : bonne → mauvaise d'un coup, ou dégradée rapidement
      const hasBad = qualitiesBySet.some(q => q === 'bad');
      const startGood = qualitiesBySet[0] === 'good';
      const isDangerous = hasBad && startGood && maxDrop >= 2;

      return { isDangerous, deterioration: maxDrop, qualityProgression: qualitiesBySet };
    };

    // Récupérer les prochaines séances du programme (5 prochaines)
    const allSessions = await base44.entities.Session.filter({ program_id: session.program_id });
    const futureSessions = allSessions
      .filter(s => new Date(s.planned_date) > new Date(session.planned_date) && s.status === 'planned')
      .sort((a, b) => new Date(a.planned_date) - new Date(b.planned_date))
      .slice(0, 5);

    if (!futureSessions.length) {
      return Response.json({ success: true });
    }

    // Déterminer la stratégie d'adaptation basée sur la fatigue globale
    const fatigue = session.global_fatigue || 2;
    let adaptStrategy = 'maintain'; // default

    if (fatigue === 1) {
      adaptStrategy = 'increase'; // Frais → augmenter
    } else if (fatigue === 2 || fatigue === 3) {
      adaptStrategy = 'maintain'; // Normal/Fatigué → maintenir
    } else if (fatigue === 4 || fatigue === 5) {
      adaptStrategy = 'reduce'; // Épuisé/Détruit → réduire
    }

    // Adapter chaque exercice des prochaines séances
    for (const futureSession of futureSessions) {
      if (!futureSession.exercises) continue;

      const adaptedExercises = futureSession.exercises.map(exercise => {
        const perf = performanceByExercise[exercise.name];
        if (!perf) return exercise;

        const avgWeight = perf.totalWeight / perf.counts;
        const qualityGood = (perf.qualities.filter(q => q === 'good').length / perf.counts) > 0.7;
        const qualityAvg = (perf.qualities.filter(q => q === 'good' || q === 'degraded').length / perf.counts) > 0.5;
        const disliked = perf.feedbacks.filter(f => f === 'disliked').length > 0;
        const changeRequested = perf.feedbacks.filter(f => f === 'change').length > 0;
        
        const { isDangerous, deterioration, qualityProgression } = analyzeQualityDeterioration(exercise.name);

        let newExercise = { ...exercise };
        let riskLevel = 'safe';

        // 1. SÉCURITÉ D'ABORD : détérioration dangereuse
        if (isDangerous) {
          // Exécution s'est dégradée rapidement → STOPPER la progression
          riskLevel = 'danger';
          newExercise.target_weight = Math.round(avgWeight * 0.92); // Réduire de 8%
          newExercise.sets = Math.max(2, (exercise.sets || 3) - 1); // Réduire sets
          const rirMatch = (exercise.notes || '').match(/RIR\s*(\d+)/i);
          if (rirMatch) {
            newExercise.notes = (exercise.notes || '').replace(/RIR\s*\d+/i, 'RIR ' + (parseInt(rirMatch[1]) + 2)) + ' [⚠️ Qualité dégradée - réduire charge]';
          } else {
            newExercise.notes = (exercise.notes || '') + ' [⚠️ Qualité dégradée - réduire charge]';
          }
        } 
        // 2. Remplacer si demandé
        else if (changeRequested) {
          newExercise.notes = (exercise.notes || '') + ' [À remplacer - retour utilisateur]';
        }
        // 3. Mauvaise exécution générale (sans être dangereuse)
        else if (!qualityAvg) {
          // Moyenne de qualité mauvaise → stabiliser et améliorer exécution
          riskLevel = 'caution';
          newExercise.target_weight = Math.round(avgWeight * 0.95);
          const rirMatch = (exercise.notes || '').match(/RIR\s*(\d+)/i);
          if (rirMatch) {
            newExercise.notes = (exercise.notes || '').replace(/RIR\s*\d+/i, 'RIR ' + (parseInt(rirMatch[1]) + 1)) + ' [Travailler l\'exécution]';
          } else {
            newExercise.notes = (exercise.notes || '') + ' [Travailler l\'exécution]';
          }
        }
        // 4. Ignorer dislikes pour progresser seulement si sécurité OK
        else if (disliked && adaptStrategy === 'increase') {
          adaptStrategy = 'maintain';
        }
        // 5. Signaux des notes
        else if (noteSignals.pain) {
          newExercise.target_weight = Math.round(avgWeight * 0.9);
          newExercise.notes = (exercise.notes || '') + ' [Douleur détectée - réduire charge]';
        } 
        else if (noteSignals.discomfort) {
          const rirMatch = (exercise.notes || '').match(/RIR\s*(\d+)/i);
          if (rirMatch) {
            newExercise.notes = (exercise.notes || '').replace(/RIR\s*\d+/i, 'RIR ' + (parseInt(rirMatch[1]) + 1)) + ' [Vérifier position]';
          } else {
            newExercise.notes = (exercise.notes || '') + ' [Vérifier position technique]';
          }
        } 
        else if (noteSignals.easy && adaptStrategy === 'maintain' && qualityGood) {
          newExercise.target_weight = Math.round(avgWeight * 1.05);
        } 
        else if (noteSignals.hard && adaptStrategy !== 'reduce') {
          newExercise.target_weight = Math.round(avgWeight * 0.95);
        }
        // 6. Stratégie de base (si exécution OK)
        else if (qualityAvg) {
          if (adaptStrategy === 'increase' && qualityGood) {
            newExercise.target_weight = Math.round(avgWeight * 1.03);
          } else if (adaptStrategy === 'maintain') {
            newExercise.target_weight = Math.round(avgWeight);
          } else if (adaptStrategy === 'reduce') {
            newExercise.sets = Math.max(2, Math.floor((exercise.sets || 3) * 0.8));
            newExercise.target_weight = Math.round(avgWeight * 0.95);
            const rirMatch = (exercise.notes || '').match(/RIR\s*(\d+)/i);
            if (rirMatch) {
              newExercise.notes = (exercise.notes || '').replace(/RIR\s*\d+/i, 'RIR ' + (parseInt(rirMatch[1]) + 1));
            }
          }
        }

        return newExercise;
      });

      // Mettre à jour la séance future
      await base44.entities.Session.update(futureSession.id, {
        exercises: adaptedExercises,
      });
    }

    return Response.json({ success: true, adapted: futureSessions.length, strategy: adaptStrategy });
  } catch (error) {
    console.error('Adaptation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});