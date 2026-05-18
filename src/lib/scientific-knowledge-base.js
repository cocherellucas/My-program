// @ts-nocheck
// ─────────────────────────────────────────────────────────────────────────────
// BASE DE CONNAISSANCES SCIENTIFIQUES — Musculation & Entraînement
// Sources : Schoenfeld, Israetel, Krieger, Ralston, Colquhoun, Morton,
//           Brigatto, Ahtiainen, Delavier, Gundill, Cook, Bompa, McGill…
// Schema  : { id, topic, subtopics, finding, detail, source, application,
//             example, objectives, levels, muscles, keywords }
// ─────────────────────────────────────────────────────────────────────────────

export const KNOWLEDGE_BASE = [

  // ══════════════════════════════════════════════════════════════════════════
  // VOLUME
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'vol_001',
    topic: 'volume',
    subtopics: ['MEV', 'stimulus minimal'],
    finding: 'Le MEV est le volume minimum à partir duquel un muscle progresse. En dessous, l\'entraînement maintient sans améliorer.',
    detail: 'Le MEV varie selon la taille du muscle, le niveau et l\'objectif. Pour un débutant en hypertrophie, le MEV d\'un grand muscle est ~6-8 séries/sem. Pour un intermédiaire ~10-12. Pour un avancé ~14.',
    source: 'Israetel et al. — Renaissance Periodization (2019)',
    application: 'Commencer tout programme au MEV pour accumuler sans surentraîner, puis progresser vers le MAV.',
    example: 'Ex : un intermédiaire qui n\'a fait que 6 séries/sem de dos stagne. En passant à 10 (MEV), les gains reprennent. En dessous : maintenance, pas progrès.',
    objectives: ['hypertrophy', 'strength', 'endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['MEV', 'volume minimal', 'stimulus', 'séries', 'progression'],
  },
  {
    id: 'vol_002',
    topic: 'volume',
    subtopics: ['MAV', 'volume optimal'],
    finding: 'Le MAV est la plage de volume qui maximise les gains. C\'est la cible principale d\'un programme bien conçu.',
    detail: 'Le MAV d\'un grand muscle en hypertrophie est ~12-20 séries/sem pour un intermédiaire. Trop peu = sous-stimulation. Trop = dépassement du MRV.',
    source: 'Israetel, Hoffmann, Smith — Renaissance Periodization (2019)',
    application: 'Cibler le MAV à la 3e-4e semaine du mésocycle, après avoir progressé depuis le MEV.',
    example: 'Ex : un intermédiaire commence à 10 séries/sem de pectoraux (MEV), ajoute 1 série par semaine pour atteindre 16 (MAV) à la semaine 7 avant la décharge.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['MAV', 'volume optimal', 'adaptation', 'séries'],
  },
  {
    id: 'vol_003',
    topic: 'volume',
    subtopics: ['MRV', 'volume maximal récupérable'],
    finding: 'Le MRV est le volume maximum au-delà duquel la récupération est impossible et les performances régressent.',
    detail: 'Dépasser le MRV mène au surentraînement. Le MRV évolue avec le niveau. Un avancé en hypertrophie peut tolérer 20-26+ séries/sem sur les grands muscles.',
    source: 'Israetel et al. — RP Strength (2019)',
    application: 'Utiliser le MRV comme plafond uniquement en phase de surcharge planifiée, suivi d\'une décharge.',
    example: 'Ex : un avancé atteint 22 séries/sem de dos, remarque que ses performances stagnent et sa fatigue monte → il est au MRV. La semaine suivante : décharge -40% volume.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['MRV', 'surentraînement', 'volume maximum', 'récupération'],
  },
  {
    id: 'vol_004',
    topic: 'volume',
    subtopics: ['volume indirect', 'séries secondaires'],
    finding: 'Les muscles secondaires reçoivent ~50% du stimulus des muscles primaires lors d\'un exercice composé.',
    detail: 'Un développé couché entraîne les pectoraux (1×) mais aussi les triceps et deltoïdes antérieurs (~0.5×). Ce volume indirect doit être comptabilisé pour éviter le surentraînement des petits muscles.',
    source: 'Israetel — RP Strength ; Vigotsky et al. 2017',
    application: 'Compter 0.5× les séries pour les muscles secondaires. Un programme avec beaucoup de composés pré-fatigue les petits muscles.',
    example: 'Ex : 4 séries de développé + 4 séries d\'OHP = 8 séries indirectes épaules. Ajouter trop d\'élévations latérales en plus dépasse le MRV des deltoïdes.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Biceps', 'Triceps', 'Épaules'],
    keywords: ['volume indirect', 'muscles secondaires', 'composés', 'stimulus'],
  },
  {
    id: 'vol_005',
    topic: 'volume',
    subtopics: ['volume par séance', 'diminishing returns'],
    finding: 'Au-delà de 8-12 séries directes par muscle par séance, les gains additionnels sont minimes et la fatigue excessive.',
    detail: 'La synthèse protéique est maximalement stimulée après ~4-6 séries de haute intensité. Les séries supplémentaires accumulent de la fatigue sans bénéfice proportionnel.',
    source: 'Baz-Valle et al. 2018 ; Heaselgrave et al. 2019',
    application: 'Limiter à 8-12 séries directes par muscle par séance. Diviser le volume sur 2 séances minimum.',
    example: 'Ex : faire 20 séries de biceps le même jour ne donne pas 2× les résultats de 10 séries — la qualité des 10 dernières séries est trop dégradée.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['volume par séance', 'fatigue', 'diminishing returns'],
  },
  {
    id: 'vol_006',
    topic: 'volume',
    subtopics: ['volume débutant', 'adaptation neurale', 'sélection exercice débutant'],
    finding: 'Les débutants progressent avec des volumes très faibles (3-6 séries/muscle/sem). L\'adaptation neurale domine — la sélection fine des exercices (étirement vs pic de contraction, isolation, tempo) n\'a aucun impact supplémentaire à ce stade.',
    detail: 'Chez un débutant, le facteur limitant est la coordination neuromusculaire, pas la spécificité du stimulus musculaire. N\'importe quel stimulus au-dessus du MEV produit des gains maximaux. Les composés fondamentaux (squat, bench, rowing, deadlift, OHP) couvrent naturellement les deux profils de tension (étirement en bas du mouvement, contraction en haut) sans qu\'il soit nécessaire de les optimiser. Ajouter des isolations, choisir des exercices à fort étirement vs pic de contraction, ou varier les rep ranges par profil de tension n\'accélère pas les gains chez le débutant — cela complique inutilement et détourne de l\'apprentissage technique.',
    source: 'Kraemer & Ratamess 2004 ; Rhea et al. 2003 ; Sale (1988) — neural adaptations in strength training ; Schoenfeld (2010) — mechanisms of hypertrophy',
    application: 'Pour les débutants : 3-6 séries/muscle/sem sur composés fondamentaux uniquement. Pas d\'isolation nécessaire. Pas besoin d\'optimiser étirement/contraction. Progresser en charge chaque séance. Quand la progression linéaire s\'arrête (3-6 mois) → passer aux principes intermédiaires incluant la sélection fine des exercices.',
    example: 'Ex : débutant — squat 3×8 (étirement + contraction quadriceps couverts naturellement), développé 3×8, rowing 3×8. Aucun leg extension, aucun curl nécessaire. En 3 mois, gains musculaires maximaux. Un débutant qui ajoute leg extension + curl incliné + kickback ne progresse pas plus vite, mais se fatigue plus et apprend moins bien les composés.',
    objectives: ['hypertrophy', 'strength', 'endurance'],
    levels: ['beginner'],
    muscles: [],
    keywords: ['débutant', 'volume faible', 'adaptation neurale', 'composés', 'sélection exercice', 'isolation inutile'],
  },
  {
    id: 'vol_007',
    topic: 'volume',
    subtopics: ['junk volume'],
    finding: 'Le "junk volume" désigne les séries réalisées avec une fatigue trop élevée pour produire un stimulus adaptatif suffisant.',
    detail: 'Des séries réalisées avec RIR > 4 ou en état de fatigue marquée ne déclenchent pas suffisamment la synthèse protéique. Le volume de qualité prime sur la quantité.',
    source: 'Schoenfeld & Grgic 2019 ; Israetel RP Strength',
    application: 'Réduire le RIR cible en fin de mésocycle plutôt qu\'ajouter des séries de mauvaise qualité.',
    example: 'Ex : faire 5 séries de curl quand on est épuisé après 10 séries de composés, avec des reps bâclées, ne vaut pas mieux que 0 série supplémentaire.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['junk volume', 'RIR', 'qualité séries', 'fatigue'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // FRÉQUENCE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'freq_001',
    topic: 'frequency',
    subtopics: ['2x/semaine', 'hypertrophie'],
    finding: 'Entraîner un muscle 2×/semaine produit significativement plus d\'hypertrophie que 1×/semaine à volume égal.',
    detail: 'La synthèse protéique musculaire culmine 24-36h après une séance et revient au niveau de base en 48-72h. Avec 1×/sem, 4-5 jours de fenêtre anabolique sont perdus.',
    source: 'Schoenfeld et al. 2016 — J Strength Cond Res ; Krieger 2010 (méta-analyse)',
    application: 'Minimum 2× par semaine par muscle pour l\'hypertrophie. Répartir le volume sur au moins 2 séances.',
    example: 'Ex : passer d\'un "chest day" 1×/sem à 2× (lundi et jeudi) avec le même volume total produit +30% d\'hypertrophie pectorale en 12 semaines.',
    objectives: ['hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['fréquence', '2x semaine', 'MPS', 'hypertrophie'],
  },
  {
    id: 'freq_002',
    topic: 'frequency',
    subtopics: ['3x/semaine', 'volume égal'],
    finding: '3×/semaine ne produit pas significativement plus d\'hypertrophie que 2×/semaine à volume total égal.',
    detail: 'L\'avantage de 3× est de permettre de répartir un volume élevé en sessions plus courtes. Si le volume est identique, 2× et 3× donnent des résultats similaires.',
    source: 'Brigatto et al. 2019 — J Strength Cond Res',
    application: 'Passer à 3× uniquement si le volume hebdomadaire ne peut pas être casé en 2 séances de qualité.',
    example: 'Ex : 18 séries/sem de quadriceps peuvent être réparties en 3×6 plutôt que 2×9, permettant des séances plus courtes et une meilleure qualité par session.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['fréquence', '3x semaine', 'volume égal'],
  },
  {
    id: 'freq_003',
    topic: 'frequency',
    subtopics: ['force', 'neural', 'pattern'],
    finding: 'En force, la fréquence élevée (3×/sem par pattern) est supérieure car l\'adaptation est principalement neurale.',
    detail: 'Le gain de force dépend à 70% des adaptations neuromotrices. Ces adaptations sont renforcées par la répétition fréquente du pattern de mouvement.',
    source: 'Häkkinen & Komi 1983 ; Raastad et al. 2000',
    application: 'Entraîner les mouvements de force 2-3× par semaine à intensités variées.',
    example: 'Ex : squatter 3×/sem (lourd lundi, moyen mercredi, léger vendredi) progresse plus vite qu\'1× /sem à volume égal car le cerveau apprend le pattern 3× plus vite.',
    objectives: ['strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['force', 'fréquence', 'neural', 'pattern'],
  },
  {
    id: 'freq_004',
    topic: 'frequency',
    subtopics: ['récupération SNC', 'composés lourds'],
    finding: 'Les exercices composés très lourds (>85% 1RM) requièrent 72-96h de récupération du SNC.',
    detail: 'La fatigue SNC après un entraînement de force maximal affecte la capacité à recruter les unités motrices rapides. Forcer la session avant récupération = perte de qualité et risque blessure.',
    source: 'Ahtiainen et al. 2003 ; Häkkinen 1989',
    application: 'Minimum 72h entre deux séances lourdes sur le même pattern. Accessoires et travail léger peuvent reprendre à 48h.',
    example: 'Ex : deadlift lourd lundi → pas de squat ou RDL lourd avant jeudi. Mais des leg curls légers mercredi sont possibles.',
    objectives: ['strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['SNC', 'récupération', 'composés', 'force', '72h'],
  },
  {
    id: 'freq_005',
    topic: 'frequency',
    subtopics: ['endurance', 'fréquence élevée'],
    finding: 'L\'endurance musculaire bénéficie d\'une fréquence élevée (5-6×/sem) car les adaptations métaboliques nécessitent un stimulus répété fréquemment.',
    detail: 'Les adaptations à l\'endurance (densité mitochondriale, capillarisation, enzymes oxydatives) sont renforcées par la répétition fréquente à faible intensité. La récupération est rapide.',
    source: 'Hickson et al. 1981 ; Leveritt et al. 1999',
    application: 'Pour l\'endurance musculaire, viser 5×/sem avec des sessions de 30-40 min.',
    example: 'Ex : 5×30 min d\'endurance musculaire (circuit léger, repos courts) donne de meilleures adaptations métaboliques que 3×50 min à semaine égale.',
    objectives: ['endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['endurance', 'fréquence', 'mitochondries', 'métabolique'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // INTENSITÉ & RIR
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'int_001',
    topic: 'intensity',
    subtopics: ['RIR', 'proximité à l\'échec'],
    finding: 'La proximité à l\'échec est un déterminant clé de l\'hypertrophie. Les dernières reps (RIR 0-2) sont les plus stimulantes.',
    detail: 'Les unités motrices rapides (type II) ne sont recrutées massivement qu\'en fin de série quand la fatigue force le recrutement maximal. Séries à RIR 4+ ne stimulent pas pleinement ces fibres.',
    source: 'Schoenfeld 2010 — J Strength Cond Res ; Morton et al. 2016',
    application: 'Viser RIR 1-3 sur la plupart des séries. Dernière série d\'isolation : RIR 0.',
    example: 'Ex : curl haltères, séries 1-3 → RIR 2 (arrêt 2 reps avant l\'échec). Série 4 (dernière) → RIR 0, c\'est-à-dire jusqu\'à l\'impossible. Les triceps ne participent pas, sécurité maximale.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['RIR', 'proximité échec', 'unités motrices', 'intensité'],
  },
  {
    id: 'int_002',
    topic: 'intensity',
    subtopics: ['échec musculaire', 'risques'],
    finding: 'L\'entraînement systématique à l\'échec ne produit pas plus d\'hypertrophie que proche de l\'échec, mais augmente fatigue et risque de blessure.',
    detail: 'RIR 0-1 vs RIR 0 produisent des gains similaires. L\'échec systématique accélère la fatigue cumulée et sur les composés lourds, expose à des risques bioméchaniques.',
    source: 'Schoenfeld & Grgic 2019 ; Giessing et al. 2016',
    application: 'Réserver l\'échec à la dernière série d\'isolation sur machines/câbles. Jamais à l\'échec sur squat, deadlift, bench barre, OHP barre.',
    example: 'Ex : développé couché — on ne va jamais à l\'échec car sans pareur la barre peut bloquer. Pec deck en fin de séance : dernière série jusqu\'à l\'échec = sécurité totale.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['échec', 'RIR 0', 'fatigue', 'blessure', 'sécurité'],
  },
  {
    id: 'int_003',
    topic: 'intensity',
    subtopics: ['%1RM', 'plages de répétitions'],
    finding: 'L\'hypertrophie peut être stimulée sur une large plage de charges (30-85% 1RM) si l\'effort est suffisant.',
    detail: 'Étude Schoenfeld 2017 : 3 séries à 80% 1RM vs 3 séries à 30% 1RM à l\'échec = gains musculaires équivalents. La proximité à l\'échec prime sur la charge pour l\'hypertrophie.',
    source: 'Schoenfeld et al. 2017 — J Strength Cond Res',
    application: 'Varier les plages (6-8, 10-15, 15-25) pour diversifier le stimulus et minimiser la fatigue articulaire.',
    example: 'Ex : après une séance de bench lourd (6-8 reps), finir avec des élévations latérales légères à 20-25 reps jusqu\'à l\'échec. Même signal hypertrophique, moins de stress articulaire.',
    objectives: ['hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['%1RM', 'répétitions', 'charge', 'hypertrophie'],
  },
  {
    id: 'int_004',
    topic: 'intensity',
    subtopics: ['force', '%1RM spécifique'],
    finding: 'La force maximale nécessite des charges ≥80% 1RM pour développer les adaptations neurales spécifiques.',
    detail: 'Les adaptations neurales spécifiques à l\'effort maximal (RFD, recrutement des UM rapides sous charge élevée) nécessitent des intensités élevées. La force ne peut pas être développée avec des charges légères à l\'échec.',
    source: 'Behm & Sale 1993 ; Aagaard et al. 2002',
    application: 'Pour la force, travailler ≥80% 1RM sur les composés principaux. Accessoires à 60-75%.',
    example: 'Ex : faire du squat à 50% 1RM pour "la force" ne développe pas la capacité à recruter les UM rapides sous charge max. Il faut monter à 80-90% pour forcer cette adaptation.',
    objectives: ['strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['force', '%1RM', 'intensité', 'neural'],
  },
  {
    id: 'int_005',
    topic: 'intensity',
    subtopics: ['tempo', 'excentrique lent'],
    finding: 'La phase excentrique lente (3-4 sec) augmente le dommage musculaire et le temps sous tension, potentialisant l\'hypertrophie.',
    detail: 'La phase excentrique génère plus de tension mécanique et de dommages musculaires que la concentrique à charge égale. Un tempo 4010 sur les isolations amplifie la réponse hypertrophique.',
    source: 'Schoenfeld 2010 ; Roig et al. 2009',
    application: 'Ajouter un tempo excentrique lent (3-4 sec) sur les isolations en bloc C.',
    example: 'Ex : curl haltères — descente en 4 secondes (excentrique lent), montée normale. On ressent le biceps travailler tout au long de la descente plutôt que de laisser tomber.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['tempo', 'excentrique', 'temps sous tension', 'dommage musculaire'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // RÉCUPÉRATION & SRA
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'rec_001',
    topic: 'recovery',
    subtopics: ['SRA', 'cycle fondamental'],
    finding: 'Le cycle SRA (Stimulus → Récupération → Adaptation) est le fondement de toute progression.',
    detail: 'La prochaine séance doit tomber en phase de supercompensation. Hypertrophie : 48h optimal. Force composés lourds : 72-96h.',
    source: 'Selye 1956 (GAS) ; Bompa & Haff 2009',
    application: 'Programmer les séances du même groupe à 48h minimum (hypertrophie) ou 72h (force lourde).',
    example: 'Ex : séance pectoraux lundi → la synthèse protéique culmine mardi-mercredi → prochaine séance pectoraux jeudi = fenêtre optimale de supercompensation.',
    objectives: ['hypertrophy', 'strength', 'endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['SRA', 'récupération', 'supercompensation', 'adaptation'],
  },
  {
    id: 'rec_002',
    topic: 'recovery',
    subtopics: ['sommeil', 'GH', 'synthèse protéique'],
    finding: 'Le sommeil est le principal facteur de récupération musculaire. <7h réduit la synthèse protéique et augmente le catabolisme.',
    detail: 'La GH est sécrétée à 80% pendant le sommeil profond. <6h → cortisol élevé, testostérone réduite, performance diminuée de 10-30%.',
    source: 'Dattilo et al. 2011 — Med Hypotheses ; Mah et al. 2011',
    application: 'Viser 7-9h de sommeil/nuit. Mauvais sommeil persistant = signal de décharge.',
    example: 'Ex : athlète qui dort 5h/nuit 3 semaines de suite → performances en baisse de 15-20%, même si l\'entraînement est parfait. La récupération se passe la nuit.',
    objectives: ['hypertrophy', 'strength', 'endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['sommeil', 'GH', 'récupération', 'cortisol'],
  },
  {
    id: 'rec_003',
    topic: 'recovery',
    subtopics: ['DOMS', 'courbatures'],
    finding: 'Les DOMS ne sont pas corrélés à l\'hypertrophie. Absence de courbatures ≠ mauvaise séance.',
    detail: 'Un muscle adapté produit moins de DOMS sans pour autant moins progresser. Les DOMS proviennent des dommages musculaires et de l\'inflammation.',
    source: 'Schoenfeld & Contreras 2013 — Strength & Cond J',
    application: 'Ne pas utiliser les DOMS comme indicateur. Se fier au RIR et à la progression de charge.',
    example: 'Ex : un athlète de 2 ans d\'entraînement ne ressent plus de courbatures après le squat mais progresse toujours. Normal — le muscle est adapté au stimulus, pas insuffisamment travaillé.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['DOMS', 'courbatures', 'dommages musculaires', 'progrès'],
  },
  {
    id: 'rec_004',
    topic: 'recovery',
    subtopics: ['overreaching', 'surentraînement'],
    finding: 'L\'overreaching fonctionnel est normal et planifié. L\'overreaching non fonctionnel mène au surentraînement en 2-4 semaines.',
    detail: 'En phase de volume élevé (MRV), une fatigue accumulée est intentionnelle, suivie d\'une décharge qui permet la supercompensation. Si la fatigue persiste après décharge : surentraînement.',
    source: 'Meeusen et al. 2013 — European Journal of Sport Science',
    application: 'Distinguer fatigue programmée (décharger) vs fatigue pathologique (repos complet).',
    example: 'Ex : semaine 7 d\'un mésocycle, l\'athlète est épuisé. Décharge semaine 8. Si semaine 9 il est requinqué → overreaching fonctionnel. Si toujours épuisé → problème plus profond.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['overreaching', 'surentraînement', 'fatigue', 'décharge'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPS DE REPOS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'rest_001',
    topic: 'rest_times',
    subtopics: ['force', 'créatine phosphate'],
    finding: 'Pour la force maximale, 3-5 min de repos sont nécessaires pour la resynthèse complète de la créatine phosphate et la récupération SNC.',
    detail: 'La CP se restaure à ~80% en 3 min et à ~97% en 5 min. Moins de 2 min → perte de performance significative sur les composés lourds.',
    source: 'Ahtiainen et al. 2005 ; Kraemer & Ratamess 2004',
    application: 'Programmer 3-5 min entre les séries de composés lourds.',
    example: 'Ex : squat à 90% 1RM. Repos 2 min → on perd 15-20% de performance sur la série suivante. Repos 4 min → on maintient la performance.',
    objectives: ['strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['repos', 'créatine phosphate', 'force', 'SNC'],
  },
  {
    id: 'rest_002',
    topic: 'rest_times',
    subtopics: ['hypertrophie', 'repos long supérieur'],
    finding: 'Des repos de 2-3 min entre séries sont supérieurs à 1 min pour l\'hypertrophie, contrairement à la croyance populaire.',
    detail: 'Étude Schoenfeld 2016 : repos 1 min vs 3 min → gains musculaires ET de force significativement supérieurs avec 3 min. Les repos courts limitent le volume de qualité.',
    source: 'Schoenfeld et al. 2016 — J Strength Cond Res',
    application: '2-3 min pour les composés (bloc A/B), 60-90s pour les isolations (bloc C).',
    example: 'Ex : 4 séries de rowing haltères. Avec 1 min de repos, la série 3 est déjà dégradée. Avec 2.5 min, les 4 séries sont de qualité équivalente → stimulus total supérieur.',
    objectives: ['hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['repos', 'hypertrophie', 'qualité séries'],
  },
  {
    id: 'rest_003',
    topic: 'rest_times',
    subtopics: ['supersets antagonistes', 'efficacité'],
    finding: 'Les supersets antagonistes permettent de réduire le temps de séance de 35-40% sans compromettre les performances.',
    detail: 'Pendant que le muscle A se repose, le muscle B travaille. Le repos actif sur antagoniste n\'affecte pas la performance de l\'agoniste — parfois même une légère potentiation.',
    source: 'Robbins et al. 2010 ; Paz et al. 2017',
    application: 'Utiliser les supersets antagonistes (Poitrine/Dos, Biceps/Triceps, Quadriceps/Ischio) pour compresser les séances sans perte de qualité.',
    example: 'Ex : développé couché, puis immédiatement rowing câble (dos). Pendant que les pecs se reposent, le dos travaille. 45-60s de repos suffisent entre les paires vs 2-3 min sans superset.',
    objectives: ['hypertrophy', 'endurance'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['superset', 'antagonistes', 'temps', 'efficacité'],
  },
  {
    id: 'rest_004',
    topic: 'rest_times',
    subtopics: ['endurance', 'repos courts'],
    finding: 'Les repos courts (30-60s) en endurance musculaire forcent les adaptations métaboliques.',
    detail: 'L\'endurance musculaire tire son adaptation d\'un stress métabolique maintenu. Des repos courts entretiennent l\'acidose lactique et stimulent les voies de signalisation métaboliques.',
    source: 'Gibala et al. 2012 ; Hawley & Stepto 2001',
    application: 'Pour l\'endurance musculaire, maintenir 30-60s de repos entre séries.',
    example: 'Ex : circuit 15 reps squat + 15 reps développé + 15 reps rowing, 30s de repos entre exercices. L\'accumulation de lactate force les adaptations métaboliques locales.',
    objectives: ['endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['endurance', 'repos courts', 'lactate', 'métabolique'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PROGRESSION
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'prog_001',
    topic: 'progression',
    subtopics: ['surcharge progressive', 'fondamental'],
    finding: 'La surcharge progressive est le principe le plus important : le corps doit être progressivement plus sollicité pour continuer à s\'adapter.',
    detail: 'Sans surcharge progressive, l\'adaptation s\'arrête. Les trois variables : charge, volume, densité. On ne peut augmenter qu\'une seule à la fois.',
    source: 'DeLorme 1945 ; Kraemer & Ratamess 2004',
    application: 'Augmenter la charge (si RIR ≥ 2) OU le volume (si charge maintenue) — jamais les deux simultanément.',
    example: 'Ex : curl haltères, 4×10 à 12kg avec RIR 2 → session suivante : 4×10 à 14kg. Ne pas augmenter à 4×12 en même temps.',
    objectives: ['hypertrophy', 'strength', 'endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['surcharge progressive', 'progression', 'adaptation', 'charge', 'volume'],
  },
  {
    id: 'prog_002',
    topic: 'progression',
    subtopics: ['double progression'],
    finding: 'La double progression (reps d\'abord, puis charge) est le mécanisme universel de progression — les fourchettes varient par objectif mais le principe est identique.',
    detail: 'On progresse en reps jusqu\'au haut de la fourchette choisie sur TOUTES les séries au RIR cible, PUIS on augmente la charge de 2,5 kg et on revient au bas. IMPORTANT : l\'hypertrophie se produit sur toute plage 5–30+ reps à effort équivalent (Schoenfeld 2017) — il n\'y a pas de fourchette universelle. La fourchette dépend de l\'exercice (composé = plus lourd, isolation = plus léger), du bloc (A plus lourd, C plus léger), et des préférences articulaires. Pour la force : 1–6 reps imposé par la spécificité neuromusculaire (Haff 2016). Pour les débutants : progression linéaire de charge séance à séance possible — passer à double progression quand les gains s\'arrêtent.',
    source: 'Schoenfeld et al. (2017) JSCR — "Resistance Training Volume Enhances Muscle Hypertrophy Regardless of Rep Range" ; GZCLP, PHUL, RP ; Haff & Triplett (2016)',
    application: 'Laisser le LLM libre de choisir la fourchette selon l\'exercice et le bloc. Guides : composés du bas du corps (squats, presse) → 5–10 reps ; composés du haut (développés) → 6–12 ; isolation (curl, extension) → 10–20 ou 15–30. Ne jamais fixer 8–12 comme règle universelle pour l\'hypertrophie.',
    example: 'Squat 5×5 peut produire autant d\'hypertrophie que 3×12 si l\'effort est équivalent. Leg extension 4×20 est souvent plus efficace que 4×10 (moins de risque articulaire, plus de tension métabolique sur le quad). Curl haltères à 3×15-20 = hypertrophie biceps validée.',
    objectives: ['hypertrophy', 'strength', 'endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['double progression', 'reps', 'charge', 'fourchette', 'méthode', 'runway'],
  },
  {
    id: 'prog_density_001',
    topic: 'progression',
    subtopics: ['densité', 'temps de repos', 'surcharge progressive', 'levier'],
    finding: 'La réduction du temps de repos (augmentation de la densité d\'entraînement) est un levier valide de surcharge progressive, particulièrement pour l\'endurance musculaire et quand le volume est au MRV.',
    detail: 'La surcharge progressive peut s\'appliquer via 4 leviers hiérarchiques : 1) Charge (+2.5kg quand RIR ≥ 2). 2) Volume (+1 série/sem jusqu\'au MRV). 3) Densité (réduire le repos de 10-15s quand charge et volume sont plafonnés). 4) Variation (changer d\'exercice quand tout est épuisé). Pour l\'endurance musculaire, la densité EST le levier primaire — des repos plus courts forcent les adaptations métaboliques. Pour la force et l\'hypertrophie, la densité est un levier TERTIAIRE : réduire le repos trop tôt compromet la qualité des séries et le stimulus. Schoenfeld 2016 confirme que des repos plus longs produisent plus de gains en hypertrophie.',
    source: 'Israetel RP Strength — progression hierarchy (2019-2024) ; Schoenfeld et al. (2016) rest intervals and hypertrophy ; Gibala et al. (2012) metabolic adaptations density training',
    application: 'Ordre de progression : charge d\'abord → volume ensuite → densité en dernier (sauf endurance). Ne jamais réduire le repos sur les composés de force (squat, deadlift, bench lourd) — le repos complet est non-négociable pour la qualité d\'exécution. Réduire repos sur isolations/accessoires uniquement.',
    example: 'Ex : athlète bloqué à 100kg curl haltères, 4×10, repos 90s, au MRV (16 séries/sem). Progression : 1) charge bloquée → 2) volume au MRV → 3) réduire repos de 90s → 75s la semaine suivante → 60s ensuite. Le même travail en moins de temps = surcharge de densité.',
    objectives: ['hypertrophy', 'endurance'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['densité', 'temps de repos', 'surcharge progressive', 'progression', 'MRV', 'endurance', 'levier'],
  },
  {
    id: 'prog_003',
    topic: 'progression',
    subtopics: ['plateau', 'stagnation'],
    finding: 'Un plateau sans fatigue élevée signale un problème structurel (volume insuffisant, variation nécessaire) et non de fatigue.',
    detail: 'Deux types de plateau : 1) Fatigue → RIR diminue → décharger. 2) Structural → performance stagne malgré fatigue faible → augmenter volume ou varier.',
    source: 'Israetel RP ; Buckner et al. 2017',
    application: 'Distinguer plateau de fatigue (→ décharge) vs plateau structural (→ plus de volume ou nouvel exercice).',
    example: 'Ex : curl barre bloqué à 40kg depuis 6 semaines. Fatigue normale, RIR normal. Solution : changer pour curl incliné (nouveau stimulus) ou augmenter de 1 série par semaine.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['plateau', 'stagnation', 'fatigue', 'structural'],
  },
  {
    id: 'prog_004',
    topic: 'progression',
    subtopics: ['débutant', 'progression linéaire'],
    finding: 'Les débutants peuvent progresser à chaque séance (progression linéaire par session) pendant 3-6 mois.',
    detail: 'Les adaptations neurales rapides permettent des gains de force hebdomadaires de 5-15%. Cette "fenêtre de novice" dure jusqu\'à ~6 mois.',
    source: 'Rippetoe & Kilgore — Starting Strength ; Kraemer 2004',
    application: 'Pour les débutants : progression linéaire (+2.5kg par session sur composés). Ne pas complexifier.',
    example: 'Ex : débutant squatte 60kg semaine 1 → 62.5kg semaine 2 → 65kg semaine 3. Cette progression est normale et doit être maintenue tant que possible.',
    objectives: ['strength', 'hypertrophy'],
    levels: ['beginner'],
    muscles: [],
    keywords: ['débutant', 'progression linéaire', 'novice', 'neural'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PÉRIODISATION
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'period_001',
    topic: 'periodization',
    subtopics: ['mésocycle', 'structure'],
    finding: 'Un mésocycle de 4-8 semaines (MEV → MAV → MRV → décharge) est la structure la plus efficace pour accumuler du volume sans surentraîner.',
    detail: 'Semaines 1-2 : MEV. Semaines 3-5 : MAV. Semaines 6-7 : MRV. Semaine 8 : décharge. La progression de volume hebdomadaire (+1-2 séries/muscle) permet un suivi précis.',
    source: 'Israetel et al. — RP Strength 2019 ; Bompa & Haff 2009',
    application: 'Structurer les programmes en mésocycles de 6-10 semaines avec progression de volume et décharge planifiée.',
    example: 'Ex : 8 semaines de pectoraux — 10 séries sem1, 11 sem2, 12 sem3, 14 sem4, 16 sem5, 18 sem6, 20 sem7 → décharge 10 séries sem8. Supercompensation semaine 9.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['mésocycle', 'périodisation', 'MEV', 'MAV', 'MRV', 'décharge'],
  },
  {
    id: 'period_002',
    topic: 'periodization',
    subtopics: ['DUP', 'périodisation ondulante'],
    finding: 'La périodisation ondulante quotidienne (DUP) produit des gains de force supérieurs à la périodisation linéaire.',
    detail: 'Ex : Lundi force (3-5 reps), mercredi hypertrophie (8-12 reps), vendredi puissance (1-3 reps). La variation du stimulus prévient l\'accommodation.',
    source: 'Rhea et al. 2002 ; Miranda et al. 2011',
    application: 'Utiliser le DUP pour les intermédiaires+ qui stagnent en périodisation linéaire.',
    example: 'Ex : bench press 3× semaine — lundi 5×5 à 85% 1RM, mercredi 4×10 à 70%, vendredi 3×15 à 60%. Chaque séance cible une qualité différente, pas d\'accommodation.',
    objectives: ['strength', 'hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['DUP', 'périodisation ondulante', 'variation', 'accommodation'],
  },
  {
    id: 'period_003',
    topic: 'periodization',
    subtopics: ['peaking', 'test 1RM'],
    finding: 'Un bloc de peaking de 1-2 semaines (volume -60%, intensité 90-102%) permet de réaliser les gains et d\'améliorer la performance maximale de 5-10%.',
    detail: 'La fatigue accumulée en phase de volume masque la force réelle. En réduisant le volume et augmentant l\'intensité, la fatigue se dissipe et la performance maximale est exprimée.',
    source: 'Zourdos et al. 2016 ; Fry & Kraemer 1997',
    application: 'Programmer 1-2 semaines de peaking en fin de cycle force : volume -60%, intensité 85-102% 1RM.',
    example: 'Ex : powerlifter squatte 6×6 à 80% pendant le mésocycle. Semaine de peaking : 3×2 à 90%, puis 2×1 à 95%, puis tentative 102%. La fatigue dissipée révèle sa vraie force.',
    objectives: ['strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['peaking', '1RM', 'intensité', 'performance'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // DÉCHARGE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'deload_001',
    topic: 'deload',
    subtopics: ['protocole', 'volume -40%'],
    finding: 'Une décharge efficace réduit le volume de 40-50% tout en maintenant les charges et la fréquence.',
    detail: 'Réduire la charge entraîne une perte des adaptations neurales. Réduire le volume (séries) permet de récupérer tout en maintenant le signal d\'adaptation. Durée : 5-7 jours.',
    source: 'Pritchard et al. 2015 — J Strength Cond Res',
    application: 'Décharge : -40% volume, charges identiques, fréquence maintenue. Durée 1 semaine.',
    example: 'Ex : programme normal 4×10 squat 3×/sem → décharge : 2×10 squat 3×/sem, même charge. Le corps récupère sans perdre les adaptations neurales.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['décharge', 'deload', 'volume', 'récupération'],
  },
  {
    id: 'deload_002',
    topic: 'deload',
    subtopics: ['auto-régulée', 'signaux'],
    finding: 'Les décharges auto-régulées (basées sur des signaux) sont supérieures aux décharges fixes pour la plupart des athlètes non compétitifs.',
    detail: 'Les individus ont des capacités de récupération très variables. Décharger sur signaux (drift RIR, fatigue persistante, stagnation) est plus précis qu\'une décharge toutes les 4 sem.',
    source: 'Israetel & Hoffman — RP Strength 2017',
    application: 'Déclencher la décharge sur : drift RIR, fatigue globale ≥4/5 sur 2 séances, régression de performance.',
    example: 'Ex : athlète qui trouve ses 100kg au squat "lourds comme 110kg" depuis 2 semaines, avec courbatures persistantes → décharge immédiate, pas d\'attente de la semaine 8.',
    objectives: ['hypertrophy', 'strength', 'endurance'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['décharge', 'auto-régulée', 'signaux', 'fatigue'],
  },
  {
    id: 'deload_003',
    topic: 'deload',
    subtopics: ['tendons', 'force', 'préventif'],
    finding: 'L\'entraînement de force (>85% 1RM) accumule un stress tendineux qui nécessite une décharge préventive après 6-8 semaines.',
    detail: 'Les tendons récupèrent 2-3× plus lentement que le muscle. Le stress cumulé à haute intensité peut mener à des tendinopathies sans symptômes évidents.',
    source: 'Cook & Purdam 2009 ; Docking & Cook 2016',
    application: 'En objectif force, décharge préventive systématique après 7 semaines même sans signaux musculaires.',
    example: 'Ex : powerlifter sans douleur mais à la semaine 7 de charges lourdes → décharge préventive. Le tendon rotulien ou le coude ne "prévient pas" avant de lâcher.',
    objectives: ['strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['tendons', 'force', 'décharge préventive', 'blessure'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SPLITS & STRUCTURE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'split_001',
    topic: 'split',
    subtopics: ['full body', 'débutant'],
    finding: 'Le full body 3×/semaine est le split le plus efficace pour les débutants car il maximise la fréquence des patterns fondamentaux.',
    detail: 'Les débutants bénéficient avant tout de répéter les mouvements fondamentaux fréquemment. La fréquence prime sur le volume total.',
    source: 'Kraemer 2004 ; Rhea et al. 2003',
    application: 'Débutant : full body 3×/semaine avec composés fondamentaux. Progression linéaire par session.',
    example: 'Ex : lundi squat+bench+rowing, mercredi deadlift+OHP+tirage, vendredi squat+bench+rowing. Chaque pattern vu 3×/sem → adaptations neurales maximisées.',
    objectives: ['strength', 'hypertrophy'],
    levels: ['beginner'],
    muscles: [],
    keywords: ['full body', 'débutant', 'fréquence', 'composés'],
  },
  {
    id: 'split_002',
    topic: 'split',
    subtopics: ['bro split', 'sous-optimal'],
    finding: 'Le bro split est sous-optimal pour les athlètes naturels car il limite la fréquence à 1×/semaine par muscle.',
    detail: 'La MPS retourne au niveau de base 48-72h après l\'entraînement. Avec 1×/semaine, ~4 jours de synthèse protéique sont perdus. Exception : athlètes assistés pharmacologiquement.',
    source: 'Schoenfeld et al. 2016 ; Krieger 2010',
    application: 'Éviter le bro split pour les naturels. Préférer upper/lower, PPL ou full body.',
    example: 'Ex : "chest day" lundi → MPS chest élevée mar-mer, retombe jeu. Si prochain chest day = lundi suivant, 4 jours de potentiel anabolique sont perdus chaque semaine.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['bro split', 'fréquence', 'naturel', 'MPS'],
  },
  {
    id: 'split_003',
    topic: 'split',
    subtopics: ['PPL', '6 jours'],
    finding: 'Le PPL 6 jours (Push/Pull/Legs × 2) est l\'un des splits les plus efficaces pour l\'hypertrophie avancée.',
    detail: 'PPL 6j : chaque muscle est entraîné 2× par semaine avec des sessions focalisées. Le volume total peut être très élevé sans sessions excessivement longues.',
    source: 'Israetel et al. RP Strength ; Colquhoun et al. 2018',
    application: 'PPL 6j pour hypertrophie intermédiaire/avancé. Organisation : P-P-L-P-P-L avec repos le dimanche.',
    example: 'Ex : Lun Push, Mar Pull, Mer Legs, Jeu Push, Ven Pull, Sam Legs, Dim repos. Chaque muscle 2×/sem, sessions de 60-75 min, volume hebdo élevé possible.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['PPL', '6 jours', 'split', 'hypertrophie'],
  },
  {
    id: 'split_004',
    topic: 'split',
    subtopics: ['PHUL', 'force + hypertrophie'],
    finding: 'Le PHUL permet de développer simultanément force et hypertrophie en 4 jours en séparant les stimuli.',
    detail: 'Jour 1 Upper Power (3-5 reps), Jour 2 Lower Power, Jour 3 Upper Hypertrophy (8-12 reps), Jour 4 Lower Hypertrophy. Chaque qualité est optimalement stimulée.',
    source: 'Layne Norton — PHUL Program',
    application: 'PHUL idéal pour double objectif force + hypertrophie sur 4 jours.',
    example: 'Ex : Lun Upper Power (bench lourd, row lourd), Mar Lower Power (squat lourd, DL), Jeu Upper Hyp (développé incliné, câbles, curl), Ven Lower Hyp (presse, leg curl, mollets).',
    objectives: ['strength', 'hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['PHUL', 'force', 'hypertrophie', '4 jours'],
  },

  {
    id: 'split_005',
    topic: 'split',
    subtopics: ['upper lower', '4 jours', 'intermédiaire'],
    finding: 'L\'upper/lower 4 jours est le split de référence pour l\'intermédiaire en hypertrophie : chaque muscle est entraîné 2×/semaine avec un volume par séance gérable (45-60 min).',
    detail: 'Structure : Lundi Upper, Mardi Lower, Jeudi Upper, Vendredi Lower. Chaque séance upper couvre pectoraux, dos, épaules, biceps, triceps. Chaque séance lower couvre quadriceps, ischio-jambiers, fessiers, mollets. Avantages vs PPL : fréquence 2× sur chaque muscle, récupération entre les deux séances upper/lower de 48h, sessions plus courtes que le PPL. Avantage vs full body : volume plus élevé par muscle par séance (8-12 séries vs 4-6 en full body). L\'upper/lower peut inclure une variation push/pull : Upper A (push emphasis) et Upper B (pull emphasis) pour augmenter la diversité sans changer la fréquence.',
    source: 'Schoenfeld & Krieger (2016) — fréquence 2x hypertrophie ; Israetel RP — split recommendations intermediate ; Colquhoun et al. (2018)',
    application: 'Intermédiaire hypertrophie 4 jours : Upper/Lower. Pour objectif mixte force+hypertrophie 4 jours : PHUL. Pour 5 jours intermédiaire avancé : UL+PPL hybride (2 upper + 2 lower + 1 PPL) ou PPL avec jour de repos supplémentaire.',
    example: 'Ex : Lun Upper A (développé bench, rowing barre, OHP, tirage, curl incliné), Mar Lower A (squat, RDL, leg press, leg curl, mollets). Jeu Upper B (développé incliné, pull-over, dips, face pull, curl marteau). Ven Lower B (presse à cuisses, leg curl assis, fentes, hip thrust). Chaque muscle 2×/sem, ~10 séries chacun.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['upper lower', '4 jours', 'split', 'intermédiaire', 'fréquence 2x'],
  },
  {
    id: 'split_006',
    topic: 'split',
    subtopics: ['arnold split', '6 jours', 'avancé', 'chest back chest back'],
    finding: 'L\'Arnold Split (chest+back / épaules+bras / jambes × 2) est adapté aux avancés souhaitant un volume très élevé par groupe avec une fréquence 2×/semaine.',
    detail: 'Structure : Lundi Chest+Back, Mardi Shoulders+Arms, Mercredi Legs, Jeudi Chest+Back, Vendredi Shoulders+Arms, Samedi Legs. Avantage principal : pectoraux et dos sont des antagonistes — pendant que le dos travaille, les pectoraux récupèrent activement, ce qui permet d\'enchaîner plus de volume sur les deux groupes dans la même séance sans dégrader la qualité. Cela n\'est pas une "potentiation" au sens neuromusculaire, mais une optimisation du repos actif intra-séance. Volume par séance élevé (60-90 min) mais 6 jours/semaine requis. Adapté uniquement aux avancés ayant la capacité de récupérer de 6 séances/semaine. Non recommandé pour intermediate car le volume par séance peut excéder le MRV à ce niveau.',
    source: 'Arnold Schwarzenegger — The Education of a Bodybuilder (1977) ; RP Israetel — split analysis (2021) ; Schoenfeld et al. (2016)',
    application: 'Réserver l\'Arnold Split aux avancés avec au moins 3 ans d\'entraînement régulier ET disponibilité 6j/semaine ET bonne tolérance de récupération. Vérifier que le volume chest+back par séance ne dépasse pas 10-12 séries directes.',
    example: 'Ex : Lun Chest+Back — développé plat 4×8, développé incliné 3×10, fly câble 3×15, rowing barre 4×8, tirage vertical 3×10, rowing unilatéral 3×12. Jeu : mêmes patterns, exercices différents. Volume total chest = 6-7 séances composés + 3 isolations = ~16 séries/sem.',
    objectives: ['hypertrophy'],
    levels: ['advanced'],
    muscles: [],
    keywords: ['arnold split', '6 jours', 'chest back', 'avancé', 'potentiation'],
  },
  {
    id: 'split_007',
    topic: 'split',
    subtopics: ['transition', 'débutant intermédiaire', 'quand changer de split'],
    finding: 'La transition débutant→intermédiaire se produit quand la progression linéaire séance à séance s\'arrête malgré une technique correcte, une nutrition suffisante et un sommeil adéquat.',
    detail: 'Critères de passage : 1) Impossible d\'ajouter du poids à chaque séance malgré 2-3 tentatives → fin de fenêtre novice. 2) Le full body 3×/sem génère trop de fatigue pour maintenir la qualité des séances → volume trop élevé pour récupérer en 48h. 3) Durée minimale : 4-6 mois d\'entraînement régulier avec composés. À ce stade : passer à upper/lower 4× (hypertrophie) ou à une programmation par semaine type Texas Method (force). Ajouter 2-3 exercices d\'isolation par séance. Passer à la double progression (reps→charge) vs progression linéaire pure. Volume passer de 3-6 à 8-12 séries/muscle/semaine.',
    source: 'Rippetoe & Kilgore — Starting Strength ; Israetel RP — intermediate transition ; Galpin 2022 — novice effect timeline',
    application: 'Si un utilisateur est en fenêtre novice : full body, progression linéaire, composés uniquement. Dès que 2 tentatives échouent à ajouter du poids sur les composés principaux → signaler la transition vers programme intermédiaire, upper/lower recommandé.',
    example: 'Ex : débutant squatte 100kg depuis 3 semaines sans pouvoir passer à 102.5kg malgré une bonne nutrition et sommeil → fin de la fenêtre novice. Recommandation : passer à upper/lower, adopter la double progression, ajouter des isolations.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate'],
    muscles: [],
    keywords: ['transition', 'débutant', 'intermédiaire', 'fenêtre novice', 'upper lower', 'progression linéaire'],
  },
  {
    id: 'period_004',
    topic: 'periodization',
    subtopics: ['débutant', 'pas de mésocycle', 'progression continue'],
    finding: 'Les débutants n\'ont pas besoin de mésocycles structurés (MEV→MRV→décharge) : la progression linéaire simple (ajouter du poids chaque séance) est le protocole optimal et suffisant pendant 3-6 mois.',
    detail: 'Les mésocycles RP (MEV→MAV→MRV→décharge) sont conçus pour les intermédiaires et avancés dont la progression est trop lente pour être linéaire. Un débutant progresse si vite (adaptations neurales) que tout protocole de variation de volume est inutile. Programmer un débutant avec un mésocycle = complexité inutile sans bénéfice. La décharge n\'est nécessaire qu\'en cas de fatigue excessive ou de blessure, pas de façon planifiée.',
    source: 'Rippetoe — Starting Strength (3e éd.) ; Kraemer 2004 ; Haff & Triplett 2016',
    application: 'Pour les débutants : programme fixe, même volume chaque semaine, augmentation de charge séance à séance. Pas de semaine de décharge planifiée. Pas de variation MEV/MAV/MRV. Décharge uniquement si signaux clairs (fatigue ≥4/5 persistante, blessure). La "périodisation débutant" = une seule progression : ajouter du poids.',
    example: 'Ex : débutant full body semaine 1 à 8 identiques — squat 3×5, bench 3×5, rowing 3×5. Ajouter 2.5kg par séance. Pas de semaine "légère" planifiée. Quand stagnation → vérifier nutrition/sommeil avant de changer le programme.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner'],
    muscles: [],
    keywords: ['débutant', 'périodisation', 'progression linéaire', 'pas de mésocycle', 'simple'],
  },
  {
    id: 'prog_005',
    topic: 'progression',
    subtopics: ['rotation exercices', 'accommodation', 'variation timing'],
    finding: 'Un exercice doit être maintenu 4-8 semaines minimum pour permettre l\'adaptation neurale, puis changé tous les 1-2 mésocycles pour éviter l\'accommodation.',
    detail: 'Changer d\'exercice trop tôt (<4 semaines) empêche les adaptations neurales de s\'installer et crée une DOMS excessive à chaque changement. Maintenir le même exercice trop longtemps (>4-6 mois) mène à l\'accommodation : le muscle devient efficace dans ce pattern spécifique et le stimulus s\'amoindrit. Règle pratique : 1-2 exercices de base restent constants (squat, bench, deadlift pour la force). Les exercices accessoires et isolations changent tous les 1-2 mésocycles. Signe d\'accommodation : performance stagnante sur 4+ semaines sans fatigue élevée et sans atteindre le MRV.',
    source: 'Israetel RP — exercise rotation principles (2020-2024) ; Colquhoun et al. (2018) — variation and accommodation ; Fonseca et al. (2014) — exercise variation and hypertrophy',
    application: 'Composés principaux (squat, bench, DL, OHP) : maintenir tout le programme. Exercices bloc B (accessoires composés) : changer tous les 2 mésocycles. Exercices bloc C (isolation) : changer tous les 1-2 mésocycles. Si plateau sans fatigue : changer l\'exercice en priorité avant d\'ajouter du volume.',
    example: 'Ex : intermédiaire fait curl barre depuis 8 semaines → stagnation sans fatigue. Changer pour curl incliné (nouveau stimulus d\'étirement) ou curl câble. Après 2 mésocycles de curl barre, la nouveauté suffit à relancer les gains.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['rotation exercices', 'accommodation', 'variation', 'timing', 'plateau'],
  },
  {
    id: 'prog_006',
    topic: 'progression',
    subtopics: ['rythme progression long terme', 'muscle par mois', 'niveau'],
    finding: 'Le rythme de prise de masse musculaire réelle est strictement limité par le niveau et le sexe. Hommes : débutant ~0.8-1.2kg/mois, intermédiaire ~0.3-0.5kg/mois, avancé ~0.1-0.2kg/mois. Femmes : environ 50-60% de ces taux à chaque niveau.',
    detail: 'Ces valeurs supposent un entraînement optimal, un surplus calorique adéquat et un sommeil suffisant. La prise de masse musculaire ralentit exponentiellement avec l\'expérience. Les femmes progressent structurellement moins vite en masse absolue (moins de testostérone, masse de départ inférieure) mais à des rythmes proportionnels similaires. Un "plateau" de 2 semaines chez un intermédiaire n\'est pas un vrai plateau — la résolution de mesure (pesée) est insuffisante pour détecter 0.1-0.2kg de muscle. Un vrai plateau chez un avancé se mesure sur 6-8 semaines minimum.',
    source: 'Lyle McDonald — Natural Muscular Potential (2003) ; Israetel RP — muscle gain rates (2019-2024) ; Schoenfeld et al. (2020) — sex differences in resistance training',
    application: 'Calibrer les attentes de progression par niveau. Débutant : progrès visibles en 4-6 semaines. Intermédiaire : visibles en 8-12 semaines. Avancé : changements perceptibles sur un mésocycle complet (8-12 semaines). Ne pas diagnostiquer un plateau avant ces délais. Ne pas changer le programme si les attentes ne correspondent pas aux gains normaux pour le niveau.',
    example: 'Ex : intermédiaire qui se pèse chaque semaine et ne voit pas de changement → normal. Le gain de ~0.3-0.5kg de muscle/mois n\'est pas détectable semaine à semaine sur la balance (variation eau + gras). Avancé après 5 ans : gains de 0.1-0.2kg/mois — un mésocycle entier peut sembler "sans résultat" sur la balance.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['rythme progression', 'muscle mois', 'niveau', 'attentes', 'plateau', 'long terme'],
  },

  {
    id: 'prog_007',
    topic: 'progression',
    subtopics: ['incrément de charge', 'surcharge progressive', 'double progression'],
    finding: 'L\'incrément de charge optimal lors de la double progression n\'est pas fixe : il dépend du type d\'exercice, du niveau et de la marge RIR disponible.',
    detail: 'La contrainte principale est matérielle (plus petite plaque = 1,25kg par côté = 2,5kg total sur barre). Mais cette convention ne s\'applique pas uniformément. Sur les exercices d\'isolation ou avec petits haltères, 2,5kg représente souvent 10-20% de la charge totale — un incrément trop brutal pour maintenir la technique et le RIR cible. Le principe est : ajouter la plus petite charge qui permet de rester dans la plage RIR cible à la séance suivante. Si ce n\'est pas possible (pas de microplaques), mieux vaut ajouter une répétition que d\'augmenter la charge de façon trop importante.',
    source: 'Israetel et al. — Renaissance Periodization (2019) ; Schoenfeld (2016) — Science and Development of Muscle Hypertrophy ; pratique clinique & disponibilité matérielle standard',
    application: 'Composés lourds (squat, deadlift, bench barre, OHP barre) : +2,5 à 5kg quand RIR ≥ 2 sur toutes les séries. Composés intermédiaires (rowing barre, tirage vertical) : +2,5kg. Isolation (curl, élévation latérale, extension triceps) : +1 à 2,5kg — préférer +1 rep si pas de petites plaques. Avancé avec microplaques : +0,5 à 1kg possible. Si aucune progression de charge possible sur 3 semaines : augmenter le volume (1 série) avant de changer d\'exercice.',
    example: 'Curl haltères 12kg × 3×10 à RIR 2 → passer à 14kg serait +17% en une séance (trop). Mieux : 12,5kg si disponible, sinon ajouter 1-2 reps à 12kg avant de sauter à 14kg. Squat barre 100kg × 4×6 à RIR 2 → 102,5kg est approprié (+2,5%).',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['incrément charge', 'surcharge progressive', 'double progression', '2.5kg', 'microloading', 'progression charge', 'augmenter charge'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // NUTRITION
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'nut_001',
    topic: 'nutrition',
    subtopics: ['protéines', 'apport optimal'],
    finding: 'L\'apport optimal en protéines pour maximiser l\'hypertrophie est de 1.6-2.2g par kg de poids corporel par jour.',
    detail: 'En dessous de 1.6g/kg, la synthèse protéique nette n\'est pas maximisée. La répartition sur 4-5 repas est plus efficace qu\'un apport concentré.',
    source: 'Morton et al. 2018 — BJSM (méta-analyse 49 études)',
    application: 'Viser 1.6-2.2g/kg/jour de protéines réparties sur 4-5 prises.',
    example: 'Ex : athlète de 80kg → 128-176g de protéines/jour, soit environ 30-40g par repas sur 4-5 repas. Poulet, œufs, poisson, fromage blanc, whey.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['protéines', 'apport', 'synthèse protéique', 'g/kg'],
  },
  {
    id: 'nut_002',
    topic: 'nutrition',
    subtopics: ['protéines', 'dose par repas'],
    finding: 'La synthèse protéique est maximalement stimulée par ~0.4g/kg de protéines par repas.',
    detail: 'Un muscle ne peut pas stocker massivement les acides aminés en excès. 60g de protéines en un repas ne double pas le stimulus de 30g.',
    source: 'Moore et al. 2009 — Am J Clin Nutr ; Witard et al. 2014',
    application: 'Viser ~0.4g/kg par repas, 4-5× par jour.',
    example: 'Ex : athlète 80kg → 32g de protéines par repas (une poitrine de poulet = 30g, un œuf = 6g). 4 repas × 32g = 128g/jour = 1.6g/kg.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['protéines', 'dose', 'repas', 'leucine'],
  },
  {
    id: 'nut_003',
    topic: 'nutrition',
    subtopics: ['créatine', 'supplément'],
    finding: 'La créatine monohydrate est le supplément le plus validé. Elle augmente la force de 5-15% et la masse maigre de 1-2kg sur 4-12 semaines.',
    detail: 'La créatine augmente les réserves de phosphocréatine. Dose : 3-5g/jour. Pas de phase de charge nécessaire. Saturation complète en 28 jours.',
    source: 'Rawson & Volek 2003 ; Lanhers et al. 2017 (méta-analyse)',
    application: '3-5g de créatine monohydrate par jour, timing indifférent.',
    example: 'Ex : 5g de créatine dans un shaker post-entraînement tous les jours. Après 4 semaines : +5% sur le bench, +1.5kg de masse maigre. Effet garanti si entraînement régulier.',
    objectives: ['strength', 'hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['créatine', 'monohydrate', 'force', 'masse'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // EXERCICES — ANATOMIE & BIOMÉCANIQUE (DELAVIER & GUNDILL)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'del_001',
    topic: 'exercise',
    subtopics: ['squat', 'anatomie', 'profondeur'],
    finding: 'Le squat profond (en dessous du parallèle) double l\'activation des fessiers par rapport au demi-squat, tout en maintenant une activation maximale des quadriceps.',
    detail: 'En dessous du parallèle, les fessiers doublent leur activation EMG. La position du pied (large vs serré) influence le ratio quad/adducteur. High bar → plus quads. Low bar → plus ischio/fessiers.',
    source: 'Delavier — Guide des mouvements de musculation (2010) ; Caterisano et al. 2002',
    application: 'Squat profond pour maximiser fessiers. High bar pour objectif quad. Low bar pour force maximale.',
    example: 'Ex : femme qui veut cibler les fessiers → squat prise large, pieds légèrement en canard, descente profonde. Sensation de brûlure dans les fessiers en bas = bonne position.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Quadriceps', 'Fessiers', 'Ischio-jambiers'],
    keywords: ['squat', 'profondeur', 'fessiers', 'quadriceps', 'position pieds'],
  },
  {
    id: 'del_002',
    topic: 'exercise',
    subtopics: ['bench press', 'angle', 'pectoraux'],
    finding: 'L\'angle du développé couché détermine quelle portion des pectoraux est ciblée : incliné = haut (faisceau claviculaire), plat = milieu (sternal), décliné = bas (abdominal).',
    detail: 'Le développé incliné à 30-45° sollicite optimalement le faisceau claviculaire sans trop impliquer les épaules. Au-delà de 45°, les deltoïdes dominent. La largeur de prise influence pecs vs triceps.',
    source: 'Delavier (2010) ; Gundill — Musculation avancée (2008) ; Barnett et al. 1995',
    application: 'Inclure développé plat + incliné 30° pour développement complet des pectoraux.',
    example: 'Ex : pour remplir le haut des pecs (zone souvent creuse), prioriser le développé incliné à 30° avec haltères. Prise légèrement plus serrée que la largeur d\'épaules pour maximiser le stretch pectoral.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Poitrine', 'Triceps', 'Épaules'],
    keywords: ['bench press', 'angle', 'pectoraux', 'incliné', 'plat', 'décliné'],
  },
  {
    id: 'del_003',
    topic: 'exercise',
    subtopics: ['curl', 'supination', 'biceps'],
    finding: 'La supination complète du poignet en fin de curl maximise la contraction du biceps car ce muscle est à la fois fléchisseur du coude ET supinateur.',
    detail: 'Le biceps brachial a deux fonctions : flexion du coude et supination de l\'avant-bras. Un curl sans supination (prise neutre) n\'active que partiellement le biceps. La supination progressive pendant la montée maximise le recrutement.',
    source: 'Delavier — Guide des mouvements de musculation (2010) ; Gundill & Delavier — La méthode Delavier (2011)',
    application: 'Sur le curl haltères, commencer en prise neutre et supiner progressivement en montant. En haut : poignet en supination maximale.',
    example: 'Ex : curl haltères debout — bras le long du corps, paume vers l\'intérieur (neutre). En montant, tourner progressivement le poignet jusqu\'en paume vers le plafond en haut. Contraction du biceps nettement supérieure.',
    objectives: ['hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Biceps'],
    keywords: ['curl', 'supination', 'biceps', 'rotation', 'prise'],
  },
  {
    id: 'del_004',
    topic: 'exercise',
    subtopics: ['triceps', 'chef long', 'overhead'],
    finding: 'Les extensions triceps overhead (bras en élévation) sont supérieures aux pushdowns pour l\'hypertrophie du chef long car ce chef est bi-articulaire.',
    detail: 'Le chef long du triceps traverse l\'articulation de l\'épaule. En élévation, il est maximalement étiré — stimulant davantage son hypertrophie. Les pushdowns en position neutre ne l\'étirent pas.',
    source: 'Delavier (2010) ; Maeo et al. 2022 ; Stasinaki et al. 2018',
    application: 'Inclure au moins 1 exercice overhead pour les triceps (French press, extension poulie haute, skull crusher incliné).',
    example: 'Ex : extension triceps à la poulie haute (bras au-dessus de la tête, corde derrière la nuque). En allongeant les bras en haut, le chef long s\'étire → contraction plus complète qu\'un pushdown debout.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: ['Triceps'],
    keywords: ['triceps', 'chef long', 'overhead', 'extension', 'étirement'],
  },
  {
    id: 'del_005',
    topic: 'exercise',
    subtopics: ['dos', 'rétraction scapulaire', 'rowing'],
    finding: 'La rétraction des omoplates (scapulas) avant et pendant les mouvements de tirage est essentielle pour cibler efficacement les muscles du dos moyen (rhomboïdes, trapèze moyen).',
    detail: 'Sans rétraction scapulaire, les bras font l\'essentiel du travail (biceps) et le dos moyen est peu sollicité. Serrer les omoplates ensemble en fin de tirage horizontal maximise l\'activation des rhomboïdes et du trapèze moyen.',
    source: 'Delavier (2010) ; Gundill & Delavier — Programme de musculation (2012)',
    application: 'Sur tous les mouvements de rowing : rétracter les omoplates en fin de mouvement, tenir 1 sec, relâcher lentement.',
    example: 'Ex : rowing barre — en tirant la barre vers le nombril, se concentrer sur "serrer les omoplates ensemble" en fin de mouvement. On sent une brûlure entre les omoplates (rhomboïdes) plutôt que dans les bras.',
    objectives: ['hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Dos'],
    keywords: ['dos', 'rétraction', 'omoplates', 'scapulaire', 'rowing', 'rhomboïdes'],
  },
  {
    id: 'del_006',
    topic: 'exercise',
    subtopics: ['épaules', 'élévations latérales', 'deltoïde médian'],
    finding: 'Les élévations latérales avec légère inclinaison du buste en avant et rotation externe du coude ciblent mieux le faisceau médian du deltoïde que la version stricte debout.',
    detail: 'Le faisceau médian du deltoïde est le plus responsable de la largeur des épaules. Une légère inclinaison vers l\'avant (15°) et le coude légèrement en avant de l\'épaule optimise l\'angle de traction sur ce faisceau.',
    source: 'Delavier (2010) ; Gundill — Musculation avancée (2008)',
    application: 'Élévations latérales avec légère inclinaison (15°) du buste et coude fléchi à 10-15° pour maximiser l\'activation du deltoïde médian.',
    example: 'Ex : élévations latérales à la machine — régler le siège légèrement plus bas pour s\'incliner, aligner le coude avec l\'articulation de la machine. Sensation de "brûlure sur le côté" de l\'épaule bien plus nette qu\'avec les haltères debout strict.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: ['Épaules'],
    keywords: ['élévations latérales', 'deltoïde médian', 'angle', 'épaules', 'largeur'],
  },
  {
    id: 'del_007',
    topic: 'exercise',
    subtopics: ['hip thrust', 'fessiers', 'activation'],
    finding: 'Le hip thrust barre produit l\'activation EMG la plus élevée du grand fessier parmi tous les exercices testés, supérieure au squat et au deadlift.',
    detail: 'L\'activation EMG du grand fessier pendant le hip thrust est 2× supérieure à celle du squat. La position en extension de hanche maximale (fin de mouvement) est la plus spécifique au grand fessier.',
    source: 'Contreras et al. 2015 — J Strength Cond Res ; Delavier & Gundill — Musculation femmes (2014)',
    application: 'Hip thrust indispensable pour le développement maximal des fessiers. Complémentaire au squat.',
    example: 'Ex : hip thrust barre — dos appuyé sur banc à 90°, pieds à plat à largeur d\'épaules. Monter les hanches jusqu\'à alignement dos-cuisses. Serrer les fessiers fort en haut pendant 1 sec. Descendre lentement.',
    objectives: ['hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Fessiers', 'Ischio-jambiers'],
    keywords: ['hip thrust', 'fessiers', 'gluteus', 'EMG', 'activation'],
  },
  {
    id: 'del_008',
    topic: 'exercise',
    subtopics: ['pré-exhaustion', 'isolation avant composé'],
    finding: 'La pré-exhaustion (isolation avant composé) force le muscle cible à travailler plus intensément lors du composé en fatigant les muscles synergiques moins prioritaires.',
    detail: 'Ex : pec deck avant développé couché. Les pectoraux sont pré-fatigués ; lors du développé, les triceps et épaules (non fatigués) aident moins → les pecs doivent compenser. Technique avancée pour forcer l\'hypertrophie d\'un muscle récalcitrant.',
    source: 'Gundill & Delavier — Musculation avancée (2008) ; Brennecke et al. 2009',
    application: 'Utiliser la pré-exhaustion pour les muscles difficiles à sentir lors des composés. Ex : élévations latérales → OHP pour les épaules.',
    example: 'Ex : athlète qui "ne sent pas ses pecs" au développé → faire 3×15 de pec deck (pré-exhaustion), puis immédiatement 4×8 développé couché. Les pecs sont forcés de s\'activer en priorité.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: ['Poitrine', 'Épaules'],
    keywords: ['pré-exhaustion', 'isolation', 'composé', 'fatigue', 'technique avancée'],
  },
  {
    id: 'del_009',
    topic: 'exercise',
    subtopics: ['mollets', 'gastrocnémien', 'soléaire'],
    finding: 'Le gastrocnémien est mieux ciblé jambe tendue (standing calf raise) et le soléaire jambe fléchie (seated calf raise). Les deux exercices sont nécessaires pour un développement complet.',
    detail: 'Le gastrocnémien (bi-articulaire) se contracte plus efficacement genou tendu. Le soléaire (mono-articulaire) est actif quel que soit la position du genou. Amplitude complète (talon le plus bas possible) indispensable.',
    source: 'Delavier (2010) ; Riemann et al. 2011',
    application: 'Combiner calf raise debout (gastrocnémien) + assis (soléaire). Amplitude maximale à chaque répétition.',
    example: 'Ex : calf raise debout (jambe tendue) → gastrocnémien. Puis seated calf raise machine (genou fléchi à 90°) → soléaire. Descente maximale à chaque rep pour l\'étirement complet.',
    objectives: ['hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Mollets'],
    keywords: ['mollets', 'gastrocnémien', 'soléaire', 'calf raise'],
  },
  {
    id: 'del_010',
    topic: 'exercise',
    subtopics: ['traction', 'grand dorsal', 'prise'],
    finding: 'La prise en supination (chin-up) active davantage les biceps et le bas du grand dorsal. La prise en pronation (pull-up) active plus le grand dorsal et le bas du trapèze.',
    detail: 'L\'écartement de la prise influence aussi l\'activation : prise serrée → grande mobilité d\'épaule, plus de biceps. Prise large → plus de grand dorsal inférieur. L\'amplitude complète (étirement en bas) est cruciale.',
    source: 'Delavier (2010) ; Signorile et al. 2002 ; Doma et al. 2013',
    application: 'Combiner chin-up (supination) et pull-up (pronation) pour un développement complet du dos.',
    example: 'Ex : pull-up prise large pronation — descendre jusqu\'à extension complète des bras (étirement grand dorsal), tirer les coudes vers le bas et l\'arrière, terminer menton au-dessus de la barre. Pas de coup de reins.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Dos', 'Biceps'],
    keywords: ['traction', 'pull-up', 'grand dorsal', 'prise', 'supination'],
  },
  {
    id: 'del_011',
    topic: 'exercise',
    subtopics: ['deltoïde postérieur', 'face pull', 'coiffe'],
    finding: 'Le face pull à la poulie haute avec corde est l\'exercice le plus efficace pour cibler simultanément le deltoïde postérieur et la coiffe des rotateurs.',
    detail: 'Le face pull combine abduction horizontale (deltoïde postérieur) et rotation externe (sous-épineux, petit rond). Ces deux muscles sont souvent négligés et leur faiblesse est la principale cause de douleurs d\'épaules.',
    source: 'Delavier (2010) ; Gundill & Delavier — Programme (2012) ; Kolber et al. 2014',
    application: 'Inclure 3-4 séries de face pull à chaque séance pectoraux/épaules pour équilibrer la coiffe.',
    example: 'Ex : poulie haute avec corde, tirer vers le visage en écartant les mains (corde passe de part et d\'autre du visage), coudes hauts. Finir avec les mains à hauteur des tempes, rotation externe maximale.',
    objectives: ['hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Épaules'],
    keywords: ['face pull', 'deltoïde postérieur', 'coiffe rotateurs', 'équilibre', 'prévention'],
  },
  {
    id: 'del_012',
    topic: 'exercise',
    subtopics: ['dips', 'pectoraux vs triceps', 'inclinaison'],
    finding: 'L\'inclinaison du buste lors des dips détermine si l\'exercice cible principalement les pectoraux (incliné avant) ou les triceps (buste droit).',
    detail: 'Dips incliné vers l\'avant (coudes écartés) → pectoraux bas. Dips buste droit (coudes serrés) → triceps. La descente jusqu\'au bas (étirement pectoral maximum) est nécessaire pour les pecs.',
    source: 'Delavier (2010) ; Gundill — Musculation avancée (2008)',
    application: 'Pour les pecs : dips avec inclinaison vers l\'avant, coudes légèrement écartés, descendre au maximum. Pour triceps : buste droit, coudes serrés.',
    example: 'Ex : dips pour pectoraux — se pencher à 30-45° vers l\'avant dès le départ, descendre jusqu\'à sentir l\'étirement dans les pecs en bas, pousser en gardant l\'inclinaison. Sensation complètement différente des dips triceps.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['intermediate', 'advanced'],
    muscles: ['Poitrine', 'Triceps'],
    keywords: ['dips', 'pectoraux', 'triceps', 'inclinaison', 'coudes'],
  },
  {
    id: 'del_013',
    topic: 'exercise',
    subtopics: ['curl marteau', 'brachial antérieur'],
    finding: 'Le curl marteau (prise neutre) cible massivement le brachial antérieur et le brachio-radial, contribuant à l\'épaisseur du bras plutôt qu\'au pic du biceps.',
    detail: 'Le brachial antérieur est un fléchisseur pur du coude, moins fatigable que le biceps. Son développement épaissit le bras dans sa totalité (pas seulement le pic). Le brachio-radial est fortement recruté en prise neutre.',
    source: 'Delavier (2010) ; Gundill & Delavier — La méthode Delavier (2011)',
    application: 'Alterner curl barre (pour le pic biceps) et curl marteau (pour l\'épaisseur totale du bras).',
    example: 'Ex : 3 séries curl barre + 2 séries curl marteau. Le bras apparaît plus épais et plus dense vu de côté (brachial antérieur) et de face (biceps). Les deux sont complémentaires.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: ['Biceps'],
    keywords: ['curl marteau', 'brachial antérieur', 'brachio-radial', 'épaisseur bras'],
  },
  {
    id: 'del_014',
    topic: 'exercise',
    subtopics: ['deadlift', 'variantes', 'ciblage'],
    finding: 'Le RDL (Romanian Deadlift) est supérieur au deadlift conventionnel pour l\'hypertrophie des ischio-jambiers car il les entraîne en position d\'étirement avec charge.',
    detail: 'Le RDL maintient les jambes quasi-tendues, forçant les ischio-jambiers à travailler en position étirée sous charge — le stimulus hypertrophique optimal selon les récentes recherches sur l\'entraînement en longueur musculaire.',
    source: 'Delavier (2010) ; Pedrosa et al. 2022 ; Maeo et al. 2021',
    application: 'RDL pour l\'hypertrophie des ischio-jambiers. DL conventionnel pour la force maximale.',
    example: 'Ex : RDL barre — départ debout, barbe sur les cuisses, descendre lentement en poussant les hanches vers l\'arrière, dos droit, sentir l\'étirement dans les ischio jusqu\'au milieu du tibia. Remonter en contractant les fessiers.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['intermediate', 'advanced'],
    muscles: ['Ischio-jambiers', 'Fessiers', 'Dos'],
    keywords: ['RDL', 'deadlift', 'ischio-jambiers', 'étirement', 'hypertrophie'],
  },
  {
    id: 'del_015',
    topic: 'exercise',
    subtopics: ['abdominaux', 'transverse', 'gainage'],
    finding: 'Le gainage abdominal (vacuum et transverse) est indispensable pour la sécurité sur les composés lourds et plus efficace que les crunches pour la stabilité du tronc.',
    detail: 'Le transverse de l\'abdomen (muscle le plus profond) crée une ceinture de pression intra-abdominale protégeant les lombaires. La technique de bracing (gonfler le ventre vers l\'extérieur) est supérieure au "rentrer le ventre".',
    source: 'Delavier (2010) ; Gundill & Delavier (2012) ; McGill 2015',
    application: 'Apprendre le bracing abdominal sur tous les composés lourds. Ajouter des exercices de gainage (planche, hollow body) au programme.',
    example: 'Ex : avant un squat lourd — inspiration profonde, "gonfler" le ventre comme pour résister à un coup de poing (bracing), maintenir pendant toute la descente et remontée. Protège les lombaires sous charge.',
    objectives: ['strength', 'hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Abdos'],
    keywords: ['gainage', 'transverse', 'abdominaux', 'bracing', 'sécurité', 'lombaires'],
  },
  {
    id: 'del_016',
    topic: 'exercise',
    subtopics: ['morphologie', 'bras longs', 'adaptations'],
    finding: 'La morphologie (longueur des membres, insertion musculaire) impose des adaptations d\'exercice pour optimiser l\'activation musculaire et prévenir les blessures.',
    detail: 'Bras longs au squat → buste s\'incline plus → good morning squat → plus de fessiers/lombaires. Bras courts au bench → ROM plus court. Fémoraux longs → squat plus large nécessaire. Adapter l\'exercice à la morphologie, pas l\'inverse.',
    source: 'Delavier (2010) ; Gundill & Delavier — La méthode Delavier (2011)',
    application: 'Analyser la morphologie avant de prescrire des exercices. Ajuster la prise, l\'écartement, l\'inclinaison selon la longueur des membres.',
    example: 'Ex : athlète avec fémoraux longs qui squatte prise standard → buste s\'incline excessivement. Solution : élargir la prise de pieds et pointer les orteils à 30-45°. Le squat redevient vertical et les quadriceps sont mieux ciblés.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['morphologie', 'bras longs', 'adaptation', 'exercice', 'anatomie'],
  },
  {
    id: 'del_017',
    topic: 'exercise',
    subtopics: ['congestion', 'pump', 'signal métabolique'],
    finding: 'La congestion musculaire (pump) est un indicateur de stress métabolique et de recrutement musculaire élevé, mais n\'est pas une condition nécessaire à l\'hypertrophie.',
    detail: 'La congestion reflète l\'accumulation de métabolites (lactate, H+) dans le muscle, signal qui active des voies anaboliques (mTOR via voie métabolique). Elle indique qu\'on est dans la bonne plage de reps et d\'intensité. Mais l\'absence de pump ≠ séance inefficace.',
    source: 'Gundill — Musculation avancée (2008) ; Schoenfeld 2013 (metabolic stress hypothesis)',
    application: 'La congestion est un bon indicateur en hypertrophie. La rechercher sans en faire une obsession.',
    example: 'Ex : 4 séries de curl haltères avec 45s de repos → congestion maximale des biceps. Mais 4 séries de pull-up lourd avec 3 min de repos → moins de pump, mais stimulus hypertrophique supérieur.',
    objectives: ['hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['congestion', 'pump', 'métabolique', 'lactate', 'signal'],
  },
  {
    id: 'del_018',
    topic: 'exercise',
    subtopics: ['insertion musculaire', 'pic biceps', 'génétique'],
    finding: 'La hauteur d\'insertion du biceps (haute vs basse) est génétiquement déterminée et influence directement la forme du pic du biceps, indépendamment de l\'entraînement.',
    detail: 'Insertion basse = long ventre musculaire, pic moins prononcé mais bras plus massif. Insertion haute = ventre court, pic très prononcé mais bras moins épais. Cette forme ne peut pas être changée par l\'entraînement — seul le volume total peut être augmenté.',
    source: 'Delavier (2010) ; Gundill & Delavier — La méthode Delavier (2011)',
    application: 'Expliquer à l\'utilisateur que la forme du muscle est génétique. L\'entraînement augmente la taille, pas la forme. Éviter les promesses irréalistes.',
    example: 'Ex : athlète avec insertion haute du biceps → pic proéminent naturellement même avec peu de masse. Athlète avec insertion basse → bras plus épais mais pic moins visible. Les deux peuvent avoir les mêmes bras en centimètres.',
    objectives: ['hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Biceps'],
    keywords: ['insertion', 'biceps', 'pic', 'génétique', 'forme musculaire'],
  },
  {
    id: 'del_019',
    topic: 'exercise',
    subtopics: ['ischio-jambiers', 'leg curl', 'étirement en charge'],
    finding: 'Le leg curl en position allongée active massivement les deux chefs du biceps fémoral. Le leg curl assis est supérieur pour l\'hypertrophie car il étire les ischio-jambiers simultanément à la hanche et au genou.',
    detail: 'En position assise, les ischio-jambiers sont étirés à la hanche (cuisse à 90°) tout en travaillant au genou. Ce double étirement maximise le stimulus hypertrophique selon la théorie de l\'entraînement en longueur musculaire.',
    source: 'Delavier (2010) ; Maeo et al. 2021 ; Pedrosa et al. 2022',
    application: 'Préférer le leg curl assis au leg curl allongé pour l\'hypertrophie des ischio-jambiers.',
    example: 'Ex : leg curl machine assise — cuisse bloquée à 90°, fléchir le genou jusqu\'au maximum, descendre lentement (4 sec). Le stretch en bas du mouvement (jambe quasi-tendue) est la partie la plus stimulante.',
    objectives: ['hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Ischio-jambiers'],
    keywords: ['leg curl', 'ischio-jambiers', 'étirement', 'assis', 'allongé'],
  },
  {
    id: 'del_020',
    topic: 'exercise',
    subtopics: ['good morning', 'lombaires', 'ischio'],
    finding: 'Le good morning barre est l\'exercice le plus efficace pour renforcer les lombaires et les ischio-jambiers simultanément sous charge fonctionnelle.',
    detail: 'Le good morning simule le pattern de chargement des lombaires lors du deadlift et du squat. Les ischio-jambiers travaillent excentriquement pour contrôler la descente. Exercice de prévention et de renforcement de la chaîne postérieure.',
    source: 'Delavier (2010) ; Gundill & Delavier — Programme (2012)',
    application: 'Inclure le good morning en accessoire après les composés principaux pour renforcer la chaîne postérieure. Charges légères, technique parfaite.',
    example: 'Ex : après squat lourd, 3×12 good morning à barre légère (20-40% 1RM squat). Descendre en poussant les hanches arrière, dos droit, sentir l\'étirement des ischio. Remontée lente et contrôlée.',
    objectives: ['strength', 'hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: ['Dos', 'Ischio-jambiers'],
    keywords: ['good morning', 'lombaires', 'ischio-jambiers', 'chaîne postérieure'],
  },
  {
    id: 'del_021',
    topic: 'exercise',
    subtopics: ['rowing coude haut', 'coude bas', 'dos cibles'],
    finding: 'La position du coude lors du rowing détermine quelle zone du dos est ciblée : coude haut → trapèze moyen/rhomboïdes, coude bas → grand dorsal.',
    detail: 'Rowing coude haut (écarté du corps) → abduction horizontale de l\'épaule → trapèze moyen, rhomboïdes, deltoïde postérieur. Rowing coude bas (collé au corps) → extension de l\'épaule → grand dorsal.',
    source: 'Delavier (2010) ; Gundill — Musculation avancée (2008)',
    application: 'Varier la position des coudes au rowing pour cibler différentes zones du dos. Inclure les deux variantes.',
    example: 'Ex : rowing haltère — coude collé au corps et tiré vers la hanche → grand dorsal. Même exercice avec le coude écarté vers le plafond → trapèze moyen. Sensation complètement différente.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: ['Dos'],
    keywords: ['rowing', 'coude', 'dos', 'trapèze', 'grand dorsal', 'ciblage'],
  },
  {
    id: 'del_022',
    topic: 'exercise',
    subtopics: ['quadriceps', 'leg extension', 'angle', 'ROM'],
    finding: 'La leg extension avec amplitude complète (de 90° à extension maximale) est supérieure à la leg extension partielle pour l\'hypertrophie des quadriceps, particulièrement du droit fémoral.',
    detail: 'Le droit fémoral (bi-articulaire) est maximalement étiré en position de départ (genou fléchi à 90°, hanche en extension). L\'amplitude complète maximise le stimulus sur ce chef souvent sous-développé.',
    source: 'Delavier (2010) ; Pinto et al. 2012',
    application: 'Leg extension avec amplitude maximale, descente lente (3-4 sec) pour maximiser l\'étirement du droit fémoral.',
    example: 'Ex : leg extension machine — descendre jusqu\'à 90° de flexion de genou (étirement max du droit fémoral), extension complète en haut, pause 1 sec, descente en 4 sec. Ne pas laisser le poids rebondir en bas.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: ['Quadriceps'],
    keywords: ['leg extension', 'quadriceps', 'droit fémoral', 'amplitude', 'ROM'],
  },
  {
    id: 'del_023',
    topic: 'exercise',
    subtopics: ['OHP', 'épaules', 'prise', 'sécurité'],
    finding: 'Le développé militaire assis avec dossier incliné à 75-80° (légèrement incliné) réduit le stress sur les disques lombaires par rapport à la version debout tout en maintenant l\'activation des deltoïdes.',
    detail: 'Le développé militaire debout crée une lordose lombaire excessive sous charges lourdes. La version assise avec dossier légèrement incliné stabilise le rachis tout en permettant une charge plus élevée et un meilleur focus sur les épaules.',
    source: 'Delavier (2010) ; Gundill & Delavier — Musculation femmes (2014)',
    application: 'Préférer la version assise avec dossier légèrement incliné pour sécuriser les lombaires. Montée en ligne légèrement oblique devant le visage.',
    example: 'Ex : développé militaire haltères assis, dossier à 80°. Haltères à hauteur des oreilles au départ, pousser vers le haut et légèrement en avant. Dos maintenu contre le dossier tout au long du mouvement.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Épaules', 'Triceps'],
    keywords: ['OHP', 'développé militaire', 'épaules', 'lombaires', 'sécurité'],
  },
  {
    id: 'del_024',
    topic: 'exercise',
    subtopics: ['pectoraux', 'étirement', 'câble', 'amplitude'],
    finding: 'Les écartés à la poulie (câble croisé) permettent un étirement des pectoraux en position de charge (début du mouvement) que les haltères ou la machine ne peuvent pas reproduire complètement.',
    detail: 'Avec les haltères, la résistance est faible au début (étirement) et maximale à mi-chemin. Le câble maintient une résistance constante tout au long du mouvement, incluant dans la position d\'étirement. Meilleur stimulus sur toute l\'amplitude.',
    source: 'Delavier (2010) ; Gundill — Musculation avancée (2008)',
    application: 'Inclure les câbles croisés ou le pec deck en fin de séance pectoraux pour travailler l\'amplitude complète avec résistance constante.',
    example: 'Ex : câble croisé — poulies hautes, se pencher légèrement, bras en croix (étirement pectoraux). Ramener les mains devant soi en arc, sentir la contraction au centre. La résistance du câble est présente même en position étirée, contrairement aux haltères.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: ['Poitrine'],
    keywords: ['câble', 'pectoraux', 'étirement', 'amplitude', 'résistance constante'],
  },
  {
    id: 'del_025',
    topic: 'exercise',
    subtopics: ['fessiers', 'abducteurs', 'position'],
    finding: 'La position des pieds lors des exercices de fessiers influence fortement le ratio grand fessier / moyen fessier / adducteurs activés.',
    detail: 'Pieds droits → grand fessier dominant. Pieds en canard (rotation externe) → grand fessier + adducteurs + moyen fessier. Largeur d\'écartement plus grande → plus de moyen fessier. Nécessité de varier les positions pour un développement complet.',
    source: 'Delavier & Gundill — Musculation femmes (2014) ; Contreras 2015',
    application: 'Varier la position des pieds selon la zone de fessiers à cibler. Exercises unilatéraux (fente, hip abduction) pour le moyen fessier.',
    example: 'Ex : hip thrust pied droit → grand fessier. Hip thrust pieds écartés et en rotation externe → grand fessier + moyen. Abduction à la machine ou clamshell → moyen fessier isolé.',
    objectives: ['hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Fessiers'],
    keywords: ['fessiers', 'position pieds', 'grand fessier', 'moyen fessier', 'abducteurs'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PRÉVENTION DES BLESSURES
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'inj_001',
    topic: 'injury',
    subtopics: ['tendinopathie', 'progression'],
    finding: 'Les tendinopathies surviennent quand la charge dépasse la capacité d\'adaptation du tendon. L\'augmentation du volume doit être ≤10%/semaine.',
    detail: 'Le tendon récupère 2-3× plus lentement que le muscle. Une augmentation trop rapide dépasse la capacité d\'adaptation tendineuse même si musculairement supporté.',
    source: 'Gabbett 2016 — BJSM ; Cook & Purdam 2009',
    application: 'Augmenter le volume de ≤10%/semaine. Les débuts de programme doivent être conservateurs.',
    example: 'Ex : athlète qui double son volume en 2 semaines après vacances → tendinite rotulienne 3 semaines plus tard. Les quadriceps ont suivi, le tendon rotulien pas.',
    objectives: ['strength', 'hypertrophy', 'endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['tendinopathie', 'tendon', 'blessure', 'progression', '10%'],
  },
  {
    id: 'inj_002',
    topic: 'injury',
    subtopics: ['coiffe des rotateurs', 'ratio', 'prévention'],
    finding: 'Un ratio tirage/pushing ≥ 1:1 (idéalement 2:1) prévient les déséquilibres et les tendinopathies de la coiffe des rotateurs.',
    detail: 'La majorité des blessures d\'épaule en musculation résultent d\'une surcharge antérieure (deltoïde ant, pec) par rapport au postérieur (coiffe, deltoïde post). Trop de pressing sans tirage = impingement chronique.',
    source: 'Delavier (2010) ; Gundill — Musculation avancée (2008) ; Kolber et al. 2014',
    application: 'Pour chaque série de pressing, programmer au moins 1 série de tirage. Inclure face pull régulièrement.',
    example: 'Ex : séance avec 4 séries de bench, 4 séries d\'OHP → minimum 8 séries de tirage (rowing, tirage, face pull) pour maintenir l\'équilibre antérieur/postérieur.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Épaules'],
    keywords: ['épaules', 'coiffe', 'ratio', 'tirage', 'pressing', 'équilibre'],
  },
  {
    id: 'inj_003',
    topic: 'injury',
    subtopics: ['lombaires', 'technique', 'neutralité'],
    finding: 'La majeure partie des blessures lombaires en musculation résulte d\'une flexion lombaire sous charge et d\'une progression trop rapide.',
    detail: 'Maintenir la neutralité lombaire sur les exercices de chaîne postérieure est fondamental. La flexion lombaire sous charge comprime les disques intervertébraux asymétriquement.',
    source: 'Delavier (2010) ; McGill 2015 — Ultimate Back Fitness',
    application: 'Enseigner le bracing abdominal et la neutralité lombaire avant tout exercice de chaîne postérieure.',
    example: 'Ex : "chat-vache" pour trouver la position neutre, puis maintenir cette position pendant le deadlift. Si le bas du dos s\'arrondit en bas du mouvement → réduire la charge ou la profondeur.',
    objectives: ['strength', 'hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Dos'],
    keywords: ['lombaires', 'technique', 'blessure', 'neutralité', 'bracing'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // FRÉQUENCE OPTIMALE PAR NIVEAU & OBJECTIF
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'freq_opt_001',
    topic: 'frequency',
    subtopics: ['optimal', 'niveau', 'jours'],
    finding: 'La fréquence optimale varie selon le niveau et l\'objectif. Débutant : 3j. Intermédiaire : 4-5j. Avancé : 5-6j.',
    detail: 'Débutant : 3j (adaptations neurales). Intermédiaire force : 4-5j. Intermédiaire hypertrophie : 5j. Avancé force : 5j. Avancé hypertrophie : 6j.',
    source: 'Israetel RP ; Colquhoun 2018 ; Ralston 2017',
    application: 'Adapter la fréquence au niveau et à l\'objectif. Ne pas dépasser 6j/sem.',
    example: 'Ex : débutant qui passe à 5j/sem → surmenage, blessures, découragement. Le même 3j/sem bien exécuté le fera progresser 2× plus vite pendant les 6 premiers mois.',
    objectives: ['hypertrophy', 'strength', 'endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['fréquence optimale', 'jours', 'niveau', 'objectif'],
  },
  {
    id: 'freq_opt_002',
    topic: 'frequency',
    subtopics: ['force', 'accessoires', 'jours supplémentaires'],
    finding: 'En force, les jours supplémentaires (4-5j vs 3j) servent au travail accessoire et hypertrophique, pas à répéter les composés lourds.',
    detail: 'Un programme force de 5 jours : 2 jours composés lourds + 3 jours accessoires/hypertrophie. Les composés lourds restent à 2-3×/sem ; les autres jours complètent en travail moins intense.',
    source: 'Barbell Medicine ; Calgary Barbell 16-week program',
    application: 'Ne pas confondre "5 jours de force" avec "5 jours de composés lourds". Planifier soigneusement.',
    example: 'Ex : Lun squat lourd, Mar bench lourd + accessoires haut, Mer repos, Jeu DL lourd + accessoires, Ven bench volume + accessoires bas. Les composés lourds : 2-3×/sem maximum.',
    objectives: ['strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['force', 'accessoires', '5 jours', 'composés'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // MIKE ISRAETEL — Renaissance Periodization (RP Strength)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'rp_001',
    topic: 'volume',
    subtopics: ['volume landmarks', 'par muscle', 'RP'],
    finding: 'Chaque muscle possède des seuils de volume spécifiques (MEV/MAV/MRV) qui varient selon sa taille, son rôle dans les composés et la vitesse de récupération du tissu.',
    detail: 'Grands muscles à récupération lente (dos, quadriceps) : MEV ~10-12 séries/sem, MRV ~20-25. Petits muscles à récupération rapide (biceps, triceps) : MEV ~8-10, MRV ~18-22. Les muscles sollicités indirectement (biceps dans le tirage) ont un MEV effectif plus bas.',
    source: 'Israetel, Hoffmann, Smith — Science and Development of Muscle Hypertrophy, RP Strength (2019-2024)',
    application: 'Utiliser les seuils par muscle pour calibrer le volume de chaque groupe indépendamment, pas un volume global unique.',
    example: 'Ex : un programme avec 20 séries de tirage/rowing par semaine dépasse le MRV des biceps même sans curl direct car le volume indirect compte. Réduire le volume direct biceps en conséquence.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['MEV', 'MAV', 'MRV', 'volume landmarks', 'RP', 'Israetel', 'par muscle'],
  },
  {
    id: 'rp_002',
    topic: 'volume',
    subtopics: ['progression de volume', 'ajouter séries', 'mésocycle'],
    finding: 'La progression optimale du volume dans un mésocycle est de +1 à +2 séries par groupe musculaire par semaine, du MEV au MRV sur 5-8 semaines.',
    detail: 'Ajouter trop vite dépasse le MRV prématurément. Ajouter trop lentement ne crée pas de surcharge progressive suffisante. +1 série/semaine pour les petits muscles, +2 séries pour les grands muscles est la zone optimale.',
    source: 'Israetel — RP Hypertrophy Training (2022) ; Renaissance Periodization YouTube (2019-2024)',
    application: 'Programmer l\'augmentation de volume semaine par semaine dans le plan, pas de façon ad hoc.',
    example: 'Ex : mésocycle pectoraux 8 semaines. Sem1 : 10 séries. Sem2 : 12. Sem3 : 14. Sem4 : 15. Sem5 : 16. Sem6 : 18. Sem7 : 20 (MRV). Sem8 : décharge 10 séries.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['progression volume', 'séries', 'mésocycle', 'RP', 'Israetel'],
  },
  {
    id: 'rp_003',
    topic: 'periodization',
    subtopics: ['phase potentiation', 'accumulation', 'réalisation'],
    finding: 'La potentiation de phases (MEV → MAV → MRV → décharge/réalisation) permet d\'accumuler du volume progressivement puis de réaliser les adaptations lors de la décharge et du mesocycle suivant.',
    detail: 'Chaque phase prépare la suivante : l\'accumulation (MEV-MAV) construit la capacité de travail. L\'intensification (MRV) pousse les adaptations au maximum. La décharge permet la supercompensation. Le nouveau mésocycle commence avec un MEV plus élevé qu\'avant.',
    source: 'Israetel & Hoffmann — Scientific Principles of Strength Training, RP Strength (2015-2024)',
    application: 'Ne pas rester au même volume indefiniment. Planifier la montée MEV→MRV et la décharge comme une unité complète.',
    example: 'Ex : Mésocycle 1 : MEV=10 → MRV=20. Après décharge et supercompensation. Mésocycle 2 : MEV=12 → MRV=22. Le MEV du cycle 2 est supérieur au MEV du cycle 1 → progression à long terme.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['potentiation', 'phases', 'accumulation', 'réalisation', 'RP', 'Israetel'],
  },
  {
    id: 'rp_004',
    topic: 'volume',
    subtopics: ['volume maintenance', 'minimum réalisation'],
    finding: 'Le volume de maintenance musculaire est d\'environ 1/3 du MRV, soit environ 4-6 séries/muscle/semaine. On peut maintenir la masse acquise avec très peu de volume.',
    detail: 'Pendant une coupure, une blessure ou une période de vie chargée, maintenir le muscle est beaucoup plus facile qu\'en construire. 4-6 séries/sem suffisent pour éviter la régression, ce qui libère de la capacité de récupération pour d\'autres priorités.',
    source: 'Israetel — RP Strength Diet Book (2019) ; Bickel et al. 2011',
    application: 'Lors de phases de coupure ou de contraintes de vie, réduire au volume de maintenance (~1/3 MRV) pour maintenir sans épuiser.',
    example: 'Ex : vacances sans salle pendant 2 semaines → 2 séances full body de 30 min avec pompes lestées et tractions suffisent à maintenir la masse musculaire. Pas besoin de paniquer.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['maintenance', 'volume minimal', 'coupure', 'RP', 'Israetel'],
  },
  {
    id: 'rp_005',
    topic: 'intensity',
    subtopics: ['RIR', 'détection fatigue', 'drift'],
    finding: 'Le drift de RIR (même charge perçue plus difficile semaine après semaine) est le signal le plus précoce de fatigue chronique, avant même la régression de performance.',
    detail: 'Si une charge de 100kg au squat était à RIR 3 semaine 1 et semble à RIR 1 semaine 4 sans changement de charge, c\'est le SNC qui est plus fatigué, pas le muscle. Ce drift précède la régression réelle de 1-2 semaines.',
    source: 'Israetel — RP Strength (2020-2024) ; Zourdos et al. 2016',
    application: 'Surveiller le RIR perçu semaine par semaine. Un drift de >1 RIR = signal de décharge imminente.',
    example: 'Ex : semaine 1 bench 80kg = RIR 3. Semaine 4 bench 80kg = RIR 1, alors qu\'on n\'a pas ajouté de charge. Décision : décharger la semaine suivante avant la régression.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['RIR drift', 'fatigue', 'SNC', 'détection', 'Israetel'],
  },
  {
    id: 'rp_006',
    topic: 'recovery',
    subtopics: ['fatigue systémique', 'zonal', 'distinction'],
    finding: 'La fatigue systémique (SNC, hormones) et la fatigue locale (musculaire, articulaire) nécessitent des approches différentes. La systémique impose une décharge complète ; la locale permet une décharge ciblée.',
    detail: 'Fatigue systémique : épuisement global, mauvais sommeil, libido réduite, humeur dégradée → décharge complète tous muscles. Fatigue locale/zonale : douleur/raideur sur un groupe musculaire spécifique sans fatigue globale → réduire uniquement ce groupe.',
    source: 'Israetel & Hoffmann — RP Strength (2019-2024)',
    application: 'Identifier le type de fatigue avant de décider la stratégie de décharge. Fatigue locale → zone_deload. Fatigue systémique → full_deload.',
    example: 'Ex : athlète épuisé globalement (mauvais sommeil, fatigue constante) → décharge complète -40% tous muscles. Athlète avec genou douloureux uniquement → réduire quadriceps/ischio, maintenir le reste.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['fatigue systémique', 'fatigue locale', 'zonale', 'décharge', 'Israetel'],
  },
  {
    id: 'rp_007',
    topic: 'split',
    subtopics: ['RP hypertrophie', 'structure optimale', 'fréquence 2x'],
    finding: 'La structure de programme optimale pour l\'hypertrophie selon RP est : 2× par muscle/semaine, avec des séances dédiées à des groupes musculaires complémentaires et une progression de volume sur 8 semaines.',
    detail: 'RP recommande : débutant → full body 3×/sem. Intermédiaire → upper/lower 4× ou PPL 6×. Avancé → PPL 6× ou split plus spécialisé. La fréquence de 2× par muscle est le minimum non négociable pour l\'hypertrophie.',
    source: 'Israetel — RP Hypertrophy Training Program (2021-2024)',
    application: 'Construire tous les programmes hypertrophie autour de 2× par muscle/semaine comme fondation non négociable.',
    example: 'Ex : programme RP type intermédiaire — Lun : upper push (pecs/épaules/triceps), Mar : lower (quads/ischio/mollets), Jeu : upper pull (dos/biceps), Ven : lower. Chaque muscle 2×/sem.',
    objectives: ['hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['RP', 'Israetel', 'structure', '2x semaine', 'hypertrophie'],
  },
  {
    id: 'rp_008',
    topic: 'progression',
    subtopics: ['surcharge à long terme', 'mésocycles successifs'],
    finding: 'Le progrès à long terme vient de l\'enchaînement de mésocycles successifs avec un MEV de départ progressivement plus élevé à chaque nouveau cycle.',
    detail: 'À chaque nouveau mésocycle, le MEV de départ est légèrement supérieur au MEV du cycle précédent. Cette élévation du plancher de volume est le mécanisme central de la progression à long terme. Un athlète avancé a un MEV de 14+ là où un débutant commence à 6.',
    source: 'Israetel — RP Strength Science and Development of Muscle Hypertrophy (2019)',
    application: 'Planifier les mésocycles successifs en s\'assurant que le MEV de départ augmente légèrement à chaque cycle.',
    example: 'Ex : cycle 1 MEV dos = 10 séries. Après supercompensation, cycle 2 MEV dos = 12. Cycle 3 MEV = 14. En 2 ans, le MEV atteint des niveaux où un débutant serait en MRV.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['mésocycles', 'long terme', 'MEV progressif', 'Israetel', 'RP'],
  },
  {
    id: 'rp_009',
    topic: 'exercise',
    subtopics: ['sélection exercices', 'pertinence', 'SFR'],
    finding: 'Le ratio Stimulus/Fatigue/Récupération (SFR) doit guider le choix des exercices : ceux qui donnent le plus de stimulus avec le moins de fatigue systémique et récupèrent le plus vite.',
    detail: 'Ex : squat = SFR bas (très fatigant pour tout le corps). Leg press = SFR moyen. Leg extension = SFR élevé (fatigue locale, récupération rapide). On ne peut pas faire que des squats lourds tout le temps — intégrer des exercices à SFR élevé.',
    source: 'Israetel — RP Strength (2020-2024)',
    application: 'Construire les blocs de programme avec des exercices à SFR décroissant : bloc A = SFR bas (composés), bloc C = SFR élevé (isolation).',
    example: 'Ex : Bloc A : squat (SFR bas, très fatigant). Bloc B : presse à cuisses (SFR moyen). Bloc C : leg extension (SFR élevé). Progression vers les exercices à SFR élevé en fin de séance.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['SFR', 'stimulus', 'fatigue', 'récupération', 'exercice', 'Israetel'],
  },
  {
    id: 'rp_010',
    topic: 'nutrition',
    subtopics: ['surplus calorique', 'prise de masse', 'rythme'],
    finding: 'Un surplus calorique de 200-500 kcal/jour maximise la prise de masse maigre en minimisant la prise de gras. Un surplus excessif augmente le gras sans accélérer la prise musculaire.',
    detail: 'La capacité de synthèse musculaire a une limite biologique (~0.5-1.5kg de muscle/mois selon le niveau). Un surplus de 500+ kcal/jour au-delà ne fait qu\'augmenter la masse grasse. Pour les débutants : +300-400 kcal/jour. Avancés : +150-250 kcal.',
    source: 'Israetel — RP Diet Book (2019) ; Barakat et al. 2020',
    application: 'Viser un surplus modéré (200-400 kcal/jour) pour maximiser le ratio muscle/gras pris.',
    example: 'Ex : athlète intermédiaire 80kg, maintenance 2500 kcal → phase de prise à 2800-2900 kcal (+300-400). Gain attendu : 0.3-0.5kg/sem, dont ~0.1-0.2kg de muscle réel.',
    objectives: ['hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['surplus calorique', 'prise de masse', 'kcal', 'Israetel', 'RP'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // BFR — BLOOD FLOW RESTRICTION
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'bfr_001',
    topic: 'technique',
    subtopics: ['BFR', 'occlusion', 'low load'],
    finding: 'L\'entraînement BFR (Blood Flow Restriction) à 20-40% 1RM produit une hypertrophie comparable à l\'entraînement à haute charge (70-85% 1RM), mais des gains de force légèrement inférieurs.',
    detail: 'La restriction du flux sanguin crée un stress métabolique (accumulation de lactate, hypoxie, gonflement cellulaire) qui force le recrutement des fibres rapides à des charges sous-maximales. Mécanismes : activation mTORC1, élévation GH/IGF-1, recrutement UM rapides par fatigue accélérée.',
    source: 'Frontiers in Physiology (2024) — méta-analyse BFR upper extremity ; MDPI Life (2024)',
    application: 'Utiliser le BFR lors des décharges, en rééducation, ou quand la charge articulaire doit être minimisée. Protocole : 30-15-15-15 répétitions, 30-45s de repos, 20-40% 1RM, pression de coiffe à 40-80% LOP (Limb Occlusion Pressure).',
    example: 'Ex : après une blessure au genou, leg extension BFR à 30% 1RM, 30-15-15-15 reps, 3×/sem. Hypertrophie quadriceps comparable à une rééducation à haute charge, avec bien moins de stress articulaire.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['BFR', 'occlusion', 'restriction flux sanguin', 'low load', 'rééducation'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // STRETCH-MEDIATED HYPERTROPHY — ENTRAÎNEMENT EN POSITION ÉTIRÉE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'stretch_001',
    topic: 'exercise',
    subtopics: ['étirement sous charge', 'longueur musculaire', 'hypertrophie'],
    finding: 'Entraîner un muscle en position étirée (longueur maximale) produit 2× plus d\'hypertrophie qu\'en position raccourcie, même à volume égal.',
    detail: 'Pedrosa 2022 : leg extension en position étirée (65-100° flexion) → 2× plus d\'hypertrophie quadriceps vs position raccourcie. Maeo 2023 : lengthened partials ischio-jambiers → +6.8% vs +3.1% pour le full ROM. Mécanisme : activation de la titine, addition de sarcomères en série (sarcomerogenèse), tension passive élevée.',
    source: 'Pedrosa et al. (2022) European Journal of Sport Science ; Maeo et al. (2021, 2023) Journal of Sports Sciences',
    application: 'Sélectionner les exercices qui chargent le muscle en position maximalement étirée. Exemples : RDL > leg curl allongé pour les ischio, curl incliné > curl debout pour les biceps.',
    example: 'Ex : curl incliné sur banc à 45° — en bas du mouvement, le bras est en extension complète → biceps maximalement étiré SOUS charge. +40-60% plus de volume musculaire que le curl debout à même nombre de séries.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: ['Biceps', 'Ischio-jambiers', 'Fessiers', 'Quadriceps', 'Triceps'],
    keywords: ['étirement sous charge', 'longueur musculaire', 'stretch hypertrophie', 'sarcomères', 'position étirée'],
  },

  {
    id: 'tension_profile_001',
    topic: 'exercise',
    subtopics: ['tension de pic de contraction', 'étirement sous charge', 'sélection exercice'],
    finding: 'Chaque exercice a un profil de tension : certains chargent le muscle maximalement en position étirée (stretch), d\'autres au pic de contraction (contracted). Un programme complet doit inclure les deux pour chaque groupe musculaire.',
    detail: 'Exercices à fort ÉTIREMENT (tension max en position allongée) : curl incliné, RDL, leg curl assis, extension triceps overhead, pull-over, fly haltères bras ouverts, squat profond, fente arrière. Exercices à fort PIC DE CONTRACTION (tension max en position raccourcie) : preacher curl, concentration curl, leg extension, pec deck/butterfly, câble croisé bras croisés, kickback triceps, hip thrust haut. Les exercices à fort étirement ont actuellement plus de données en faveur de l\'hypertrophie (Pedrosa 2022, Maeo 2021), mais les exercices à pic de contraction produisent un stress métabolique élevé et un MMC (connexion esprit-muscle) supérieur, complémentaires pour le développement complet.',
    source: 'Pedrosa et al. (2022) ; Maeo et al. (2021, 2023) ; Calatayud et al. (2016) — MMC et activation EMG ; RP Israetel — exercise selection hierarchy (2023)',
    application: 'Pour chaque groupe musculaire : sélectionner au minimum 1 exercice à fort étirement (priorité) + 1 exercice à pic de contraction. Les exercices à étirement sont préférables en début de session (plus de fatigue tolérable). Les exercices à pic de contraction fonctionnent bien en fin de session (isolation, pompe, MMC). Les câbles permettent souvent les deux si l\'angle est bien choisi.',
    example: 'Biceps : curl incliné (étirement) + preacher curl (pic contraction). Pectoraux : fly haltères (étirement) + pec deck machine (pic contraction). Ischio-jambiers : RDL ou leg curl assis (étirement) + hip thrust (pic contraction). Quadriceps : squat profond (étirement) + leg extension (pic contraction).',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: ['Biceps', 'Ischio-jambiers', 'Fessiers', 'Quadriceps', 'Triceps', 'Poitrine', 'Dos', 'Épaules'],
    keywords: ['tension étirement', 'pic contraction', 'sélection exercice', 'profil de tension', 'stretch', 'contracted'],
  },
  {
    id: 'tension_profile_002',
    topic: 'exercise',
    subtopics: ['répétitions', 'tension de pic', 'étirement', 'tempo'],
    finding: 'Le profil de tension d\'un exercice influence le choix des répétitions et du tempo optimal.',
    detail: 'Exercices à fort ÉTIREMENT : les reps plus basses (6-10) permettent de maintenir une charge suffisante pour produire une tension passive élevée dans la position étirée — trop de reps = fatigue avant d\'atteindre la tension maximale. Un tempo excentrique lent (3-4s) amplifie le stimulus en position étirée. Exercices à pic de CONTRACTION : les reps plus élevées (12-20+) maximisent le stress métabolique et la pompe musculaire, avec pause isométrique de 1s au pic pour renforcer la connexion neuromusculaire. La recherche (Maeo 2023) suggère que pour les exercices en étirement, des reps partielles basses peuvent être supérieures au full ROM à volume équivalent.',
    source: 'Maeo et al. (2023) — lengthened partials ; Pedrosa et al. (2022) ; Calatayud et al. (2016) — contraction volontaire maximale et MMC ; Israetel RP (2023)',
    application: 'Étirement (curl incliné, RDL, overhead) : 6-10 reps, tempo excentrique 3-4s, charges plus lourdes. Pic de contraction (preacher curl, pec deck, leg extension) : 12-20 reps, 1s de pause en haut, charges modérées. Ne pas appliquer le même schéma de reps à tous les exercices indifféremment.',
    example: 'RDL (étirement) : 4×8 avec 3s d\'excentrique, descendre jusqu\'à mi-tibia. Leg extension (pic contraction) : 3×15-20, pause 1s genou étendu à chaque rep. Résultat : stimulus plus complet du quadriceps et des ischio-jambiers que 4×12 sur les deux exercices.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: ['Biceps', 'Ischio-jambiers', 'Fessiers', 'Quadriceps', 'Triceps', 'Poitrine'],
    keywords: ['tempo', 'reps', 'étirement', 'pic contraction', 'excentrique', 'pause isométrique'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CLUSTER SETS & REST-PAUSE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'cluster_001',
    topic: 'technique',
    subtopics: ['cluster sets', 'rest-pause', 'intra-set rest'],
    finding: 'Les cluster sets et rest-pause produisent une hypertrophie similaire aux séries traditionnelles à volume égal, mais sont supérieurs pour le développement de la force maximale et maintiennent mieux la qualité d\'exécution.',
    detail: 'Frontiers 2025 (méta-analyse) : cluster sets supérieurs aux séries traditionnelles pour la force maximale. Pour l\'hypertrophie seule : résultats identiques à volume équivalent. L\'avantage : maintien de la vitesse de barre et de la puissance à travers les séries, permettant un travail de meilleure qualité.',
    source: 'Frontiers in Physiology (2025) — méta-analyse cluster sets et force maximale ; PMC/Springer (2025)',
    application: 'Cluster sets pour les séances force/puissance où la qualité technique prime. Rest-pause pour l\'hypertrophie quand le temps est limité — étend les reps efficaces au-delà d\'une série traditionnelle.',
    example: 'Ex : bench press cluster set à 90% 1RM — 4 reps, pause 20s, 4 reps, pause 20s, 4 reps = 12 reps de haute qualité. Rest-pause hypertrophie : série à RIR 0, pause 15s, 3-5 reps supplémentaires.',
    objectives: ['strength', 'hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['cluster sets', 'rest-pause', 'intra-set', 'force', 'qualité exécution'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CONNEXION NEUROMUSCULAIRE (MIND-MUSCLE CONNECTION)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'mmc_001',
    topic: 'technique',
    subtopics: ['mind-muscle connection', 'focus interne', 'EMG'],
    finding: 'La focalisation interne (contracter consciemment le muscle cible) augmente l\'activation EMG de 9-12% sur les exercices d\'isolation à charges sub-maximales (20-60% 1RM). L\'effet disparaît à >80% 1RM et est faible sur les composés.',
    detail: 'Calatayud 2016 : focus interne → +9% activation pectoraux au développé couché. Une étude montre +12.4% de croissance des biceps avec focus interne vs externe. Limitation : le focus interne peut réduire la force globale produite sur les composés en perturbant la coordination automatique.',
    source: 'Calatayud et al. (2016) Journal of Human Kinetics ; Schoenfeld & Contreras (2016) Strength and Conditioning Journal',
    application: 'Utiliser la connexion neuromusculaire sur les isolations légères à modérées. Sur les composés lourds, utiliser des cues externes ("pousser le sol", "fléchir la barre") pour maximiser la force.',
    example: 'Ex : élévations latérales — plutôt que de "lever les bras", se concentrer sur "écarter le deltoïde médian". Différence nette dans la brûlure ressentie sur le côté de l\'épaule vs le dessus.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['mind-muscle connection', 'focus interne', 'EMG', 'activation', 'isolation'],
  },

  {
    id: 'mmc_002',
    topic: 'technique',
    subtopics: ['pré-activation', 'recrutement musculaire', 'difficulté activation', 'cues'],
    finding: 'Quand un muscle est difficile à recruter sur un composé (ex: pecs au bench, fessiers au squat), la pré-activation par un exercice d\'isolation léger avant le composé améliore son recrutement neuromusculaire de façon aiguë.',
    detail: 'Principe : faire 1-2 séries légères d\'isolation sur le muscle cible (20-30 reps, sans fatigue) juste avant le composé principal "allume" le muscle neurologiquement et améliore la connexion esprit-muscle pendant le composé. Ce n\'est pas de la pré-fatigue (qui réduirait la performance) — c\'est de l\'activation sensorielle à faible charge. En parallèle, les cues techniques sont le levier le plus puissant : les cues internes ("contracter les pecs") sont supérieurs sur les isolations, les cues externes ("pousser la barre vers l\'extérieur" au bench) sont supérieurs sur les composés lourds pour maintenir la force tout en améliorant le recrutement. Muscles problématiques fréquents et leurs cues : pecs au bench ("écraser" la barre vers le centre, coudes légèrement rentrés) ; grand dorsal au tirage ("mettre les coudes dans les poches") ; fessiers au squat (pousser les genoux vers l\'extérieur, talon en premier) ; épaule médiane aux élévations ("écarter le bras" plutôt que "lever le bras").',
    source: 'Calatayud et al. (2016) Journal of Human Kinetics — cues internes vs externes ; Snyder & Leech (2009) — cueing and EMG activation ; Boeckh-Behrens & Buskies (2000) — muscle activation cues',
    application: 'Si un utilisateur signale ne pas sentir un muscle : 1) Vérifier les cues techniques (interne pour isolations, externe pour composés). 2) Ajouter 1-2 séries de pré-activation légère (20-30 reps) juste avant le composé. 3) En dernier recours : remplacer l\'exercice composé par un exercice à fort pic de contraction sur ce muscle pour renforcer le chemin neuromusculaire. 4) Réduire la charge sur le composé temporairement pour se concentrer sur la sensation.',
    example: 'Ex : utilisateur qui ne sent pas ses pecs au bench → avant la séance : 2×25 fly câble très léger (pré-activation). Pendant le bench : cue "coudes vers l\'intérieur comme pour déchirer la barre", prise légèrement plus serrée. Résultat : sensation dans les pecs immédiate pour la plupart des utilisateurs. Si toujours absent → ajouter pec deck machine en priorité pour construire le chemin neuromusculaire, réduire provisoirement le bench lourd.',
    objectives: ['hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Poitrine', 'Fessiers', 'Dos', 'Épaules', 'Quadriceps'],
    keywords: ['pré-activation', 'recrutement', 'difficulté activation', 'cues', 'ne sent pas', 'muscle difficile', 'connexion neuromusculaire'],
  },
  {
    id: 'chain_001',
    topic: 'exercise',
    subtopics: ['chaîne ouverte', 'chaîne fermée', 'CKC', 'OKC'],
    finding: 'Les exercices en chaîne fermée (CKC — pied/main au sol ou fixe) et en chaîne ouverte (OKC — extrémité libre) produisent des adaptations différentes et sont complémentaires selon l\'objectif.',
    detail: 'CHAÎNE FERMÉE (CKC) : squat, presse, pompes, tractions. L\'extrémité distale est fixe. Activation musculaire multiarticulaire simultanée, stress articulaire réparti sur plusieurs articulations, stabilisation active requise. Supérieurs pour la force fonctionnelle et la coordination intermusculaire. CHAÎNE OUVERTE (OKC) : leg extension, curl, fly, élévations latérales. L\'extrémité est libre. Isolation d\'un muscle sur une seule articulation, tension maximale possible sur le muscle cible, meilleur contrôle du profil de tension (étirement/contraction). Supérieurs pour l\'hypertrophie isolée, la rééducation et le ciblage des muscles difficiles à recruter. PRATIQUE : CKC en début de séance (blocs A/B) pour la surcharge globale, OKC en fin de séance (bloc C) pour l\'isolation et le développement ciblé. En rééducation : OKC permettent de contourner une articulation douloureuse tout en maintenant le stimulus musculaire.',
    source: 'Augustsson et al. (1998) — OKC vs CKC quadriceps ; Mayer et al. (2003) — chaînes cinétiques et rééducation ; NSCA Essentials of Strength Training — kinetic chain principles',
    application: 'Structurer les séances en CKC → OKC (composés → isolation). Pour rééducation ou zone fragile : privilégier OKC pour maintenir le stimulus sans stress articulaire. Pour recrutement d\'un muscle faible : OKC en pré-activation puis CKC. Pour force fonctionnelle : CKC en priorité.',
    example: 'Ex : utilisateur avec genou douloureux. Squats (CKC) douloureux → remplacer par leg extension (OKC) pour maintenir le stimulus quadriceps sans compression articulaire. Ou : pec deck (OKC) avant bench (CKC) pour pré-activer les pecs chez quelqu\'un qui ne les sent pas au composé.',
    objectives: ['hypertrophy', 'strength', 'endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['chaîne ouverte', 'chaîne fermée', 'CKC', 'OKC', 'isolation', 'fonctionnel', 'rééducation'],
  },
  {
    id: 'intensity_technique_001',
    topic: 'intensity',
    subtopics: ['top set', 'back-off set', 'RPE', 'intensité variable'],
    finding: 'La structure top set / back-off sets (1 série lourde proche du max → séries de volume à charge réduite) permet de combiner stimulus neural (charge élevée) et stimulus hypertrophique (volume) dans la même séance.',
    detail: 'Top set : 1 série à 85-95% 1RM (ou RPE 8-9), peu de reps (1-5). Cela stimule les adaptations neurales et la force maximale. Back-off sets : 3-5 séries à 70-80% du top set (ou RPE 6-7), reps plus élevées (6-10). Cela accumule le volume hypertrophique sans la fatigue systémique du top set répété. Avantage : le top set "potentialise" les back-off sets via activation post-tétanique (PAP) — les fibres rapides recrutées restent sensibilisées pendant ~5-10 min. Variantes : Texas Method (top set hebdomadaire unique + volume en début de semaine), 5/3/1 (top set progressif par vagues + FSL back-off), programmes RP (top set + MEV back-offs). Différent des séries drop : le back-off est planifié à l\'avance, pas une extension de la série précédente.',
    source: 'Wendler — 5/3/1 (2009) ; Graves et al. (1988) — PAP post-activation potentiation ; Israetel RP — intensity techniques (2021-2024) ; Texas Method — Rippetoe & Kilgore',
    application: 'Top set + back-off idéal pour : objectif mixte force+hypertrophie, intermédiaires qui stagnent en volume pur, programme à fréquence basse (2×/sem par muscle). Structure : top set RPE 8-9 → repos 3-5 min → back-off 70-80% du top set × 3-4 séries. Ne pas utiliser chez les débutants — la progression linéaire simple est supérieure et plus simple à gérer.',
    example: 'Ex : développé couché intermédiaire. Top set : 100kg × 3 reps (RPE 9). Repos 4 min. Back-off : 80kg × 4×8 (RPE 7). Le top set crée le stimulus neural, les back-offs accumulent le volume hypertrophique. Total : 1+4 séries de qualité vs 5 séries à charge uniforme (moins efficace).',
    objectives: ['strength', 'hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['top set', 'back-off', 'RPE', 'intensité', 'PAP', 'force hypertrophie', 'Texas Method', '5/3/1'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ROM — AMPLITUDE DE MOUVEMENT
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'rom_001',
    topic: 'technique',
    subtopics: ['ROM', 'amplitude', 'partiel vs complet'],
    finding: 'Les répétitions partielles en position étirée (lengthened partials) produisent une hypertrophie égale ou supérieure au ROM complet. Les répétitions partielles en position raccourcie sont inférieures pour l\'hypertrophie et la force.',
    detail: 'Wolf et al. 2025 : lengthened partials au lat pulldown = full ROM pour l\'hypertrophie chez des sujets entraînés. Pedrosa 2022 : lengthened partials > full ROM pour les quadriceps. SportRxiv 2025 : évidence modérée pour l\'absence de différence entre lengthened partials et full ROM. Shortened partials = moins efficaces dans tous les cas.',
    source: 'Wolf et al. (2025) PeerJ ; Pedrosa et al. (2022) ; PMC (2025) "Partial Range Full Gains"',
    application: 'Pour l\'hypertrophie : prioriser les exercices à amplitude complète ou les partiels en position étirée. Éviter les partiels en position raccourcie comme exercice principal. Pour la force (1RM) : ROM complet reste supérieur.',
    example: 'Ex : Nordic curl partiel (bas du mouvement seulement, jambe quasi-tendue) → charge ischio-jambiers en position maximalement étirée → hypertrophie supérieure au Nordic complet qui termine en position raccourcie.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['ROM', 'amplitude', 'partiel', 'complet', 'lengthened', 'shortened'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // DROP SETS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'dropset_001',
    topic: 'technique',
    subtopics: ['drop sets', 'efficacité temporelle'],
    finding: 'Les drop sets produisent une hypertrophie similaire aux séries traditionnelles mais en 50-66% du temps total. Ils n\'offrent pas d\'avantage hypertrophique supplémentaire à volume équivalent.',
    detail: 'Méta-analyse IUSCA : ES = 0.07-0.08 en faveur des drop sets vs traditionnels — différence négligeable. Springer 2023 (méta-analyse) : aucune différence significative. PMC 2021 : hypertrophie régionale légèrement différente — drop sets → plus de croissance à 30-50% de la longueur musculaire. Avantage réel : même stimulus en moins de temps.',
    source: 'IUSCA Journal méta-analyse ; Sports Medicine Open Springer (2023) ; PMC (2021)',
    application: 'Utiliser les drop sets quand le temps est limité ou comme finisseur en fin de séance. Ne pas les utiliser en espérant un surplus hypertrophique — l\'avantage est l\'efficacité temporelle.',
    example: 'Ex : élévations latérales — 4×15 traditionnels = 10 min. Drop set version : 15kg×10, drop 10kg×10, drop 7kg×10 = 3 min. Même stimulus hypertrophique. Idéal pour les derniers exercices d\'une longue séance.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['drop sets', 'efficacité', 'temps', 'hypertrophie', 'finisseur'],
  },
  {
    id: 'dropset_002',
    topic: 'technique',
    subtopics: ['mechanical drop sets', 'levier', 'angle'],
    finding: 'Les mechanical drop sets exploitent un changement d\'angle ou de levier pour continuer une série au-delà de l\'échec sans réduire la charge — maintenant la tension mécanique sur un nouveau ROM.',
    detail: 'Mécanisme identique aux drop sets classiques (stress métabolique étendu, recrutement post-échec). Avantage vs drop sets classiques : pas de temps perdu à changer les poids. Idéal pour les exercices au poids de corps et certaines machines.',
    source: 'PMC (2021) — drop sets quadriceps ; framework appliqué Thibaudeau',
    application: 'Utiliser sur les exercices avec variantes mécaniques claires : pompes (pieds surélevés → à plat → inclinées), tractions (prise serrée → large → supine), fentes (bulgare → inversée → normale).',
    example: 'Ex : tractions prise large à l\'échec (6 reps) → immédiatement prise neutre à l\'échec (4 reps) → immédiatement chin-up supine à l\'échec (3-4 reps). 13-14 reps de pull de qualité sans toucher les poids.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: ['Dos', 'Biceps'],
    keywords: ['mechanical drop sets', 'levier', 'angle', 'prise', 'post-échec'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // FEMMES — SPÉCIFICITÉS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'female_001',
    topic: 'population',
    subtopics: ['femmes', 'cycle menstruel', 'entraînement'],
    finding: 'Les données actuelles ne soutiennent PAS la périodisation de l\'entraînement selon les phases du cycle menstruel pour des avantages hypertrophiques ou de force significatifs. L\'auto-régulation par l\'effort perçu est plus pratique et aussi efficace.',
    detail: 'Frontiers in Sports 2023 : "aucune influence du cycle menstruel sur la performance de force aiguë ou les adaptations à l\'entraînement". Journal of Applied Physiology 2025 (méta-analyse haute qualité) : effets inconsistants et de faible magnitude. Les femmes ont généralement une meilleure résistance à la fatigue (plus de fibres type I en proportion) et récupèrent plus vite entre les séries.',
    source: 'Frontiers in Sports and Active Living (2023) ; Journal of Applied Physiology (2025) ; Strength and Conditioning Journal (2025)',
    application: 'Entraîner les femmes avec les mêmes principes fondamentaux que les hommes. Si une femme ressent subjectivement une baisse d\'énergie en phase lutéale, auto-réguler l\'intensité cette semaine plutôt que de restructurer le programme mensuellement.',
    example: 'Ex : une femme qui pense devoir réduire son volume en phase lutéale peut simplement noter son RIR perçu. Si les charges semblent plus lourdes, réduire de 1 série par exercice ce jour-là — pas besoin de reprogrammer l\'intégralité du mois.',
    objectives: ['hypertrophy', 'strength', 'endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['femmes', 'cycle menstruel', 'hormones', 'auto-régulation', 'spécificités'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // MASTERS ATHLETES — 40 ANS ET PLUS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'masters_001',
    topic: 'population',
    subtopics: ['masters', '40+', 'résistance anabolique', 'sarcopénie'],
    finding: 'L\'hypertrophie reste possible à 40-70+ ans, mais la résistance anabolique nécessite un volume plus élevé, un apport protéique supérieur (>40g/repas), et un entraînement à haute intensité pour maintenir les fibres de type II.',
    detail: 'Journal of Applied Physiology 2023 : les non-répondeurs à faible volume chez les seniors répondent au volume élevé — il n\'y a pas de "vrais non-répondeurs" à l\'exercice. MDPI Nutrients 2025 : les athlètes masters actifs depuis longtemps montrent une atténuation significative de la résistance anabolique — la régularité d\'entraînement est le facteur protecteur n°1.',
    source: 'Journal of Applied Physiology (2023) ; MDPI Nutrients (2025) ; Frontiers in Physiology (2025)',
    application: 'Masters : ne pas réduire le volume par défaut. Augmenter les protéines à 1.8-2.4g/kg/jour avec 40g+ par repas. Maintenir le travail lourd (70-85% 1RM) pour préserver les fibres type II. Ajouter 1 jour de récupération si besoin.',
    example: 'Ex : homme de 55 ans sans progression après 12 semaines à 3 séries/groupe. Augmenter à 5-6 séries/groupe, 50g de protéines post-séance (whey + fromage blanc), maintenir les composés lourds. Résultat attendu : hypertrophie à 6-8 semaines.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['masters', '40+', 'résistance anabolique', 'sarcopénie', 'seniors', 'volume'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÉCHAUFFEMENT
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'warmup_001',
    topic: 'technique',
    subtopics: ['échauffement', 'warm-up', 'performance'],
    finding: 'Un échauffement spécifique à 80% de la charge de travail (1-2 séries de 3-4 reps) optimise la performance des séances. Des échauffements élaborés ne sont pas nécessaires pour les charges sous-maximales (10-15 RM).',
    detail: 'ScienceDirect 2024 : warm-up à 80% de la charge de travail produit plus de volume total, plus de reps et une meilleure charge de travail totale vs warm-up à 40-60%. ScienceDirect 2025 : pour les charges à ~10 RM, 1-2 séries modérées suffisent. PMC 2025 : des séries de "re-warm-up" entre exercices améliorent la vitesse propulsive et réduisent la fatigue.',
    source: 'ScienceDirect (2024) — warm-up load and RT performance ; PMC (2025) — re-warm-up during RT',
    application: 'Échauffement général : 5-10 min mobilité/cardio léger. Échauffement spécifique avant le 1er composé lourd : 2 séries montantes (50%×8, 75%×3-4). Exercices suivants : 1 série à 50% suffit. Charge à 10+ RM : 1 série modérée maximum.',
    example: 'Ex : séance squat principal. 5 min vélo léger → 40%×10 (technique) → 60%×5 → 75%×3 → séries de travail. Transition vers leg press ensuite : 1 série à 50% suffit, la chaîne postérieure est déjà prête.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['échauffement', 'warm-up', 'performance', 'ramp-up', 'mobilisation'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // MÉMOIRE MUSCULAIRE — MYONUCLEI
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'muscle_memory_001',
    topic: 'recovery',
    subtopics: ['mémoire musculaire', 'myonuclei', 'désentraînement'],
    finding: 'La mémoire musculaire permet de regagner la masse perdue après une période d\'inactivité 2× plus vite qu\'il n\'a fallu pour la construire initialement. Les myonuclei acquis semblent persister partiellement après le désentraînement.',
    detail: 'Cumming et al. 2024 (Journal of Physiology) : biopsies humaines montrent que les myonuclei sont maintenus après désentraînement alors que la CSA des fibres diminue — créant un ratio myonucléaire élevé qui accélère la re-croissance. Méta-analyse PMC 2022 : résultats mixtes chez l\'humain vs rongeurs. La mémoire musculaire peut aussi être épigénétique (méthylation ADN).',
    source: 'Cumming et al. (2024) Journal of Physiology ; PMC (2022) méta-analyse ; Frontiers in Nutrition (2025)',
    application: 'Les athlètes qui reprennent après une pause regagnent leur masse précédente en ~50% du temps original. Ne pas paniquer lors d\'un arrêt — commencer la reprise avec un volume modéré les 1-2 premières semaines pour éviter les DOMS excessifs.',
    example: 'Ex : athlète ayant construit 8kg de muscle en 2 ans → arrêt 3 mois → perd 3-4kg → reprise : les 3-4kg reviennent en 6-8 semaines. La mémoire musculaire est réelle et fonctionnellement robuste.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['mémoire musculaire', 'myonuclei', 'désentraînement', 'reprise', 'regain'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // VARIABILITÉ INDIVIDUELLE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'variability_001',
    topic: 'adaptation',
    subtopics: ['non-répondeurs', 'variabilité', 'volume'],
    finding: 'Les vrais non-répondeurs à l\'entraînement sont rares. La plupart des non-répondeurs apparents répondent au volume élevé. La réponse individuelle est un trait stable et reproductible d\'un mésocycle à l\'autre.',
    detail: 'Frontiers 2025 : design intra-individuel — la variabilité de réponse est bien plus faible au sein d\'un même individu qu\'entre individus. PMC 2025 : les grands répondeurs restent grands répondeurs et vice versa à travers plusieurs cycles d\'entraînement. Journal of Applied Physiology 2023 : les non-répondeurs à faible volume répondent au volume élevé chez les seniors.',
    source: 'Frontiers in Sports and Active Living (2025) ; PMC (2025) ; Journal of Applied Physiology (2023)',
    application: 'Avant de conclure à la non-réponse : auditer la proximité à l\'échec, le volume hebdomadaire, l\'apport protéique et le sommeil. Augmenter le volume est la première intervention à tester.',
    example: 'Ex : athlète sans progrès aux bras après 12 semaines à 10 séries/sem. Audit : RIR moyen 3 (pas assez proche de l\'échec), 1.4g/kg protéines (insuffisant). Corrections : viser RIR 1-2, passer à 1.8g/kg. Réévaluation à 8 semaines.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['non-répondeurs', 'variabilité', 'réponse', 'volume', 'génétique'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // RESPIRATION & PRESSION INTRA-ABDOMINALE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'breathing_001',
    topic: 'technique',
    subtopics: ['Valsalva', 'pression intra-abdominale', 'gainage', 'respiration'],
    finding: 'La manœuvre de Valsalva (rétention d\'air + fermeture glottique) combinée au gainage 360° génère la pression intra-abdominale maximale (~150-350 mmHg) et la stabilité spinale optimale pour les charges lourdes.',
    detail: 'PMC 2020 (revue systématique) : le Valsalva génère les IAP les plus élevées des exercices de résistance testés. MDPI Medicina 2024 : le Valsalva produit des pics tensionnels élevés mais transitoires — sans risque pour les sujets sains entraînés. Pour les séries longues (10+), la respiration continue avec gainage fort est préférable au Valsalva prolongé.',
    source: 'PMC (2020) revue systématique IAP ; MDPI Medicina (2024) Valsalva vs bracing',
    application: 'Charges >80% 1RM : inspiration profonde 360° (ventre/flancs/dos), gainage fort, Valsalva pendant le point de sticking. Expirer après le point critique. Séries à 10+ reps : inspirer en excentrique, expirer en concentrique, gainage maintenu.',
    example: 'Ex : squat à 85% 1RM. Debout avec la barre : inspiration profonde (ventre/flancs/dos gonflent), bloquer la glotte (Valsalva), descendre sous contrôle, pousser au travers du point bloquant, expirer seulement après le sticking point.',
    objectives: ['strength', 'hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['Valsalva', 'IAP', 'pression intra-abdominale', 'respiration', 'gainage', 'sécurité'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TYPES DE FIBRES MUSCULAIRES
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'fiber_001',
    topic: 'adaptation',
    subtopics: ['fibres musculaires', 'type I', 'type II', 'génétique'],
    finding: 'Le ratio fibres type I / type II est largement déterminé génétiquement et change peu avec l\'entraînement. Cependant, les fibres type II hypertrophient significativement plus avec les charges lourdes (>70% 1RM).',
    detail: 'Étude 2024 (protéomique) : adaptations spécifiques au type de fibre sans shift du ratio. Adultes non entraînés : ~42% type I, 58% type II. Ce ratio ne change pas après 12+ semaines d\'entraînement. Type II → type IIa transitions fréquentes avec tout exercice. Type II → type I nécessite un entraînement d\'endurance extrême sur des années.',
    source: 'biorXiv (2024) protéomique fibres ; Frontiers in Physiology (2025) revue adaptations fibres',
    application: 'Varier les plages de répétitions (6-20) pour stimuler les deux types de fibres. Un athlète avec plus de type I bénéficiera davantage des hautes répétitions. Un athlète avec plus de type II répondra mieux aux charges lourdes.',
    example: 'Ex : coureur de fond reconverti à la musculation → proportion élevée type I → programme avec 12-20 reps pour exploiter la résistance à la fatigue, complété de blocs de 5-8 reps lourds pour développer les type II sous-stimulées.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['fibres musculaires', 'type I', 'type II', 'génétique', 'adaptation', 'ratio'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CAFÉINE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'caffeine_001',
    topic: 'nutrition',
    subtopics: ['caféine', 'performance', 'dosage', 'timing'],
    finding: 'La caféine à 3-6 mg/kg prise 45-60 min avant la séance améliore significativement la force musculaire, la puissance, l\'endurance et la vitesse de barre lors de l\'entraînement de résistance.',
    detail: 'Frontiers in Nutrition 2025 (méta-analyse) : améliorations significatives de la vitesse et puissance musculaire avec caféine. MDPI Nutrients 2025 : dose optimale 3-6 mg/kg. Demi-vie 5-6h → caféine après 14h perturbe le sommeil même sans somnolence perçue. Utilisateurs habituels élevés (>6 mg/kg/jour) : effets ergogéniques atténués.',
    source: 'Frontiers in Nutrition (2025) méta-analyse caféine et puissance musculaire ; MDPI Nutrients (2025)',
    application: 'Dose : 3-6 mg/kg (200-400 mg pour la plupart). Timing : 45-60 min pré-séance. Éviter après 14h pour préserver le sommeil. Pause de 5-7 jours avant les séances clés (test 1RM, semaine de volume max) pour les utilisateurs habituels.',
    example: 'Ex : athlète de 75kg → 225mg de caféine (3 mg/kg) via café ou capsule à 17h pour une séance à 18h. Pic plasmatique à 18h15. Demi-vie → caféine encore active jusqu\'à ~23h → décaler si coucher à 22h.',
    objectives: ['strength', 'hypertrophy', 'endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['caféine', 'performance', 'dosage', 'timing', 'force', 'puissance', 'pré-séance'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÉQUIPEMENT — MACHINES VS POIDS LIBRES VS CÂBLES
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'equip_001',
    topic: 'exercise',
    subtopics: ['machines', 'poids libres', 'hypertrophie', 'équipement'],
    finding: 'Machines et poids libres produisent une hypertrophie équivalente à volume et effort égaux. Aucune modalité n\'est supérieure pour la croissance musculaire.',
    detail: 'Méta-analyse Haugen 2023 (BMC Sports Science, n=1016, 13 études) : aucune différence significative. Seul écart : spécificité de force — les gains de force se transfèrent à la modalité entraînée. Les machines sont plus sûres pour les débutants et permettent un meilleur isolement. Les poids libres recrutent davantage les stabilisateurs.',
    source: 'Haugen et al. (2023) BMC Sports Science Medicine and Rehabilitation ; méta-analyse JSMF (2022)',
    application: 'Ne pas pénaliser l\'entraînement sur machines. Filtrer les exercices par équipement disponible, pas par "supériorité". Un utilisateur avec uniquement des machines peut atteindre les mêmes résultats hypertrophiques.',
    example: 'Ex : un utilisateur avec leg press + câbles uniquement peut construire la même masse quadriceps et pectoraux qu\'un utilisateur avec barre — à condition de matcher le volume et de s\'approcher de l\'échec.',
    objectives: ['hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['machines', 'poids libres', 'câbles', 'haltères', 'équipement', 'hypertrophie'],
  },
  {
    id: 'equip_002',
    topic: 'exercise',
    subtopics: ['câble', 'tension constante', 'angle'],
    finding: 'Les câbles maintiennent une tension constante sur toute l\'amplitude, avantage unique vs haltères/barre qui ont une résistance variable selon l\'angle.',
    detail: 'Frontiers in Physiology 2025 : élévations latérales câble vs haltères → hypertrophie équivalente du deltoïde médian. Avantage câble : résistance maintenue en position étirée (ex: en bas de l\'élévation) où les haltères offrent peu de résistance. Avantage barre : charge absolue ~20% supérieure. Avantage haltères : amplitude de mouvement plus grande et variation unilatérale.',
    source: 'Frontiers in Physiology (2025) — câble vs haltères élévations latérales ; JSCR (2016)',
    application: 'Câbles : idéaux pour exercices où la résistance chute en position étirée (élévations, écarté, pushdown). Barre : force maximale. Haltères : ROM et variation unilatérale.',
    example: 'Ex : écarté câble croisé — en position d\'étirement (bras ouverts), la résistance du câble est maximale. Avec haltères, la résistance est quasi nulle dans cette position. Avantage câble pour cibler les pecs en étirement.',
    objectives: ['hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Poitrine', 'Épaules'],
    keywords: ['câble', 'tension constante', 'haltères', 'barre', 'amplitude', 'résistance'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ORDRE DES EXERCICES
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'order_001',
    topic: 'exercise',
    subtopics: ['ordre exercices', 'composés avant isolation'],
    finding: 'L\'ordre des exercices a un impact minimal sur l\'hypertrophie à volume équivalent. La convention composés-avant-isolation est une bonne pratique mais pas une règle absolue.',
    detail: 'Méta-analyse Nunes 2020 (Journal of Sports Sciences) : l\'ordre n\'affecte pas significativement l\'hypertrophie ni la force à volume égal. L\'effet pratique : les exercices placés en premier bénéficient d\'un meilleur recrutement et d\'une charge absolue plus élevée — mais l\'adaptation finale est similaire. La pré-exhaustion (isolation avant composé) ne surpasse pas le composé-d\'abord.',
    source: 'Nunes et al. (2020) Journal of Sports Sciences — revue systématique et méta-analyse',
    application: 'Composés en premier comme convention pour maximiser la charge sur les mouvements les plus exigeants. Exception : placer l\'isolation d\'abord pour cibler un muscle en retard (pré-exhaustion).',
    example: 'Ex : utilisateur voulant développer le deltoïde postérieur — commencer la séance dos par des face pulls ou des oiseaux (deltoïde post) avant le rowing barre. Le deltoïde post travaille frais, stimulus supérieur sur la zone cible.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['ordre exercices', 'composés', 'isolation', 'pré-exhaustion', 'séquence'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // UNILATÉRAL VS BILATÉRAL
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'unilateral_001',
    topic: 'exercise',
    subtopics: ['unilatéral', 'bilatéral', 'asymétrie'],
    finding: 'L\'entraînement unilatéral et bilatéral produisent une hypertrophie équivalente. La force gagnée est spécifique à la modalité entraînée. L\'unilatéral corrige les asymétries.',
    detail: 'Méta-analyse Sports Medicine 2025 + Frontiers in Physiology 2023 : aucune différence significative d\'hypertrophie. Le bilatéral est supérieur pour la force bilatérale (squat), l\'unilatéral pour la force unilatérale (split squat). L\'entraînement unilatéral stimule les stabilisateurs et réduit les asymétries membres gauche/droite.',
    source: 'Sports Medicine (2025) — méta-analyse unilatéral vs bilatéral ; Frontiers in Physiology (2023)',
    application: 'Pour l\'hypertrophie pure : les deux sont interchangeables. Pour corriger une asymétrie ou une faiblesse d\'un côté : prioriser l\'unilatéral. Pour la force bilatérale maximale (compétition) : bilatéral dominant.',
    example: 'Ex : utilisateur avec jambe gauche plus faible → Bulgarian split squat unilatéral pour corriger l\'asymétrie tout en construisant la même masse quadriceps que le squat bilatéral.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['unilatéral', 'bilatéral', 'asymétrie', 'stabilisateurs', 'split squat'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // POIDS DE CORPS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'bodyweight_001',
    topic: 'exercise',
    subtopics: ['poids de corps', 'calisthenics', 'hypertrophie sans matériel'],
    finding: 'L\'entraînement au poids de corps peut produire une hypertrophie réelle et significative, mais se heurte à des limites de surcharge progressive, particulièrement pour les jambes.',
    detail: 'Méta-analyse Refalo 2022 (Sports Medicine) : l\'entraînement à faible charge produit une hypertrophie comparable à la haute charge quand les séries sont menées près de l\'échec. La limite critique : la progression au poids de corps (plus de reps → tempo → amplitude → unilatéral → lestage) devient très lente pour un intermédiaire/avancé. Les jambes sont le point le plus limitant (le squat pistol est difficile à surcharger sans charge externe).',
    source: 'Refalo et al. (2022) Sports Medicine ; littérature calisthenics 2022-2024',
    application: 'Poids de corps = protocole complet valide pour les débutants. Intermédiaires : signaler les limites du bas du corps et recommander la progression vers charges externes (bande élastique, gilet lesté). Haut du corps et core : solution long terme viable.',
    example: 'Ex : débutant sans matériel → pompes progressives (standard → archer → pseudo-planche) pour pectoraux et triceps. Après 6-12 mois, les pompes deviennent insuffisantes → ajouter un sac à dos lesté ou bandes élastiques pour continuer à progresser.',
    objectives: ['hypertrophy'],
    levels: ['beginner', 'intermediate'],
    muscles: [],
    keywords: ['poids de corps', 'calisthenics', 'sans matériel', 'pompes', 'tractions', 'progression'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // FENÊTRE ANABOLIQUE — TIMING PROTÉINES
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'nut_004',
    topic: 'nutrition',
    subtopics: ['timing protéines', 'fenêtre anabolique', 'post-workout'],
    finding: 'La "fenêtre anabolique" de 30 minutes est largement un mythe. L\'apport total de protéines dans la journée compte bien plus que le timing précis post-entraînement.',
    detail: 'Méta-analyse MDPI Nutrients 2025 + Schoenfeld & Aragon JOSPT 2018 : le timing protéique (15 min pré à 2h post) n\'affecte pas significativement la force ou la composition corporelle une fois l\'apport total contrôlé. La vraie fenêtre est de 4-6 heures autour de la séance. Exception : entraînement à jeun ou dernier repas >4h avant → alors le post-workout devient plus important.',
    source: 'MDPI Nutrients (2025) méta-analyse ; Schoenfeld & Aragon (2018) JOSPT',
    application: 'Prioriser l\'atteinte des objectifs protéiques quotidiens (1.6-2.2g/kg). Post-workout : pratique, pas critique. Si le dernier repas était >4h avant la séance, manger des protéines rapidement après.',
    example: 'Ex : utilisateur qui mange 40g de protéines 1h avant sa séance — pas besoin de se précipiter sur un shake post-entraînement. Son prochain repas dans les 3-4h est suffisant. Le panic du "shake en 30 min ou je perds mes gains" est infondé.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['timing protéines', 'fenêtre anabolique', 'post-workout', 'shake', 'repas'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // DÉFICIT CALORIQUE ET MUSCLE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'nut_005',
    topic: 'nutrition',
    subtopics: ['déficit calorique', 'recomposition', 'muscle', 'coupe'],
    finding: 'Un déficit >500 kcal/jour cause une perte de masse maigre systématique. En dessous de 500 kcal/jour, la recomposition (perte de gras + gain ou maintien musculaire) est possible, surtout chez les débutants.',
    detail: 'Méta-analyse Scandinavian JMSS 2022 : relation linéaire entre taille du déficit et perte de masse maigre. <500 kcal → recomposition possible. >500 kcal → perte de masse maigre proportionnelle. Volume d\'entraînement élevé (≥10 séries/muscle/sem) protège la masse maigre en déficit. Protéines élevées (2.2-3.1g/kg) en déficit maximisent la rétention musculaire.',
    source: 'Scandinavian Journal of Medicine & Science in Sports (2022) ; PMC9012799 (2022)',
    application: 'En objectif coupe : déficit maximal 500 kcal/jour. Maintenir le volume d\'entraînement (ne pas réduire les séries). Augmenter les protéines à 2.2-3.1g/kg. Éviter les déficits agressifs qui sacrifient le muscle.',
    example: 'Ex : utilisateur voulant perdre du gras → déficit de 400 kcal/jour + 2.4g/kg protéines + volume maintenu → perte de gras sans perte musculaire sur 12 semaines. À 700 kcal de déficit : même scénario → 1-2kg de muscle perdu.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['déficit', 'recomposition', 'coupe', 'masse maigre', 'protéines'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ALCOOL ET SYNTHÈSE PROTÉIQUE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'nut_006',
    topic: 'nutrition',
    subtopics: ['alcool', 'synthèse protéique', 'MPS'],
    finding: 'L\'alcool bloque la synthèse protéique musculaire de façon dose-dépendante. Une dose élevée (1.5g/kg = ~8-12 verres) réduit la MPS de 24-37% pendant >13h, même avec des protéines co-ingérées.',
    detail: 'Parr et al. 2014 (PLOS ONE) : sujet après entraînement concurrent. Alcool 1.5g/kg → réduction MPS de 24% avec protéines, 37% avec glucides. Mécanisme : l\'alcool interfère avec la voie mTOR. Faible dose (0.5g/kg = ~2-3 verres) : impact mesurable minimal. L\'alcool post-entraînement est le pire scénario (MPS déjà élevée → suppression maximale).',
    source: 'Parr et al. (2014) PLOS ONE (PMC3922864) ; American Journal of Physiology (2015)',
    application: '1-2 verres occasionnellement = impact négligeable. Consommation régulière d\'alcool (5+ verres plusieurs soirs/sem) = hypertrophie mesurément réduite. Alcool juste après une séance = pire timing possible.',
    example: 'Ex : utilisateur qui fête une séance avec 8 verres supprime sa MPS de 37% pendant >13h. Son muscle travaillé ce soir n\'est quasiment pas en train de se reconstruire. Mieux vaut décaler la soirée au lendemain des jours de repos.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['alcool', 'MPS', 'synthèse protéique', 'mTOR', 'boissons'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ANTI-INFLAMMATOIRES (AINS) ET HYPERTROPHIE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'health_001',
    topic: 'recovery',
    subtopics: ['AINS', 'ibuprofène', 'hypertrophie', 'prostaglandines'],
    finding: 'Les AINS à haute dose chronique (≥1200mg/jour) réduisent l\'hypertrophie de ~50% chez les jeunes adultes. À faible dose occasionnelle (400mg), l\'impact est limité. Chez les 50+, les AINS peuvent paradoxalement augmenter l\'hypertrophie.',
    detail: 'Étude 2017 (PMID 28834248) : ibuprofène 1200mg/jour chronique → gain quad 3.7% vs 7.5% pour faible dose. Mécanisme : les prostaglandines (inhibées par les AINS) jouent un rôle dans l\'activation des cellules satellites et la signalisation anabolique chez les jeunes. Journal of Physiology 2025 : les AINS augmentent l\'hypertrophie chez les athlètes entraînés (>50 ans probablement).',
    source: 'PMID 28834248 (2017) — haute dose ibuprofène ; Journal of Physiology (2025) ; JAP (2023)',
    application: 'Déconseiller les AINS chroniques à haute dose autour de l\'entraînement pour les jeunes. Faible dose ponctuelle (400mg pour douleur aiguë) : pas de problème. 50+ : la donne est différente.',
    example: 'Ex : jeune de 25 ans prenant ibuprofène 1200mg/jour pour une douleur chronique au genou pendant un bloc d\'hypertrophie → peut réduire ses gains quadriceps de moitié. Glace, adaptation de la charge et physiothérapie sont préférables.',
    objectives: ['hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['AINS', 'ibuprofène', 'anti-inflammatoire', 'prostaglandines', 'hypertrophie'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // BAIN FROID ET HYPERTROPHIE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'recovery_005',
    topic: 'recovery',
    subtopics: ['bain froid', 'CWI', 'hypertrophie', 'récupération'],
    finding: 'L\'immersion en eau froide après l\'entraînement de force bloque l\'hypertrophie, particulièrement avec une utilisation chronique. À éviter après les séances de musculation.',
    detail: 'Méta-analyse Pinero 2024 (European Journal of Sport Science) : le bain froid post-effort atténue l\'hypertrophie induite par l\'entraînement de résistance. Mécanismes : réduction de l\'activation des cellules satellites, de la biogenèse ribosomale, de la signalisation mTOR, de la MPS. Les gains de force sont moins affectés que l\'hypertrophie. Impact est faible à occasion unique, plus prononcé en utilisation chronique.',
    source: 'Pinero et al. (2024) European Journal of Sport Science (PMC11235606) ; JAP (2019)',
    application: 'Éviter les bains froids après les séances de musculation orientées hypertrophie. Si récupération nécessaire : préférer repos passif, marche légère ou sauna. Bain froid réservé aux contextes sportifs compétitifs (entre deux matchs).',
    example: 'Ex : athlète faisant un bain de glace 10 min après chaque séance de force → bloque systématiquement la fenêtre anabolique post-exercice sur plusieurs semaines. Les performances progressent mais le muscle ne grossit pas autant.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['bain froid', 'CWI', 'glace', 'récupération', 'mTOR', 'hypertrophie'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // MORPHOLOGIE ET EXERCICES — LONGUEUR DES MEMBRES
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'morpho_001',
    topic: 'exercise',
    subtopics: ['morphologie', 'fémurs longs', 'bras longs', 'adaptations'],
    finding: 'La longueur des membres modifie fondamentalement les bras de levier et le recrutement musculaire sur les exercices composés, nécessitant des adaptations spécifiques plutôt que de simples corrections de technique.',
    detail: 'Fémurs longs → inclinaison excessive du buste au squat (mécaniquement inévitable) → le squat devient hip-dominant. Bras courts → ROM plus court au bench, plus d\'avantage mécanique. Bras longs → deadlift conventionnel favorisé (angle de dos plus vertical possible). Recherches PMC9944492 (2023) et PMC7039481 (2020) confirment que la longueur des membres prédit la performance relative sur les mouvements de force.',
    source: 'PMC9944492 (2023) ; PMC7039481 (2020) ; Journal of Applied Physiology (2024 — morphologie deadlifters élites)',
    application: 'Adapter l\'exercice à la morphologie, pas l\'inverse. Fémurs longs : privilégier hack squat, leg press, goblet squat surélevé sur les talons. Bras longs : bench avec prise plus large, deadlift conventionnel favorisé vs sumo.',
    example: 'Ex : utilisateur 1m90 avec longs fémurs qui squatte en prise standard → buste s\'incline à 45°, douleur lombaire. Solution : squat prise large + orteils à 30-45° + talons sur élévateur → squat redevient quad-dominant, douleur disparaît.',
    objectives: ['strength', 'hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['morphologie', 'fémurs longs', 'bras longs', 'adaptation exercice', 'bras de levier'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // MYO-REPS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'myoreps_001',
    topic: 'technique',
    subtopics: ['myo-reps', 'Borge Fagerli', 'reps efficaces', 'gain de temps'],
    finding: 'Les myo-reps produisent une hypertrophie équivalente aux séries traditionnelles en 50% moins de temps grâce à la maximisation des "reps efficaces" (reps proches de l\'échec avec toutes les UM rapides actives).',
    detail: 'Principe : une série d\'activation (15-30 reps près de l\'échec) recrute toutes les UM rapides. Les mini-séries (3-5 reps, 20-30s de repos) maintiennent ces UM actives au bord de la fatigue. Enes 2021 + Prestes 2019 : rest-pause (mécanisme identique) = hypertrophie similaire aux séries traditionnelles. Avantage temps : ~50% moins de durée pour un stimulus équivalent.',
    source: 'Borge Fagerli — Myo-reps methodology (2006-2024) ; Enes et al. (2021) ; Prestes et al. (2019)',
    application: 'Idéal pour les exercices d\'isolation/accessoires (élévations, curls, pushdowns, leg curls) où l\'accumulation de fatigue locale est sûre. À éviter sur les composés complexes (squat, DL, OHP) où la fatigue dégrade la technique.',
    example: 'Ex : au lieu de 4×12 élévations latérales (48 reps, 6 min avec repos), faire myo-reps : activation 25 reps → repos 20s → 5 reps → repos 20s → 5 → 20s → 5 → 20s → 4. Total : 44 reps en <3 min. Stimulus similaire.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['myo-reps', 'reps efficaces', 'rest-pause', 'gain de temps', 'Fagerli'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // AMRAP — AUTO-RÉGULATION
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'amrap_001',
    topic: 'technique',
    subtopics: ['AMRAP', 'auto-régulation', 'surcharge progressive'],
    finding: 'Les séries AMRAP (As Many Reps As Possible) placées sur la dernière série permettent une auto-régulation précise : elles révèlent la forme réelle du jour et calibrent automatiquement la progression de charge.',
    detail: 'Méta-analyse PMC7994759 2021 : l\'entraînement auto-régulé produit des gains de force similaires ou supérieurs vs pourcentages fixes avec une meilleure gestion de la fatigue. Helms et al. : la sélection de charge par RPE/RIR = %1RM fixe pour la force et l\'hypertrophie. Si l\'AMRAP donne plus de reps que prévu → la charge était trop légère → augmenter. Si moins → charge trop lourde ou fatigue élevée.',
    source: 'PMC7994759 (2021) ; Helms et al. — RIR research ; JSCR (2021)',
    application: 'Dernière série AMRAP sur les composés principaux. Si AMRAP > cible + 3 reps → augmenter la charge la prochaine séance. Si ± 2 reps de la cible → maintenir. Si < cible - 1 → signaler comme fatigue potentielle.',
    example: 'Ex : programme : 5×5 squat à 100kg, dernière série AMRAP. L\'athlète fait 10 reps → charge sous-estimée → 102.5kg la semaine prochaine. S\'il fait 6 reps → bon calibrage. S\'il en fait 4 → possiblement fatigué ou charge trop élevée.',
    objectives: ['strength', 'hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['AMRAP', 'auto-régulation', 'RPE', 'RIR', 'progression', 'calibration'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ENTRAÎNEMENT EXCENTRIQUE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'eccentric_001',
    topic: 'technique',
    subtopics: ['excentrique', 'surcharge excentrique', 'hypertrophie'],
    finding: 'La surcharge excentrique (descente plus lente ou charges supramaximales en négatif) produit plus de dommages musculaires et d\'hypertrophie que l\'entraînement concentrique seul, avec un meilleur retour sur investissement pour les adaptations tendineuses.',
    detail: 'Frontiers in Physiology 2023 : surcharge excentrique submaximale → +2.5% masse cuisses vs +4.2% avec charges supramaximales. Les adaptations neurales de la phase excentrique (RFD, rigidité tendineuse) sont souvent supérieures. En pratique, le tempo excentrique lent (3-4s) est l\'implémentation la plus accessible sans équipement spécialisé.',
    source: 'Frontiers in Physiology (2023) — fphys.2023.1176835 ; PLOS ONE (2024) ; Journal of Sport Sciences (2025)',
    application: 'Prescrire 3-4 secondes de descente sur les composés et isolations clés. Pour utilisateurs avancés : techniques "accentuated eccentric" (bandes élastiques sur la descente, poids supplémentaire retiré en bas).',
    example: 'Ex : curl haltères avec tempo 4-0-1-0 (4 sec descente, 0 pause bas, 1 sec montée, 0 pause haut). La descente en 4 secondes augmente le temps sous tension excentrique de 300% vs une descente normale en 1 sec. Brûlure musculaire nettement supérieure.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['excentrique', 'surcharge excentrique', 'tempo', 'négatifs', 'dommage musculaire'],
  },

  {
    id: 'eccentric_002',
    topic: 'technique',
    subtopics: ['excentrique lent', 'concentrique explosif', 'titine', 'tempo', 'unités motrices'],
    finding: 'La logique d\'unités motrices s\'inverse entre concentrique et excentrique : plus vite en concentrique recrute plus de fibres rapides (favorable), plus vite en excentrique réduit le stimulus (défavorable). Le tempo optimal est donc asymétrique : concentrique rapide/explosif + excentrique lent 3–4s.',
    detail: 'CONCENTRIQUE : vitesse élevée = plus de recrutement des unités motrices rapides (type II) par rate coding. C\'est pourquoi l\'intention explosive en concentrique (même avec une charge lourde) maximise le signal neuromusculaire — c\'est la base de l\'entraînement de puissance (Behm & Sale 1993). EXCENTRIQUE : mécanisme différent — la titine (3ème filament du sarcomère) et les éléments élastiques passifs contribuent à la tension, ce qui permet de produire une force élevée avec moins d\'unités motrices actives. La descente lente (3–4s) n\'est donc PAS pour compenser un manque de recrutement — elle maximise : 1) le temps en position étirée sous charge (stimulus hypertrophique principal selon Pedrosa 2022), 2) le chargement progressif de la titine (déclenche la sarcomerogenèse — ajout de sarcomères en série), 3) des dommages musculaires calibrés (signal d\'adaptation, vs dommages aléatoires d\'une descente non contrôlée). La sécurité est un bénéfice secondaire, pas la raison principale du 3–4s.',
    source: 'Behm & Sale (1993) — intent to accelerate and motor unit recruitment ; Pedrosa et al. (2022) — stretch position hypertrophy ; Herzog et al. (2016) — titin and eccentric force ; Roig et al. (2009) — eccentric vs concentric hypertrophy meta-analysis',
    application: 'Tempo optimal pour l\'hypertrophie : excentrique 3–4s (lent, contrôlé, maximise TUT en étirement + titine) + concentrique aussi rapide que possible (intent to accelerate, maximise recrutement fibres rapides). Notation tempo : 3-0-X-0 ou 4-0-1-0 (excentrique-pause bas-concentrique-pause haut). Ne pas prescrire un concentrique lent pour l\'hypertrophie — c\'est contre-productif neurologiquement.',
    example: 'Ex : curl incliné — descendre en 4 secondes (biceps maximalement étiré sous charge, titine chargée progressivement) → 0s de pause en bas → remonter aussi vite que possible (intent explosif même si le mouvement est lent à cause du poids). C\'est très différent d\'un mouvement "lent des deux côtés" — seul l\'excentrique est lent.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['tempo', 'excentrique lent', 'concentrique explosif', 'titine', 'unités motrices', 'recrutement', 'vitesse'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ISOMÉTRIQUE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'isometric_001',
    topic: 'technique',
    subtopics: ['isométrique', 'tendinopathie', 'point bloquant'],
    finding: 'L\'entraînement isométrique est efficace dans deux contextes spécifiques : la gestion de la douleur tendineuse (analgésie immédiate) et l\'amélioration de la force à un angle de blocage spécifique.',
    detail: 'Rio et al. 2015 : 5×45s isométrique à 70% MVC → réduction douleur tendineuse rotulienne de 44% immédiatement, durable 45 min. Les isométriques en position étirée (longueur musculaire maximale) produisent une hypertrophie comparable au travail dynamique complet. Spécificité angulaire : les gains de force se transfèrent uniquement à ±15° de l\'angle entraîné.',
    source: 'Rio et al. (2015) PubMed 25979840 ; PMC10001567 (2023) ; Applied Physiology Nutrition Metabolism (2025)',
    application: 'Tendinopathie : 5×45s à 70% MVC avant les séances pour gérer la douleur. Point bloquant (ex: bas du squat) : pause isométrique de 2-3s à l\'angle problématique pour renforcer spécifiquement. Manque de matériel : isométrique en position étirée comme substitut.',
    example: 'Ex : utilisateur avec douleur au tendon rotulien → wall sit à 70° de flexion genou, 5×45s, 2 min repos, avant chaque séance squats. Douleur réduite de ~44% permettant d\'entraîner avec une meilleure qualité.',
    objectives: ['strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['isométrique', 'tendinopathie', 'douleur', 'point bloquant', 'wall sit'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // DOMMAGES MUSCULAIRES — RÉVISION
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'damage_001',
    topic: 'adaptation',
    subtopics: ['dommages musculaires', 'DOMS', 'hypertrophie', 'révision'],
    finding: 'Les dommages musculaires (DOMS, micro-déchirures) ne sont PAS nécessaires à l\'hypertrophie. La tension mécanique est le stimulus principal. Les dommages excessifs réduisent le volume total réalisable et peuvent être contre-productifs.',
    detail: 'Révision Schoenfeld 2022-2024 : l\'hypertrophie se produit en quasi-absence de dommages (entraînement concentrique seul). Refalo 2022 (PubMed 36334240) : entraînement à l\'échec vs proche de l\'échec → avantage trivial pour l\'hypertrophie, et l\'échec maximise les dommages. Les dommages excessifs : réduisent la qualité des séries suivantes, augmentent la fatigue systémique, et ne génèrent pas de stimulus anabolique supplémentaire significatif.',
    source: 'Refalo/Schoenfeld (2022) PubMed 36334240 ; AJP-Cell Physiology (2024) ; Stronger by Science (2023-2024)',
    application: 'Ne pas chercher les courbatures comme objectif. Ne pas introduire de nouveauté excessive juste pour créer des DOMS. La surcharge progressive mécanique (plus de charge ou volume à même RIR) est le vrai signal.',
    example: 'Ex : message coaching à éviter : "si tu n\'as pas de courbatures, tu n\'as pas bien travaillé". Message correct : "si ta charge ou ton volume a augmenté à RIR équivalent, tu as progressé — les courbatures sont un effet secondaire de la nouveauté, pas un indicateur de croissance."',
    objectives: ['hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['dommages musculaires', 'DOMS', 'courbatures', 'tension mécanique', 'hypertrophie'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // RÉPARTITION DU VOLUME SUR LA SEMAINE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'distribution_001',
    topic: 'volume',
    subtopics: ['répartition volume', 'par séance', 'distribution hebdomadaire'],
    finding: 'Le volume total hebdomadaire est le principal déterminant de l\'hypertrophie. La répartition entre les séances importe peu, MAIS les séries par séance ont des rendements décroissants après 8-12 séries directes par muscle.',
    detail: 'PMC9302196 2022 + Frontiers in Physiology 2021 (volume équivalent fréquences différentes) : aucune différence d\'hypertrophie entre 2× et 3×/sem à volume égal. La limite pratique par séance : ~10-12 séries directes par muscle au-delà desquelles le retour décroît. 20 séries/sem → mieux en 2×10 ou 4×5 qu\'en 1×20.',
    source: 'PMC9302196 (2022) ; Frontiers in Physiology (2021) ; SportRxiv dose-response méta-régression (2024-2025)',
    application: 'Plafonner à 8-12 séries directes par muscle par séance. Répartir le volume restant sur des séances supplémentaires. Pas d\'avantage prouvé à front-loader ou back-loader la semaine — la récupération (48h min) et le volume total sont les variables clés.',
    example: 'Ex : 16 séries pectoraux/sem → Lundi 8 séries (bench 4, incliné 2, écarté 2), Jeudi 8 séries (même structure). Pas Lundi 16 séries, rien le reste de la semaine. La distribution 2×8 = 1×16 en hypertrophie mais avec moins de fatigue aiguë.',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['répartition volume', 'distribution', 'séances', 'semaine', 'diminishing returns'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ZONE BLESSÉE — CROSS-ÉDUCATION
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'injury_001',
    topic: 'injury',
    subtopics: ['cross-éducation', 'blessure', 'membre controlateral', 'rééducation'],
    finding: 'La cross-éducation — entraîner le membre sain — réduit la perte de force et de masse du membre blessé/immobilisé de 25-50% grâce à un transfert neural bilatéral.',
    detail: 'PMC12638512 (Sports Medicine Open 2025) + méta-analyses : entraîner le côté sain modifie les voies motrices descendantes bilatéralement, réduisant l\'atrophie du côté non entraîné. PMC12032444 (2025) : cross-éducation atténue la perte d\'épaisseur musculaire et de force du membre immobilisé. Springer RCT 2026 (LCA) : récupération neuromusculaire plus rapide du côté opéré grâce à l\'entraînement controlateral.',
    source: 'PMC12638512 (2025) Sports Medicine Open ; PMC12032444 (2025) ; Springer RCT (2026)',
    application: 'Quand une zone est blessée : 1) Entraîner le côté sain en unilatéral lourd pour préserver le côté blessé via cross-éducation. 2) Ajouter des isométriques sur le côté blessé à l\'angle indolore. 3) Tout le reste du corps continue normalement.',
    example: 'Ex : genou droit blessé → presse jambe gauche lourde (unilatéral), leg curl gauche, split squat gauche → préserve 25-50% de la force du genou droit. + wall sit droit à angle indolore (30° flexion) pour progression locale.',
    objectives: ['strength', 'hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['cross-éducation', 'blessure', 'unilatéral', 'controlateral', 'immobilisation', 'rééducation'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SEUIL DE LEUCINE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'nut_007',
    topic: 'nutrition',
    subtopics: ['leucine', 'seuil', 'MPS', 'par repas'],
    finding: 'Il existe un seuil minimal de leucine par repas pour déclencher maximalement la MPS : ~2-2.5g pour les jeunes adultes, ~3-3.5g pour les 60+.',
    detail: 'Wilkinson 2023 (Physiological Reports) : la dose de leucine corrèle positivement avec la MPS chez les seniors mais atteint son plafond facilement chez les jeunes. La leucine agit comme signal direct déclenchant la voie mTORC1. Sources riches en leucine : whey (~10-11% leucine), viandes (~8%), protéines végétales (6-7%) → les végétaliens ont besoin de portions plus importantes ou d\'une supplémentation en leucine.',
    source: 'Wilkinson et al. (2023) Physiological Reports ; Frontiers in Nutrition (2021)',
    application: 'Pour les 55+ : viser 35-45g de protéines par repas (source animale) ou supplémenter 1-2g de leucine si source végétale. Whey est la source la plus efficace pour déclencher la MPS par gramme de protéine.',
    example: 'Ex : végétalien de 65 ans consommant 25g de protéines de riz/repas → ~1.75g de leucine → sous le seuil de 3.5g requis pour son âge. Solution : ajouter 2g de leucine en poudre ou augmenter à 40g de protéines végétales.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['leucine', 'seuil', 'MPS', 'protéines', 'whey', 'mTOR', 'seniors'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // HYDRATATION ET PERFORMANCE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'hydration_001',
    topic: 'recovery',
    subtopics: ['hydratation', 'déshydratation', 'force', 'performance'],
    finding: 'Une déshydratation de seulement 2% de la masse corporelle réduit significativement la performance en force. À 4-5%, la dégradation est substantielle.',
    detail: 'Judelson 2007 (JSCR) — squat 6 séries : à 2.4% de déshydratation, performance réduite dès la série 2-3. À 4.8% : séries 2-5 dégradées. Méta-analyse Goulet 2012 (Sports Medicine) : déshydratation → force -2%, puissance -3%, endurance haute intensité -10%. Mécanisme : réduction du volume plasmatique, SNC moins efficace, flux sanguin musculaire réduit.',
    source: 'Judelson et al. (2007) JSCR ; Goulet (2012) Sports Medicine',
    application: '500ml dans les 60 min avant la séance. 150-250ml toutes les 15-20 min pendant. Réhydratation post-séance : 1.5× le fluide perdu. Les entraînements matinaux à jeun ou en environnement chaud = risque de déshydratation au départ.',
    example: 'Ex : athlète de 75kg qui s\'entraîne 60 min sans boire perd ~1.8kg de fluide (2.4% masse) → performance dégradée sur les 3-4 dernières séries. Simple : boire régulièrement pendant la séance.',
    objectives: ['strength', 'hypertrophy', 'endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['hydratation', 'déshydratation', 'force', 'performance', 'eau'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // RYTHME CIRCADIEN ET ENTRAÎNEMENT
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'circadian_001',
    topic: 'recovery',
    subtopics: ['rythme circadien', 'heure entraînement', 'matin vs soir'],
    finding: 'La force et la puissance culminent en fin d\'après-midi/début de soirée (16h-20h). L\'entraînement matinal produit la même hypertrophie à volume égal, mais nécessite un échauffement plus long.',
    detail: 'Frontiers in Neuroscience 2025 + Grgic 2019 (méta-analyse) : pic de performance en force à 16h-20h (température corporelle, ratio testostérone/cortisol, vitesse de conduction neurale optimaux). mTORC1 plus réactif à l\'exercice en fin de journée active. Sur 8-12 semaines à volume égal : hypertrophie identique matin vs soir. Chronotype modérateur : les "couche-tard" subissent plus du matin que les "lève-tôt".',
    source: 'Frontiers in Neuroscience (2025) ; Grgic et al. (2019) méta-analyse chronobiologie et entraînement',
    application: 'Objectif force (compétition, test 1RM) : privilégier l\'après-midi. Objectif hypertrophie : la constance prime sur le timing. Entraînement matinal : échauffement 10 min (vs 5), utiliser la caféine pour compenser la baisse de vigilance.',
    example: 'Ex : powerlifter qui teste son 1RM le matin → peut déplacer 5-8% moins de charge que s\'il testait à 17h. Pour un test compétitif, simuler l\'heure de compétition pendant l\'entraînement pour adapter le pic de performance.',
    objectives: ['strength', 'hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['rythme circadien', 'heure entraînement', 'matin', 'soir', 'performance', 'chronotype'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CORTISOL ET ADAPTATION
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'cortisol_001',
    topic: 'recovery',
    subtopics: ['cortisol', 'stress', 'adaptation', 'anabolisme'],
    finding: 'Le cortisol chroniquement élevé (stress de vie + mauvais sommeil + déficit + surentraînement cumulés) bloque directement la MPS et favorise la dégradation musculaire.',
    detail: 'Le cortisol aigu à l\'exercice est normal et transitoire. Le problème : l\'empilement de stresseurs (stress psychologique + manque de sommeil + déficit calorique + surentraînement) maintient le cortisol élevé chroniquement → activation de la voie ubiquitine-protéasome (dégradation musculaire), réduction de la sensibilité aux récepteurs androgènes, suppression de l\'IGF-1. Revue Endocrinology 2024 : cortisol de repos chroniquement élevé + testostérone basse = signature du surentraînement.',
    source: 'Endocrinology review (2024 — surentraînement et SHH) ; Sports network meta-analysis (2024)',
    application: 'Quand stress de vie élevé → réduire le volume de 20-30% temporairement. Surveiller les signaux : performances plates, moral bas, sommeil perturbé, récupération lente. La réduction temporaire protège les gains mieux que de "pousser à travers".',
    example: 'Ex : utilisateur en période d\'examen/travail intense + 5h de sommeil + déficit calorique + 5 séances/sem → empilage de stresseurs → cortisol chronique → gains arrêtés voire régressifs. Prescription : 3 séances/sem, déficit réduit à 200 kcal, cibler 7h de sommeil.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['cortisol', 'stress', 'surentraînement', 'anabolisme', 'dégradation musculaire'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // QUALITÉ VS QUANTITÉ DE SOMMEIL
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'sleep_002',
    topic: 'recovery',
    subtopics: ['qualité sommeil', 'architecture sommeil', 'GH', 'MPS'],
    finding: 'La qualité du sommeil (architecture : sommeil profond + REM) est aussi importante que la quantité. Un sommeil fragmenté de 8h peut être moins récupérateur qu\'un sommeil consolidé de 6.5h.',
    detail: 'BMC Public Health 2023 : baisse de la masse musculaire avec dégradation de la qualité même si la durée est maintenue. La GH est sécrétée à 80% en sommeil profond (onde lente) — un sommeil fragmenté bloque les pulses de GH même avec 8h au lit. Scientific Reports 2023 : masse musculaire et force grip inférieures chez les mauvais dormeurs indépendamment de la durée. Une seule mauvaise nuit → réduction MPS de ~18%.',
    source: 'BMC Public Health (2023) ; Scientific Reports (2023) ; Nedeltcheva 2010',
    application: 'Sommeil = variable d\'entraînement. Adresser la qualité du sommeil en priorité : no alcool 3h avant coucher, pas d\'écran 60 min avant, heure de réveil constante. 6.5h de sommeil profond ininterrompu > 8h fragmentées pour la GH et la MPS.',
    example: 'Ex : utilisateur dormant 8h mais se réveillant 3-4 fois par nuit (alcool, téléphone, apnée légère) → GH quasi nulle, MPS réduite. Fix : supprimer l\'alcool le soir, mode "ne pas déranger" → amélioration des gains sans aucun changement du programme.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['sommeil', 'qualité', 'architecture', 'GH', 'sommeil profond', 'MPS'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CRÉATINE — PAS D'ALTERNATIVE SUPÉRIEURE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'nut_008',
    topic: 'nutrition',
    subtopics: ['créatine', 'formes', 'monohydrate', 'HCl'],
    finding: 'Aucune forme alternative de créatine (HCl, buffered/Kre-Alkalyn, ester éthylique) n\'a démontré une supériorité sur le monohydrate pour la charge musculaire, la force ou l\'hypertrophie.',
    detail: 'Essai randomisé PMC 2025 : créatine HCl vs monohydrate chez athlètes de sports collectifs élites → aucune différence pour la force, la composition corporelle ou les biomarqueurs hormonaux. PMC 2024 : mêmes résultats. Jagim et al. : Kre-Alkalyn ne produit pas plus de créatine musculaire que le monohydrate. Coût HCl : 2-5× plus élevé pour des résultats identiques. Le monohydrate a 30+ ans de données de sécurité.',
    source: 'PMC (2025) HCl vs monohydrate athlètes élites ; PMC (2024) hormones et force ; Jagim — Kre-Alkalyn',
    application: 'Recommander exclusivement le monohydrate (3-5g/jour). HCl acceptable pour les rares cas de problèmes GI avec monohydrate. Ne jamais recommander les formes "premium" sur la base du marketing.',
    example: 'Ex : utilisateur qui paie 60€/mois pour de la créatine HCl "ultra-absorbable" → passer à du monohydrate basique à 15€/mois (5g/jour) → résultats identiques, économie de 45€/mois.',
    objectives: ['strength', 'hypertrophy'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['créatine', 'monohydrate', 'HCl', 'Kre-Alkalyn', 'supplément', 'formes'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // BÊTA-ALANINE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'nut_009',
    topic: 'nutrition',
    subtopics: ['bêta-alanine', 'carnosine', 'endurance musculaire', 'tampon'],
    finding: 'La bêta-alanine améliore modestement la performance sur les efforts à haute intensité de 60-240 secondes (endurance musculaire, hautes reps) via le tamponnage de l\'acidose. Impact minimal sur la force maximale (1RM).',
    detail: 'Méta-analyse IJSNEM 2024 : améliorations significatives de la puissance explosive répétée et de la performance à intensité maximale chez des hommes entraînés. Journal ISSN 2025 : doses cumulées ≥200g (3.2-6.4g/jour pendant 30-50 jours) améliorent davantage la force isométrique et l\'endurance. Effet secondaire : paresthésie (picotements) — inoffensif, mitigé par doses fractionnées de 0.8g.',
    source: 'IJSNEM (2024) méta-analyse bêta-alanine ; Journal ISSN (2025) dosages',
    application: 'Pertinent pour les utilisateurs faisant du travail métabolique élevé (15-25 reps, circuits, repos courts). Inutile pour la force pure (1-6 reps). Protocole : 3.2-6.4g/jour en doses fractionnées, minimum 4 semaines de chargement.',
    example: 'Ex : utilisateur faisant des supersets quadriceps (presse 15 reps + leg extension 15 reps, 30s repos) → contexte très glycolytique → bêta-alanine pertinente. Un powerlifter faisant uniquement du 3-5 reps → bêta-alanine sans intérêt réel.',
    objectives: ['endurance', 'hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['bêta-alanine', 'carnosine', 'acidose', 'lactate', 'endurance musculaire'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // FOAM ROLLING
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'recovery_006',
    topic: 'recovery',
    subtopics: ['foam rolling', 'rouleau', 'mobilité', 'récupération'],
    finding: 'Le foam rolling améliore l\'amplitude articulaire et réduit la perception des DOMS. Son impact sur la force et la puissance aiguës est minimal.',
    detail: 'Méta-analyse PMC 2025 : foam rolling améliore la mobilité, réduit les douleurs musculaires, peut soutenir la récupération d\'agilité. Aucun bénéfice consistant sur la force ou la hauteur de saut (RCT PMC 2025). Post-séance : réduit la douleur subjective et la fatigue perçue → retour plus rapide à l\'entraînement. Mécanisme : amélioration de la circulation, réduction de la sensibilité neurale. La pression standard des rouleaux est insuffisante pour modifier structurellement les fascias.',
    source: 'PMC (2025) méta-analyse foam rolling performance ; PMC (2025) RCT CrossFit récupération',
    application: 'Pre-workout : 30-60s par muscle pour l\'amplitude, suivi d\'un échauffement dynamique. Post-workout : 5-10 min sur les muscles travaillés pour réduire les DOMS du lendemain. Ne pas remplacer l\'échauffement progressif par du foam rolling seul.',
    example: 'Ex : utilisateur avec ischio-jambiers tendus avant squat → 60s de foam rolling ischio, puis fentes dynamiques → amplitude nettement améliorée pendant ~10 min. Post-séance : 5 min de rouleau sur quads/ischio → lendemain moins de courbatures.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['foam rolling', 'rouleau', 'mobilité', 'DOMS', 'amplitude', 'récupération'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÉTIREMENTS STATIQUES ET HYPERTROPHIE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'stretch_002',
    topic: 'technique',
    subtopics: ['étirements statiques', 'hypertrophie', 'amplitude'],
    finding: 'L\'étirement statique chronique à haute dose (≥15 min/session, ≥5×/sem, ≥6 semaines) peut produire une hypertrophie mesurable. Les étirements inter-séries courts (30-60s) n\'ont pas d\'effet hypertrophique mais peuvent améliorer la performance de la série suivante.',
    detail: 'Méta-analyse Sports Medicine Open 2024 : étirements statiques → hypertrophie, plus prononcée avec durées élevées et fréquences élevées. L\'étirement "chargé" (sous tension significative) est la forme efficace. Springer 2024 : étirements statiques haute durée au niveau des mollets = force et hypertrophie comparables à l\'entraînement en résistance pour ce groupe musculaire. Étirements inter-séries antagoniste (30s) : réduction de l\'inhibition réciproque → potentiellement +2-5% sur la série suivante.',
    source: 'Sports Medicine Open Springer (2024) méta-analyse étirements et hypertrophie ; Springer (2024)',
    application: 'Étirements inter-séries : étirer l\'antagoniste (biceps entre les séries de triceps, hip flexors entre les séries de squats) pour réduire l\'inhibition et potentiellement améliorer la performance. Pour hypertrophie via étirement : nécessite volume et durée importants (usage thérapeutique/spécifique).',
    example: 'Ex : entre les séries de curl biceps, étirer les triceps 20-30 sec → réduction de l\'inhibition réciproque → potentiellement 1-2 reps de plus sur la série suivante. Faible coût, bénéfice positif. Pas d\'étirement statique long pre-workout sur les muscles à travailler (peut réduire la force transitoirement).',
    objectives: ['hypertrophy'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['étirements', 'statiques', 'hypertrophie', 'amplitude', 'inter-séries', 'antagoniste'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // RED-S — DÉFICIT ÉNERGÉTIQUE RELATIF
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'health_002',
    topic: 'nutrition',
    subtopics: ['RED-S', 'déficit énergétique', 'disponibilité énergétique', 'hormones'],
    finding: 'Le RED-S (Relative Energy Deficiency in Sport) — disponibilité énergétique <30 kcal/kg de masse maigre/jour — supprime directement la MPS, bloque les adaptations à l\'entraînement et affecte tous les systèmes corporels.',
    detail: 'Déclaration de consensus IOC 2023 (Mountjoy et al., BJSM) : >170 nouvelles études depuis 2018. Touche hommes ET femmes. Seuil critique : <30 kcal/kg FFM/jour (optimal : ≥45). Effets : suppression hormonale (hypogonadisme, testostérone ↓), réduction MPS, blessures osseuses, GI, immunité, psychologique. Signes : performances stagnantes malgré l\'entraînement, blessures répétées, fatigue chronique.',
    source: 'Mountjoy et al. (2023) IOC Consensus Statement — BJSM ; Endocrine Reviews (2024)',
    application: 'Signaler le RED-S quand : grand déficit calorique + volume élevé simultanément. Plancher énergétique pour la musculation : ≥30-35 kcal/kg FFM/jour minimum. Augmenter l\'apport calorique avant d\'augmenter les protéines si le bilan énergétique est négatif.',
    example: 'Ex : 70kg utilisateur (55kg FFM) mangeant 1500 kcal/jour en s\'entraînant 5×/sem → disponibilité énergétique négative (−9 kcal/kg FFM/jour) → RED-S. Solution : augmenter à 2300+ kcal avant d\'optimiser les macros. La MPS ne peut pas être sauvée par les protéines seules en déficit aussi profond.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['RED-S', 'déficit énergétique', 'disponibilité énergétique', 'hormones', 'coupe', 'MPS'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // RIR — PRÉCISION PAR NIVEAU & CIBLES PAR PHASE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'rir_accuracy_001',
    topic: 'intensity',
    subtopics: ['RIR', 'précision', 'débutant', 'biais d\'estimation'],
    finding: 'Les débutants surestiment significativement leur RIR — ils pensent avoir 3 reps en réserve mais en ont souvent 0-1. Ce biais diminue avec l\'expérience.',
    detail: 'Zourdos et al. 2016 et Helms et al. 2017 montrent que la précision de l\'estimation du RIR augmente avec l\'expérience. Les débutants surestiment systématiquement de +1 à +2 RIR. Un débutant qui rapporte RIR 3 travaille probablement à RIR 1-2. Les intermédiaires ont une marge d\'erreur de ±1 RIR. Les avancés sont précis à ±0.5 RIR. Implication majeure : les systèmes de progression basés sur le RIR doivent tenir compte de ce biais — les débutants progressent même avec un RIR perçu élevé car leur RIR réel est plus bas.',
    source: 'Zourdos et al. (2016) J Strength Cond Res — RIR-based scale validation ; Helms et al. (2017) — RPE accuracy trained vs untrained',
    application: 'Pour les débutants : ne pas sur-corriger si le RIR perçu est élevé — ils travaillent probablement plus près de l\'échec qu\'ils ne le pensent. Pour les avancés : se fier au RIR perçu. Surveiller le RIR drift comme signal de fatigue uniquement chez les intermédiaires+.',
    example: 'Ex : débutant qui dit "RIR 3" sur ses squats mais s\'arrête à 10 reps — si on lui demandait de continuer, il ferait peut-être 11-12 maximum (RIR réel = 1-2). Sa progression est valide même si le RIR perçu semble confortable.',
    objectives: ['hypertrophy', 'strength', 'endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['RIR', 'précision', 'débutant', 'estimation', 'RPE', 'biais', 'surestimation'],
  },
  {
    id: 'rir_phase_001',
    topic: 'periodization',
    subtopics: ['RIR cible', 'phase MEV MAV MRV', 'progression RIR'],
    finding: 'Les cibles RIR doivent diminuer progressivement au fil du mésocycle (RIR 3 en MEV → RIR 1 en MRV) pour maintenir une surcharge progressive à volume croissant.',
    detail: 'En phase MEV (accumulation), un RIR conservateur (2-3) permet de construire la capacité de travail sans excéder la récupération. En MAV (volume optimal), RIR 1-2 maximise le stimulus. En MRV (charge maximale), RIR 0-1 est nécessaire pour continuer à progresser malgré la fatigue accumulée. Cette progression intra-mésocycle assure que le stimulus augmente même quand la charge ne peut plus augmenter — la réduction du RIR EST la surcharge progressive à stade avancé.',
    source: 'Israetel — RP Strength (2019-2024) ; Schoenfeld 2010 (proximity to failure) ; Helms et al. (2017)',
    application: 'Programmer RIR 3 en semaines 1-2, RIR 2 en semaines 3-5, RIR 1 en semaines 6-7. Bloc A (composés) : +1 RIR de sécurité. Bloc C (isolation) : -1 RIR (peut aller plus près de l\'échec).',
    example: 'Ex : développé couché, semaine 1 (MEV) → 100kg × 8 reps à RIR 3 (aurait pu faire 11). Semaine 6 (MRV) → 100kg × 8 reps à RIR 1 (aurait pu faire 9-10). La charge est la même mais l\'intensité relative a augmenté via le RIR — c\'est la surcharge progressive.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['RIR cible', 'MEV', 'MAV', 'MRV', 'phase', 'surcharge progressive', 'proximité échec'],
  },
  {
    id: 'rir_rest_001',
    topic: 'rest_times',
    subtopics: ['repos adapté', 'RIR réalisé', 'PCr resynthèse', 'ajustement repos'],
    finding: 'Le repos optimal après une série doit être ajusté selon le RIR réalisé : atteindre l\'échec (RIR 0) nécessite +30s de récupération, travailler à RIR 3+ permet de réduire le repos de 15s.',
    detail: 'La resynthèse de la créatine phosphate (PCr) est le facteur limitant du repos entre séries de haute intensité. À l\'échec musculaire (RIR 0), la déplétion PCr est maximale — 3 min sont nécessaires pour une restauration à ~97%. À RIR 2-3, la déplétion est partielle — 2 min suffisent. La modulation du repos selon le RIR réalisé optimise le rapport qualité/densité de la séance : ni trop long (perte de temps), ni trop court (dégradation de la performance).',
    source: 'Ahtiainen et al. (2005) — PCr kinetics post-exercise ; Computeadaptedresttime methodology from RIR-based programming',
    application: 'Bloc A composés : repos minimum 120s même à RIR confortable. Si RIR 0 atteint : +30s. Si RIR 3+ : −15s mais jamais sous 120s. Bloc C isolation : 45-120s ajusté selon RIR réalisé.',
    example: 'Ex : série de curl → prévu RIR 2 mais réalisé RIR 0 (échec) → augmenter le repos de 90s → 120s avant la série suivante. Série suivante → RIR 3 (trop léger) → réduire repos de 90s → 75s.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['repos adapté', 'RIR réalisé', 'PCr', 'ajustement', 'récupération', 'échec'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // COMPOSÉS VS ISOLATION — SÉCURITÉ ET RÔLE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'compound_isolation_001',
    topic: 'exercise',
    subtopics: ['composés', 'isolation', 'échec', 'sécurité', 'bloc A B C'],
    finding: 'L\'entraînement à l\'échec sur les exercices composés lourds (squat, deadlift, bench barre, OHP barre) est dangereux car la défaillance technique en position de charge maximale expose aux blessures graves. Sur les isolations monoarticulaires, l\'échec est sécurisé et bénéfique.',
    detail: 'Sur un composé polyarticulaire lourd, l\'échec musculaire crée une rupture de la chaîne cinétique : si le triceps lâche au bench, la barre tombe sur la poitrine. Si le dos fléchit au deadlift, compression discale. Si les quadriceps cèdent au squat, effondrement sous charge. En isolation (curl haltères, pushdown), la défaillance = poser le poids proprement. La distinction bloc A (composés = jamais à l\'échec) / bloc C (isolation = échec OK) est donc une règle de sécurité, pas seulement d\'efficacité.',
    source: 'Schoenfeld & Grgic (2019) — failure training safety ; Kraemer & Ratamess (2004) — safety guidelines heavy loading',
    application: 'Bloc A (composés lourds) : toujours arrêter à RIR 1 minimum — jamais à l\'échec. Bloc B (accessoires) : échec sur dernière série uniquement. Bloc C (isolation, machines, câbles) : échec autorisé, pas de risque de blessure grave.',
    example: 'Ex : 4 séries de squat barre → s\'arrêter toujours avec 1 rep en réserve. Puis 3 séries de leg press → dernière série jusqu\'à l\'échec musculaire. Puis leg extension → toutes les séries peuvent aller à l\'échec. La sécurité diminue avec la charge et le nombre d\'articulations impliquées.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['composés', 'isolation', 'échec', 'sécurité', 'bloc A', 'bloc C', 'blessure'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // FATIGUE SNC VS FATIGUE MÉTABOLIQUE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'fatigue_types_001',
    topic: 'recovery',
    subtopics: ['fatigue SNC', 'fatigue métabolique', 'récupération', 'CNS'],
    finding: 'La fatigue SNC (système nerveux central) et la fatigue métabolique (musculaire) ont des cinétiques de récupération différentes et répondent à des stratégies différentes.',
    detail: 'Fatigue SNC : déplétion des neurotransmetteurs, inhibition descendante, altération du recrutement des UM rapides. Se produit principalement après les charges >80% 1RM, les entraînements très longs ou très intenses. Récupération : 72-96h minimum. Signaux : même charge perçue plus difficile (RIR drift), réflexes lents, motivation absente. Fatigue métabolique : déplétion des glycogènes, accumulation de lactate, inflammation locale. Récupération : 24-48h. Signaux : DOMS, sensation locale, força conservée mais inconfort. Un athlète peut avoir de la fatigue SNC sans DOMS (ex: beaucoup de triples lourds) et des DOMS sans fatigue SNC (ex: nouveauté d\'exercice à charge légère).',
    source: 'Meeusen et al. (2013) European Journal of Sport Science — overreaching et SNC ; Häkkinen (1989) — CNS fatigue markers ; Kreher & Schwartz (2012)',
    application: 'Si RIR drift sans douleur musculaire = fatigue SNC → réduire l\'intensité (pas forcément le volume). Si DOMS sans RIR drift = fatigue métabolique locale → repos du muscle concerné ou travail léger (repeated bout effect). Les deux ensemble = surmenage → décharge complète.',
    example: 'Ex : athlète qui squatte 100kg "lourd comme 115kg" mais n\'a pas de courbatures = fatigue SNC. Solution : semaine légère en intensité (70-75% 1RM), pas besoin de réduire le nombre de séries. Vs athlète avec courbatures intenses mais qui déplace bien ses charges = fatigue métabolique locale = repos ou travail léger.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['fatigue SNC', 'SNC', 'fatigue métabolique', 'CNS', 'récupération', 'DOMS', 'RIR drift'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SEUILS DE STAGNATION ET RÉGRESSION DE PERFORMANCE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'stagnation_thresholds_001',
    topic: 'progression',
    subtopics: ['stagnation', 'régression', 'seuils', 'plateau detection'],
    finding: 'Une amélioration de performance <2% sur 2+ semaines constitue une stagnation. Une baisse >5% du volume total (charge × reps) constitue une régression. Ces seuils distinguent la variabilité normale des vrais plateaux.',
    detail: 'La variabilité biologique normale des performances représente ±3-5% sur une même session selon le jour, le sommeil, la nutrition et le stress. Un signal de stagnation (<+2%) doit être observé sur plusieurs semaines pour être valide. La régression (>-5%) est plus sérieuse et nécessite une intervention plus rapide. Ces seuils sont cohérents avec les études de monitoring de charge (Gabbett 2016) qui utilisent des zones de tolérance similaires pour distinguer signal du bruit.',
    source: 'Gabbett (2016) — training load monitoring ; Israetel RP strength monitoring principles ; Sands et al. (2019) performance variability',
    application: 'Ne pas réagir à une seule mauvaise séance. Confirmer sur 2-3 semaines avant d\'intervenir. Régression sur 40%+ des exercices = signal systémique → décharge. Stagnation sur 50%+ des exercices → augmenter volume ou varier le stimulus.',
    example: 'Ex : curl barre 40kg×10 la semaine 1, 40kg×10 la semaine 3, 40kg×10 la semaine 5 = stagnation (+0% sur 4 sem). Action : ajouter 1 série ou changer pour curl incliné. Vs 40kg×10 → 38kg×9 la semaine suivante (-7% volume) = régression → chercher cause (fatigue, sous-récupération).',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['stagnation', 'régression', 'plateau', 'performance', 'seuils', 'monitoring'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // RÉPARTITION VOLUME PRIMAIRE/SECONDAIRE 60/40
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'volume_split_001',
    topic: 'volume',
    subtopics: ['primaire secondaire', 'répartition 60/40', 'objectif principal', 'hiérarchie'],
    finding: 'Allouer 60% du volume à l\'objectif primaire et 40% au secondaire est le ratio optimal pour progresser sur les deux sans compromettre le primaire — basé sur le principe de spécificité et la capacité de récupération totale.',
    detail: 'La recherche sur la périodisation montre que le stimulus primaire doit dominer pour des adaptations spécifiques (principe de spécificité). Un ratio 60/40 assure que l\'objectif principal reçoit assez de volume pour progresser (>MEV) tout en laissant de la capacité pour un objectif secondaire. Un ratio 70/30 ou plus écraserait trop l\'objectif secondaire. Un ratio 50/50 diluerait les deux. Le 60/40 est aussi cohérent avec les structures de programmes classiques : un programme PPL avec un jour de focus force + deux jours d\'hypertrophie correspond approximativement à ce ratio.',
    source: 'Israetel — RP Strength program design principles ; Bompa & Haff (2009) — prioritization in periodization ; NSCA periodization guidelines',
    application: 'Muscles de l\'objectif primaire : cibler le MAV de la phase. Muscles de l\'objectif secondaire : cibler le MEV. Si les deux objectifs partagent des muscles (ex: hypertrophie full body + force bench), les muscles overlap reçoivent le traitement primaire.',
    example: 'Ex : objectif primaire hypertrophie corps entier (60%) + secondaire force bench (40%). Les pectoraux, triceps, épaules (zones du bench) reçoivent 60% hypertrophie + focus force → ils bénéficient des deux. Les jambes reçoivent 60% hypertrophie sans force. Répartition équilibrée sans diluer le primaire.',
    objectives: ['hypertrophy', 'strength', 'endurance'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['primaire', 'secondaire', '60/40', 'répartition volume', 'objectif', 'hiérarchie'],
  },
  {
    id: 'secondary_volume_001',
    topic: 'volume',
    subtopics: ['muscles secondaires', '0.5x', 'stimulus indirect', 'composés'],
    finding: 'Les muscles secondaires d\'un exercice composé reçoivent environ 50% du stimulus des muscles primaires — c\'est le ratio 0.5× utilisé pour compter le volume indirect.',
    detail: 'EMG studies (Vigotsky et al. 2017, Marchetti & Uchida 2011) montrent que les muscles synergistes/assistants d\'un composé activent à ~40-60% de leur activation maximale vs ~80-100% pour les muscles primaires. Le 0.5× est une approximation conservative mais défendable pour compter le volume effectif. Ce ratio empêche de sous-estimer la fatigue accumulée par les petits muscles (biceps, triceps) qui travaillent constamment comme synergistes dans les composés.',
    source: 'Vigotsky et al. (2017) — EMG secondary muscle activation ; Marchetti & Uchida (2011) — muscle activation compound exercises',
    application: 'Compter chaque série de tirage comme 0.5 série effective pour les biceps. Compter chaque série de pressing comme 0.5 série pour les triceps. Si total dépasse le MRV du muscle secondaire → réduire le volume direct d\'isolation.',
    example: 'Ex : programme avec 4×4 rowing + 3×8 tirage vertical = 7 séries directes dos + 3.5 séries indirectes biceps (7 × 0.5). Si l\'athlète ajoute 4×10 curl direct, ses biceps cumulent 7.5 séries/sem. MRV biceps débutant = 14. Marge encore disponible. Mais si intermédiaire avec plus de volume de tirage, ça peut dépasser le MRV.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Biceps', 'Triceps'],
    keywords: ['muscles secondaires', '0.5x', 'stimulus indirect', 'volume effectif', 'EMG', 'composés'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PROGRESSION POIDS DE CORPS — HIÉRARCHIE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'bodyweight_progression_001',
    topic: 'progression',
    subtopics: ['poids de corps', 'hiérarchie', 'reps tempo ROM unilatéral lestage'],
    finding: 'La hiérarchie optimale de progression pour les exercices au poids de corps est : augmenter les reps → ralentir le tempo (excentrique) → augmenter l\'amplitude (ROM) → passer en unilatéral → ajouter du lestage.',
    detail: 'Chaque étape représente une augmentation de difficulté qui respecte les principes de surcharge progressive sans nécessiter d\'équipement supplémentaire jusqu\'aux dernières étapes. Reps ↑ : volume ↑. Tempo (excentrique lent) : temps sous tension ↑, dommage mécanique ↑. ROM ↑ : amplitude de travail ↑, étirement sous charge ↑ (stretch hypertrophy). Unilatéral : charge relative ↑ (chaque bras/jambe porte l\'intégralité du poids), recrutement SNC ↑. Lestage : surcharge externe, retour aux principes de force standard.',
    source: 'Delavier & Gundill — progression poids de corps (2011-2014) ; calisthenics progression principles',
    application: 'Pour les débutants sans matériel ou les utilisateurs en déplacement : appliquer cette hiérarchie avant de conclure qu\'un exercice est "trop facile". 30 reps de pompes normales → passer à tempo 4010 → puis pompes à un bras assistées → puis pompes à un bras.',
    example: 'Ex : tractions. Niveau 1 : 5 reps (concentric seulement si besoin). Niveau 2 : 10 reps normales. Niveau 3 : 10 reps tempo 4-0-1-0 (4 sec descente). Niveau 4 : 10 reps full ROM (from dead hang). Niveau 5 : archer pull-up (unilatéral assisté). Niveau 6 : traction lestée avec gilet +10kg.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['poids de corps', 'progression', 'reps', 'tempo', 'ROM', 'unilatéral', 'lestage', 'hiérarchie'],
  },

// ─────────────────────────────────────────────────────────────────────────────
// FONCTION DE REQUÊTE
// ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'sra_intensity_001',
    topic: 'recovery',
    subtopics: ['SRA', 'spécificité intensité', '72h', 'DUP', 'même mouvement'],
    finding: 'La règle des 72h concerne uniquement le MÊME mouvement à MÊME intensité (>80% 1RM). Un squat léger à hautes reps (50-65% 1RM) peut être réalisé 48h après un squat lourd — les systèmes fatigués sont différents.',
    detail: 'La fatigue SNC post-squat lourd (>80% 1RM) concerne la capacité à recruter les UM rapides à charge maximale. À 50-65% 1RM, cette capacité n\'est pas requise — le stimulus est métabolique (fibres lentes, endurance). Le DUP (Rhea 2002, Miranda 2011) exploite exactement ce principe : squat lourd lundi → squat hypertrophie mercredi → squat léger vendredi. Les 72h s\'appliquent entre deux sessions de même intensité élevée, pas entre tout travail du même muscle.',
    source: 'Rhea et al. (2002) J Strength Cond Res — DUP vs linéaire ; Miranda et al. (2011) ; SRA specificity literature',
    application: 'Programmer des jours DUP avec intensités différentes sur le même mouvement à 48h d\'intervalle. Ex : squat lourd lundi → squat hautes reps mercredi → repos du mouvement vendredi.',
    example: 'Ex : Lundi squat 4×4 à 85% 1RM. Mercredi squat 3×15 à 55% 1RM (endurance/métabolique). La règle 72h n\'est pas violée car le mercredi n\'est pas une session à haute intensité SNC sur le même mouvement.',
    objectives: ['strength', 'hypertrophy', 'endurance'],
    levels: ['intermediate', 'advanced'],
    muscles: [],
    keywords: ['SRA', '72h', '48h', 'DUP', 'intensité', 'même mouvement', 'squat', 'spécificité'],
  },
  {
    id: 'repeated_bout_001',
    topic: 'recovery',
    subtopics: ['repeated bout effect', 'DOMS', 'récupération accélérée', 'travail léger'],
    finding: 'L\'effet de la "repeated bout" : un travail léger sur un muscle endolori (24-48h post-séance lourde) réduit les DOMS et accélère la récupération plutôt que de l\'aggraver.',
    detail: 'Des exercices légers (30-50% 1RM, hautes reps, faible dommage) sur des muscles avec DOMS actifs améliorent la circulation sanguine locale, réduisent l\'inflammation et accélèrent l\'élimination des métabolites. Ce phénomène est bien documenté et est la base des "active recovery" sessions. Attention : si les DOMS sont sévères (douleur 7-8/10), la qualité du stimulus endurance sera dégradée.',
    source: 'Nosaka et al. (2007) — repeated bout effect mechanism ; Smith et al. (2019) — active recovery and DOMS',
    application: 'Des squats, presses ou rowing légers 48h après une session lourde ne compromettent pas la récupération — ils l\'accélèrent. Utiliser l\'intensité comme guide : si c\'est ≤60% 1RM, le travail est récupérateur.',
    example: 'Ex : DOMS quadriceps après squat lourd lundi. Mercredi : 3×15 leg press léger ou vélo 20 min → réduction des DOMS perçus dès jeudi. Vs repos total → DOMS plus longs et récupération plus lente.',
    objectives: ['hypertrophy', 'strength', 'endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['repeated bout effect', 'DOMS', 'récupération active', 'courbatures', 'travail léger', 'circulation'],
  },
  // ── ZONES FRAGILES — adaptations programme ────────────────────────────────
  {
    id: 'fragile_shoulder_001',
    topic: 'injury',
    subtopics: ['épaules fragiles', 'zone fragile', 'adaptation programme'],
    finding: 'Les épaules fragiles nécessitent un ratio tirage:pushing ≥ 2:1 et l\'élimination de tout mouvement avec abduction forcée en rotation interne.',
    detail: 'La coiffe des rotateurs est comprimée lors des mouvements en abduction + rotation interne (upright row, développé nuque, élévations latérales au-dessus de la ligne des épaules). Un déséquilibre tirage/pushing chronique est la première cause de syndrome d\'accrochage sous-acromial. Le plan scapulaire (30-45° d\'abduction) réduit significativement la compression.',
    source: 'Cools et al. (2016) — shoulder rehabilitation ; Kibler et al. (2013) — scapular dyskinesis',
    application: 'Épaules fragiles : supprimer upright row, développé nuque, élévations forcées au-delà parallèle. Remplacer par écarté câble bas, face pull, tirage horizontal. Ratio tirage:pressing ≥ 2:1 sur tout le programme.',
    example: 'Si 3 séries de développé → 6 séries de tirage. Remplacer OHP lourd par press en plan scapulaire (légère inclinaison vers l\'avant du torse). Élévations latérales max jusqu\'à parallèle.',
    objectives: ['hypertrophy', 'strength', 'endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Épaules'],
    keywords: ['shoulders', 'épaules fragile', 'zone fragile épaule', 'ratio tirage', 'abduction', 'accrochage'],
  },
  {
    id: 'fragile_shoulder_002',
    topic: 'injury',
    subtopics: ['épaules fragiles', 'sélection exercice'],
    finding: 'Le développé incliné à 30-45° et les mouvements en plan scapulaire sont les alternatives les plus sûres au développé couché plat et à l\'OHP pour les épaules fragiles.',
    detail: 'L\'inclinaison à 30-45° réduit la contrainte sur la capsule antérieure de l\'épaule. Les haltères permettent une rotation naturelle du poignet (semi-pronation), moins agressive que la pronation fixe de la barre.',
    source: 'Fees et al. (1998) — shoulder rehabilitation exercise ; Reinold et al. (2009) — rehab progressions',
    application: 'Épaules fragiles : préférer développé incliné haltères au développé couché barre plat. Éviter la prise trop large (index sur les anneaux). Remplacer OHP barre par OHP haltères ou arnold press avec ROM partiel.',
    example: 'Développé couché barre → développé incliné haltères 30° avec prise neutre. OHP barre → OHP haltères avec coudes légèrement avancés.',
    objectives: ['hypertrophy', 'strength'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Épaules', 'Pectoraux'],
    keywords: ['shoulders', 'épaules fragile', 'zone fragile épaule', 'plan scapulaire', 'développé incliné', 'haltères'],
  },
  {
    id: 'fragile_knee_001',
    topic: 'injury',
    subtopics: ['genoux fragiles', 'zone fragile', 'adaptation programme'],
    finding: 'Les genoux fragiles requièrent de substituer les exercices à haute contrainte patellaire (squat profond, fente avant) par des patterns hip-hinge dominants et des ROM limités.',
    detail: 'La force de cisaillement tibio-fémorale et la compression patello-fémorale augmentent exponentiellement avec la flexion du genou au-delà de 90°. Les patterns de type deadlift roumain, hip thrust et leg press avec ROM limité (0-60°) génèrent une hypertrophie des quadriceps et ischio-jambiers comparable avec un stress articulaire drastiquement réduit.',
    source: 'Escamilla et al. (2001) — tibiofemoral and patellofemoral forces ; Schoenfeld (2010) — squatting biomechanics',
    application: 'Genoux fragiles : remplacer squat profond par squat box (ROM contrôlé), leg press avec ROM limité à 60-70°, privilégier hip thrust, GHD et Romanian deadlift. Réduire la charge sur les extensions de jambes (cisaillement distal).',
    example: 'Back squat → goblet squat box limité à parallèle, ou leg press 60° de flexion max. Extension quadriceps : limiter ROM à 30-60° (position raccourcie) si douleur patelllaire présente.',
    objectives: ['hypertrophy', 'strength', 'endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Quadriceps', 'Ischio-jambiers'],
    keywords: ['knees', 'genoux fragile', 'zone fragile genou', 'patellaire', 'cisaillement', 'hip hinge', 'ROM limité'],
  },
  {
    id: 'fragile_lower_back_001',
    topic: 'injury',
    subtopics: ['lombaires fragiles', 'zone fragile', 'adaptation programme'],
    finding: 'Les lombaires fragiles nécessitent de réduire la charge axiale sur la colonne (squat barre, deadlift conventionnel) et de renforcer le gainage profond comme base obligatoire.',
    detail: 'Les blessures lombaires en musculation résultent presque toujours de contraintes de cisaillement sur L4-L5 en flexion avec charge. Le belt squat, la leg press et le deadlift roumain avec colonne neutre préservent les gains de force et d\'hypertrophie sans charge axiale directe sur les vertèbres.',
    source: 'McGill (2007) — Ultimate Back Fitness ; Callaghan & McGill (2001) — spine compression',
    application: 'Lombaires fragiles : remplacer back squat barre par goblet squat/leg press/belt squat. Remplacer deadlift conventionnel par Romanian deadlift ou trap bar deadlift. Intégrer 2-3 séries de gainage actif (planche, bird dog, dead bug) en début de séance.',
    example: 'Squat barre → leg press + goblet squat. Deadlift → Romanian deadlift avec tibia vertical. Ajouter 3×30s planche en début de chaque séance comme activation.',
    objectives: ['hypertrophy', 'strength', 'endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Dos', 'Quadriceps', 'Fessiers'],
    keywords: ['lower_back', 'lombaires fragile', 'zone fragile lombaire', 'charge axiale', 'colonne', 'gainage', 'belt squat'],
  },
  {
    id: 'fragile_wrist_001',
    topic: 'injury',
    subtopics: ['poignets fragiles', 'zone fragile', 'adaptation programme'],
    finding: 'Les poignets fragiles requièrent une préférence systématique pour la prise neutre et les haltères, qui permettent l\'auto-positionnement du poignet contrairement à la barre (pronation fixe).',
    detail: 'La barre impose une pronation stricte qui crée une déviation ulnaire en position de charge. Les haltères permettent une rotation naturelle vers la semi-pronation/supination selon le confort articulaire. Les poignées parallèles (câbles, haltères, machine) sont toujours préférables sur les exercices de poussée et tirage pour les poignets fragiles.',
    source: 'De Smedt et al. (2007) — wrist biomechanics during exercise ; Magee (2014) — orthopedic assessment',
    application: 'Poignets fragiles : remplacer développé couché barre par haltères ou machine. Curl barre → curl haltères ou curl corde. Push-up → push-up sur haltères ou en fist. Éviter les wrist curls et extensions de poignet sous charge.',
    example: 'Développé couché barre → haltères avec rotation naturelle du poignet. Curl barre → curl haltères (marteau ou supination partielle). Dips → parallettes si machine non disponible.',
    objectives: ['hypertrophy', 'strength', 'endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Biceps', 'Triceps', 'Pectoraux'],
    keywords: ['wrists', 'poignets fragile', 'zone fragile poignet', 'prise neutre', 'haltères', 'pronation', 'barre'],
  },
  {
    id: 'fragile_elbow_001',
    topic: 'injury',
    subtopics: ['coudes fragiles', 'zone fragile', 'adaptation programme'],
    finding: 'Les coudes fragiles (épicondylite latérale ou médiale) nécessitent de réduire le volume sur les exercices en pronation/supination forcée et de favoriser la prise marteau.',
    detail: 'L\'épicondylite latérale (tennis elbow) est aggravée par l\'extension du coude avec le poignet en pronation et par les exercices de tirage en supination strict. La prise marteau (neutre) distribue les contraintes de manière plus uniforme. Les exercices de triceps avec flexion complète du coude (skull crusher, french press) compriment la fosse olécranienne et doivent être remplacés par des variantes en ROM partiel ou avec câble.',
    source: 'Bisset et al. (2011) — lateral epicondylalgia ; Coonrad & Hooper (1973) — tennis elbow biomechanics',
    application: 'Coudes fragiles : remplacer curl barre supination par curl marteau ou curl corde. Remplacer skull crusher par triceps câble avec corde. Réduire le volume total biceps/triceps de 20-30% et augmenter progressivement. Éviter les mouvements de pronation/supination sous charge.',
    example: 'Curl barre → curl haltères marteau (prise neutre). Skull crusher → triceps câble corde (coude moins stressé). Extension coude → réduire ROM à 20-120° pour éviter la compression olécranienne.',
    objectives: ['hypertrophy', 'strength', 'endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Biceps', 'Triceps'],
    keywords: ['elbows', 'coudes fragile', 'zone fragile coude', 'épicondylite', 'prise marteau', 'pronation', 'supination'],
  },
  {
    id: 'fragile_neck_001',
    topic: 'injury',
    subtopics: ['cervicales fragiles', 'zone fragile', 'adaptation programme'],
    finding: 'Les cervicales fragiles imposent d\'éliminer tout exercice sollicitant directement la colonne cervicale en compression ou flexion-extension forcée, et de réduire le volume des trapèzes supérieurs.',
    detail: 'Les exercices créant une compression cervicale directe (wrestler\'s bridge, neck flexion/extension machine) ou une tension excessive des trapèzes supérieurs (haussements d\'épaules lourds, shrug, upright row) aggravent les pathologies cervicales. Le placement de la tête sur les exercices composés (position neutre obligatoire, ne jamais regarder en l\'air sur le deadlift) est critique.',
    source: 'Bogduk (2003) — cervical spine biomechanics ; Croft et al. (1998) — neck pain and exercise',
    application: 'Cervicales fragiles : supprimer shrug lourd, neck training, upright row. Maintenir position cervicale neutre sur tous les composés. Réduire volume trapèze supérieur. Préférer les tirages à la poitrine qui sollicitent le trapèze moyen/inférieur plutôt que le supérieur.',
    example: 'Shrug → face pull (trapèze moyen, sans compression cervicale). OHP : regard vers l\'avant, ne pas cambrer le cou. Deadlift : yeux vers sol à 2m, pas de regard au plafond.',
    objectives: ['hypertrophy', 'strength', 'endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Épaules', 'Dos'],
    keywords: ['neck', 'cervicales fragile', 'zone fragile cervicale', 'trapèze supérieur', 'compression cervicale', 'shrug'],
  },

  {
    id: 'exercise_order_001',
    topic: 'exercise',
    subtopics: ['ordre exercices', 'séquence séance', 'organisation intra-séance'],
    finding: 'L\'ordre des exercices dans une séance suit une hiérarchie déterministe basée sur la demande neuromusculaire, la fatigue et la priorité de l\'objectif.',
    detail: `Ordre optimal :
1. Skills neurologiques (planche, handstand, front lever, muscle-up) — SNC frais, coordination maximale requise
2. Composés lourds bloc A (squat, deadlift, bench barre, OHP barre) — force maximale, CNS frais
3. Composés accessoires bloc B (rowing, tirage, développé haltères) — dans l'ordre de priorité de l'objectif du jour
4. Isolation bloc C (curl, élévations, extension triceps) — fatigue générale ne compromet pas la technique
5. Exercices métaboliques / conditionnement (burpees, thruster, box jump, corde) — en dernier, impact négatif sur la technique des composés si placés avant
6. Gainage et abdos — fin de séance OU entre les séries comme repos actif

Règles croisées :
— Muscles synergiques : ne pas pré-fatiguer un muscle qui sera synergiste d'un composé suivant (ex: curl avant tirage vertical = biceps fatigués = moins de dos travaillé)
— Antagonistes : peuvent être supersetés sans perte de performance (bench + rowing horizontal, curl + extension triceps)
— Priorité de l'objectif : l'exercice le plus important pour l'objectif du jour va en premier dans son bloc
— Pré-exhaustion (isolation avant composé) : utilisation intentionnelle pour améliorer la connexion neuromusculaire sur des muscles difficiles à recruter — réservé à l'intermédiaire/avancé, réduit la charge possible sur le composé`,
    source: 'Robbins et al. (2010) — exercise order and strength ; Simão et al. (2012) — exercise order for hypertrophy ; Comana (2008) — resistance training order ; Israetel RP — program design principles',
    application: 'Construire chaque séance dans l\'ordre : skills → bloc A → bloc B → bloc C → métabolique → gainage. Ne jamais placer un exercice métabolique ou un isolant synergiste avant un composé lourd. Le respect de cet ordre est non-négociable — une séance mal ordonnée réduit le stimulus utile sur les composés principaux.',
    example: 'Séance jambes : 1) Pistol squat technique (skill) 2) Squat barre (bloc A) 3) Romanian deadlift (bloc B) 4) Leg extension (bloc C) 5) Wall sit (endurance) 6) Gainage. PAS: wall sit → squat barre (pré-fatigue quadri = moins de charge et technique dégradée).',
    objectives: ['hypertrophy', 'strength', 'endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: [],
    keywords: ['ordre exercices', 'séquence séance', 'organisation séance', 'bloc A B C', 'composé avant isolation', 'skills', 'métabolique', 'pré-exhaustion', 'antagoniste superset'],
  },

  {
    id: 'exercise_unlisted_001',
    topic: 'exercise',
    subtopics: ['exercices non listés', 'variantes utilisateur', 'coach ia réponse'],
    finding: 'Certains exercices efficaces ne sont pas dans la base de génération automatique mais restent parfaitement valides si l\'utilisateur les demande ou les pratique déjà.',
    detail: 'Exercices fréquemment demandés hors base automatique : Roue abdos (ab wheel rollout) — abdominaux en position étirée, progression : genoux → debout ; Trap bar deadlift — deadlift moins contraignant pour le bas du dos, position intermédiaire entre squat et deadlift conventionnel ; Nordic curl sans GHD — pieds bloqués sous un banc ou par partenaire, excentrique ischio-jambiers extrême ; Landmine press — développé épaule unilatéral avec barre en diagonale, moins de stress articulaire ; Belt squat — squat sans charge sur le dos, idéal pour problèmes lombaires ; Rollout TRX — gainage dynamique en suspension. Pour tous ces exercices : le Coach IA peut donner les paramètres (reps, tempo, intégration dans la séance) même s\'ils ne sont pas générés automatiquement dans le programme.',
    source: 'Delavier (2010) — variantes ; Gundill — Musculation avancée (2008) ; Aaberg (2007) — exercise anatomy',
    application: 'Si un utilisateur mentionne un exercice non présent dans la base ou demande comment l\'intégrer : fournir le muscle cible, le bloc recommandé (A/B/C), les reps/tempo adaptés à son objectif et niveau, et la place dans la séance (début vs fin). Ne jamais dire "cet exercice n\'est pas disponible" — adapter la réponse à l\'exercice demandé.',
    example: 'Ex : utilisateur demande comment intégrer la roue abdos → bloc C, 3×8-12 reps excentriques contrôlées (3s de descente), en fin de séance après les composés. Variante débutant : genoux au sol. Variante avancée : debout, ROM complet.',
    objectives: ['hypertrophy', 'strength', 'endurance'],
    levels: ['beginner', 'intermediate', 'advanced'],
    muscles: ['Abdominaux', 'Ischio-jambiers', 'Épaules', 'Fessiers'],
    keywords: ['roue abdos', 'trap bar', 'nordic curl', 'landmine', 'belt squat', 'exercice non listé', 'variante', 'intégrer séance'],
  },
  {
    id: 'morphology_level_001',
    topic: 'exercise',
    subtopics: ['morphologie', 'niveau requis', 'coach ia règle'],
    finding: 'L\'optimisation morphologique (longueur des membres, silhouette, posture) n\'est pertinente qu\'à partir du niveau intermédiaire. Les débutants doivent d\'abord maîtriser les patrons moteurs fondamentaux.',
    detail: 'Chez le débutant, les gains proviennent quasi exclusivement de l\'adaptation neurale et de l\'apprentissage moteur — la morphologie influe peu sur la sélection optimale des exercices à ce stade. C\'est à partir du niveau intermédiaire (progression linéaire ralentie, maîtrise des fondamentaux) que des ajustements morphologiques (ex: bras longs → sumo deadlift, jambes longues → stance plus large) deviennent significatifs pour optimiser les leviers et prévenir les compensations.',
    source: 'Israetel et al. (2019) — Scientific Principles of Hypertrophy Training ; Schoenfeld (2016) — Science and Development of Muscle Hypertrophy',
    application: 'Si un utilisateur débutant pose une question sur l\'optimisation morphologique (longueur de bras, posture, silhouette) : lui expliquer que cette optimisation est réservée aux profils intermédiaire et avancé, et l\'inviter à mettre à jour son niveau dans les paramètres de profil quand il se sentira prêt.',
    example: 'Coach IA réponse type pour débutant demandant comment adapter les exercices à ses bras longs : "L\'adaptation morphologique devient vraiment pertinente à partir du niveau intermédiaire. Concentre-toi d\'abord sur la maîtrise technique des exercices fondamentaux. Quand tu progresseras vers le niveau intermédiaire, tu pourras mettre à jour ton niveau dans ton profil (⚙️ Paramètres) et je prendrai en compte ta morphologie pour affiner tes exercices."',
    objectives: ['hypertrophy', 'strength', 'endurance'],
    levels: ['beginner'],
    muscles: [],
    keywords: ['morphologie', 'longueur bras', 'longueur jambes', 'silhouette', 'posture', 'adaptation morphologique', 'débutant morphologie'],
  },

];

// ─────────────────────────────────────────────────────────────────────────────
// FONCTION DE REQUÊTE
// ─────────────────────────────────────────────────────────────────────────────
export function queryKnowledge({ topic, objective, level, muscle, keywords = [], limit = 5 } = {}) {
  let results = KNOWLEDGE_BASE;

  if (topic)     results = results.filter(e => e.topic === topic);
  if (objective) results = results.filter(e => !e.objectives.length || e.objectives.includes(objective));
  if (level)     results = results.filter(e => !e.levels.length    || e.levels.includes(level));
  if (muscle)    results = results.filter(e => !e.muscles.length   || e.muscles.includes(muscle));
  if (keywords.length) {
    results = results.filter(e => keywords.some(k =>
      e.keywords.includes(k) || e.finding.toLowerCase().includes(k.toLowerCase())
    ));
  }

  return results.slice(0, limit);
}

// Retourne les findings + exemples formatés pour injection dans un prompt LLM
export function formatKnowledgeForPrompt(entries) {
  if (!entries.length) return '';
  return entries.map(e =>
    `[${e.source}] ${e.finding} → ${e.application}${e.example ? ` | ${e.example}` : ''}`
  ).join('\n');
}

// Déduplique et merge plusieurs listes d'entrées
function mergeUnique(arrays) {
  return [...new Map([].concat(...arrays).map(e => [e.id, e])).values()];
}

// Extrait les mots-clés significatifs d'un message utilisateur
function extractKeywords(message) {
  return (message || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // enlève les accents pour le matching
    .split(/[\s,.''"?!;:()\-/\\]+/)
    .filter(w => w.length > 3);
}

// ─── Requête basée sur le message (dynamique, précise par question) ───
export function getMessageKnowledge(message, { user = {}, objectives = [], limit = 6 } = {}) {
  if (!message) return '';
  const keywords = extractKeywords(message);
  if (!keywords.length) return '';

  const level   = (user.level) || 'intermediate';
  const primary = objectives.find(o => o.priority === 'primary');
  const obj     = primary?.type || 'hypertrophy';

  // Recherche par mots-clés du message
  const byKeyword = queryKnowledge({ keywords, objective: obj, level, limit });

  // Recherche par muscles mentionnés dans le message
  const MUSCLE_MAP = {
    pec: 'Poitrine', pecto: 'Poitrine', poitrine: 'Poitrine',
    dos: 'Dos', dorsal: 'Dos', rhomboid: 'Dos',
    epau: 'Épaules', delt: 'Épaules', epaule: 'Épaules',
    bice: 'Biceps', curl: 'Biceps',
    trice: 'Triceps',
    quad: 'Quadriceps', cuiss: 'Quadriceps',
    isch: 'Ischio-jambiers', hamstr: 'Ischio-jambiers',
    fess: 'Fessiers', glut: 'Fessiers',
    moll: 'Mollets', calf: 'Mollets',
    abdo: 'Abdos', core: 'Abdos',
  };
  const detectedMuscle = Object.entries(MUSCLE_MAP)
    .find(([key]) => keywords.some(w => w.includes(key)))?.[1];
  const byMuscle = detectedMuscle
    ? queryKnowledge({ muscle: detectedMuscle, limit: 2 })
    : [];

  const entries = mergeUnique([byKeyword, byMuscle]).slice(0, limit);
  return formatKnowledgeForPrompt(entries);
}

// ─── Contexte basé sur les disponibilités ───
function getAvailabilityKnowledge(user) {
  const days     = (user.available_days || []).length;
  const durations = user.duration_per_day || {};
  const avgMin   = days > 0
    ? Object.values(durations).reduce((s, v) => s + (parseInt(v) || 0), 0) / days
    : 60;

  const keywords = [];

  // Sessions très courtes → techniques d'efficacité temporelle
  if (avgMin < 30)  keywords.push('myo-reps', 'BFR', 'drop sets', 'superset', 'efficacité');
  if (avgMin < 45)  keywords.push('superset', 'drop sets', 'rest-pause');

  // Fréquence haute → splits spécifiques
  if (days >= 6)    keywords.push('PPL', 'arnold', '6 jours');
  if (days === 5)   keywords.push('ul_ppl', '5 jours', 'fréquence');
  if (days <= 2)    keywords.push('full body', 'maintenance', 'fréquence');
  if (days === 1)   keywords.push('isométrique', 'maintenance');

  if (!keywords.length) return [];
  return queryKnowledge({ keywords, limit: 3 });
}

// ─── Contexte de base selon profil + disponibilités (toujours inclus) ───
export function getContextualKnowledge(user, objectives = []) {
  const level   = user.level || 'intermediate';
  const primary = objectives.find(o => o.priority === 'primary');
  const obj     = primary?.type || 'hypertrophy';
  const fzRaw = Array.isArray(user.fragile_zones) ? user.fragile_zones : (() => { try { return JSON.parse(user.fragile_zones || '[]'); } catch { return []; } })();
  const fragileZones = fzRaw.map(z => typeof z === 'string' ? z : z.key);

  const base = mergeUnique([
    // ── Fondamentaux toujours présents ──────────────────────────────────────
    queryKnowledge({ topic: 'volume',     objective: obj, level, limit: 2 }),
    queryKnowledge({ topic: 'frequency',  objective: obj, level, limit: 1 }),
    queryKnowledge({ topic: 'intensity',  objective: obj, level, limit: 1 }),
    queryKnowledge({ topic: 'recovery',   level,          limit: 1 }),

    // ── Structure de programme (split) ──────────────────────────────────────
    queryKnowledge({ topic: 'split', level, limit: 2 }),

    // ── Périodisation ───────────────────────────────────────────────────────
    // Débutants : pas de mésocycle structuré, mais principes de base utiles
    // Intermédiaires/avancés : MEV→MAV→MRV, RIR par phase, décharge
    queryKnowledge({ topic: 'periodization', level, limit: level === 'beginner' ? 1 : 3 }),

    // ── Sélection d'exercices ───────────────────────────────────────────────
    ...(obj === 'hypertrophy' && level !== 'beginner'
      ? [queryKnowledge({ keywords: ['tension étirement', 'pic contraction', 'sélection exercice'], level, limit: 2 })]
      : []),
    ...(level === 'beginner'
      ? [queryKnowledge({ keywords: ['composés', 'isolation inutile', 'adaptation neurale'], level, limit: 1 })]
      : []),

    // ── Disponibilités ──────────────────────────────────────────────────────
    getAvailabilityKnowledge(user),

    // ── Techniques avancées (si acceptées, intermédiaire+ seulement) ────────
    ...(user.accepts_advanced_techniques && level !== 'beginner'
      ? [queryKnowledge({ topic: 'technique', level, limit: 3 })]
      : []),

    // ── Zones fragiles : règles spécifiques par zone ─────────────────────────
    ...fragileZones.flatMap(zone =>
      queryKnowledge({ topic: 'injury', keywords: [zone], limit: 1 })
    ),
  ]);

  return formatKnowledgeForPrompt(base);
}
