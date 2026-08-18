// ─────────────────────────────────────────────────────────────────────────────
// BASE DE DONNÉES D'EXERCICES
// equipmentOptions : tableau de tableaux — l'exercice est disponible si
//   l'utilisateur possède TOUS les items d'AU MOINS UNE option
// block : A = composé lourd, B = accessoire/composé modéré, C = isolation
// failureAllowed : false uniquement sur composés barre dangereux
// ─────────────────────────────────────────────────────────────────────────────

export const EXERCISES = [

  // ══════════════════════════════════════════════════════════════════════════
  // POITRINE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'bench_press_barbell', name: 'Développé couché barre',
    equipmentOptions: [['Barre olympique','Banc plat'],['Barre olympique','Banc plat','Rack squat'],['Barre olympique','Banc plat','Rack demi-cage']],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: false,
    cue: 'Omoplates serrées et fixées sur le banc, pieds au sol. Descends la barre au niveau des tétons, coudes à environ 45° du corps.',
  },
  {
    id: 'bench_press_dumbbell', name: 'Développé couché haltères',
    equipmentOptions: [['Haltères','Banc plat']],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'A', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Omoplates serrées, descends jusqu\'à l\'étirement des pectoraux. L\'amplitude est plus grande qu\'à la barre, profites-en.',
  },
  {
    id: 'incline_press_barbell', name: 'Développé incliné barre',
    equipmentOptions: [['Barre olympique','Banc réglable']],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: false,
    cue: 'Banc à 30°, pas plus : au-delà, ce sont les épaules qui prennent le travail. Descends la barre haut sur la poitrine.',
  },
  {
    id: 'incline_press_dumbbell', name: 'Développé incliné haltères',
    equipmentOptions: [['Haltères','Banc réglable']],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Banc à 30°, descends jusqu\'à l\'étirement. Ne cogne pas les haltères en haut, garde la tension.',
  },
  {
    id: 'decline_press_dumbbell', name: 'Développé décliné haltères',
    equipmentOptions: [['Haltères','Banc décliné']],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Banc incliné vers le bas, pieds bien calés. Descends les haltères vers le bas des pectoraux, coudes rentrés. Fais-toi passer les haltères ou pose-les sur les cuisses avant de t\'allonger.',
  },
  {
    id: 'bench_press_machine', name: 'Développé couché machine',
    equipmentOptions: [['Développé couché machine']],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Règle le siège pour que les poignées arrivent au niveau du bas des pectoraux. Omoplates serrées contre le dossier, ne décolle pas les épaules pour finir la poussée.',
  },
  {
    id: 'incline_press_machine', name: 'Développé incliné machine',
    equipmentOptions: [['Développé incliné machine']],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Siège réglé pour que les poignées soient au niveau du haut des pectoraux. Pousse vers le haut et l\'avant, sans hausser les épaules.',
  },
  {
    id: 'pec_deck', name: 'Pec deck',
    equipmentOptions: [['Pec deck']],
    muscles: { primary: ['Poitrine'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Dos calé, coudes à hauteur d\'épaules. Referme lentement et marque un temps d\'arrêt au centre.',
  },
  {
    id: 'cable_crossover', name: 'Écarté poulie',
    equipmentOptions: [['Station câbles double']],
    muscles: { primary: ['Poitrine'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Bras quasi tendus, angle des coudes fixe. Rapproche les mains devant toi et marque un temps au centre.',
  },
  {
    id: 'cable_fly_low', name: 'Écarté poulie basse',
    equipmentOptions: [['Câble poulie basse'],['Station câbles double']],
    muscles: { primary: ['Poitrine'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Poulies en position basse, buste légèrement penché en avant. Monte les bras en arc de cercle jusqu\'à hauteur des épaules, coudes fixes et à peine fléchis.',
  },
  {
    id: 'cable_fly_high', name: 'Écarté poulie haute',
    equipmentOptions: [['Câble poulie haute'],['Station câbles double']],
    muscles: { primary: ['Poitrine'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Poulies en haut, un pas en avant pour mettre les câbles sous tension. Ramène les mains devant le bas de la poitrine en arc de cercle, coudes fixes.',
  },
  {
    id: 'dumbbell_fly', name: 'Écarté haltères',
    equipmentOptions: [['Haltères','Banc plat']],
    muscles: { primary: ['Poitrine'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Coudes légèrement fléchis et VERROUILLÉS dans cet angle : si tu les plies pendant le mouvement, tu fais un développé. Descends jusqu\'à sentir l\'étirement, pas plus bas.',
  },
  {
    id: 'pushup', name: 'Pompe',
    equipmentOptions: [[]], // bodyweight
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Corps gainé et aligné, mains largeur d\'épaules. Descends la poitrine près du sol. Avancé : sac à dos chargé sur le haut du dos pour rester dans la plage de répétitions.',
  },
  {
    id: 'pushup_elevated', name: 'Pompe pieds surélevés',
    equipmentOptions: [['Banc plat'],['Banc réglable']],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Pieds sur un banc ou une chaise — plus ils sont hauts, plus le haut des pectoraux travaille.',
  },
  {
    id: 'dips_chest', name: 'Dips (poitrine)',
    equipmentOptions: [['Barres parallèles'],['Barre de dips']],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Buste penché en avant, coudes légèrement écartés. Descends jusqu\'à l\'étirement des pectoraux sans forcer sur l\'épaule.',
  },
  {
    id: 'bench_smith', name: 'Développé couché Smith',
    equipmentOptions: [['Smith machine','Banc plat']],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: false,
    cue: 'Place le banc pour que la barre descende au niveau des tétons : la barre étant guidée, c\'est la position du banc qui détermine tout. Vérifie les crochets avant de lâcher la charge.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // DOS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'pullup', name: 'Traction pronation',
    equipmentOptions: [['Barre de traction'],['Anneaux de gymnaste']],
    muscles: { primary: ['Dos'], secondary: ['Biceps','Épaules'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Paumes vers l\'avant. Monte jusqu\'à passer le menton au-dessus de la barre, redescends bras complètement tendus.',
  },
  {
    id: 'chinup', name: 'Traction supination (chin-up)',
    equipmentOptions: [['Barre de traction']],
    muscles: { primary: ['Dos','Biceps'], secondary: ['Épaules'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Paumes vers toi, mains largeur d\'épaules. Les biceps participent davantage qu\'en pronation.',
  },
  {
    id: 'trx_row', name: 'Rowing TRX',
    equipmentOptions: [['Sangles TRX']],
    muscles: { primary: ['Dos'], secondary: ['Biceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate'], failureAllowed: true,
    cue: 'Corps gainé et incliné, bras tendus. Tire la poitrine vers les mains ; plus les pieds sont avancés, plus c\'est dur.',
  },
  {
    id: 'lat_pulldown_wide', name: 'Tirage vertical pronation',
    equipmentOptions: [['Tirage vertical'],['Câble poulie haute']],
    muscles: { primary: ['Dos'], secondary: ['Biceps'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Prise large, sors la poitrine et tire la barre vers le haut du torse. Remonte sans lâcher la tension.',
  },
  {
    id: 'barbell_row', name: 'Rowing barre',
    equipmentOptions: [['Barre olympique']],
    muscles: { primary: ['Dos'], secondary: ['Biceps','Épaules'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: false,
    cue: 'Buste penché à environ 45°, dos plat. Tire la barre vers le nombril, coudes le long du corps, sans à-coup des lombaires.',
  },
  {
    id: 'dumbbell_row', name: 'Rowing haltère unilatéral',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Dos'], secondary: ['Biceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Un genou et une main sur le banc, dos plat. Tire l\'haltère vers la hanche sans tourner le buste.',
  },
  {
    id: 'cable_row', name: 'Rowing assis câble',
    equipmentOptions: [['Rowing assis machine']],
    muscles: { primary: ['Dos'], secondary: ['Biceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Buste droit, genoux à peine fléchis. Tire les coudes vers l\'arrière en serrant les omoplates ; ne balance pas le buste pour lancer la charge.',
  },
  {
    id: 'machine_row', name: 'Rowing horizontal machine',
    equipmentOptions: [['Rowing horizontal machine']],
    muscles: { primary: ['Dos'], secondary: ['Biceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Poitrine calée contre le support, épaules basses. Tire les poignées vers les hanches en serrant les omoplates, sans décoller le torse du coussin.',
  },
  {
    id: 'tbar_row', name: 'Rowing T-bar',
    equipmentOptions: [['Rowing T-bar machine'],['Barre olympique']],
    muscles: { primary: ['Dos'], secondary: ['Biceps'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Buste penché à environ 45°, dos gainé et bien plat. Tire la barre vers le nombril, coudes près du corps ; seuls les bras bougent, le dos reste immobile.',
  },
  {
    id: 'pullover_dumbbell', name: 'Pullover haltère',
    equipmentOptions: [['Haltères','Banc plat']],
    muscles: { primary: ['Dos'], secondary: ['Triceps','Poitrine'] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Allongé sur le banc, haltère tenu à deux mains au-dessus de la poitrine. Descends derrière la tête bras quasi tendus jusqu\'à l\'étirement, sans cambrer le bas du dos.',
  },
  {
    id: 'face_pull', name: 'Face pull câble',
    equipmentOptions: [['Câble poulie haute'],['Station câbles double']],
    muscles: { primary: ['Épaules','Dos'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Corde à hauteur du visage. Tire vers le front en écartant les mains, coudes hauts et épaules basses.',
  },
  {
    id: 'straight_arm_pulldown', name: 'Tirage poulie bras tendus',
    equipmentOptions: [['Câble poulie haute']],
    muscles: { primary: ['Dos'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Bras quasi tendus, angle des coudes fixe du début à la fin. Ramène la barre vers les cuisses par les dorsaux, pas par les triceps.',
  },
  {
    id: 'deadlift', name: 'Soulevé de terre',
    equipmentOptions: [['Barre olympique']],
    muscles: { primary: ['Dos','Ischio-jambiers','Fessiers'], secondary: ['Quadriceps','Mollets'] },
    type: 'compound', block: 'A', objectives: ['strength'],
    level: ['intermediate','advanced'], failureAllowed: false,
    cue: 'Barre contre les tibias, dos plat, épaules au-dessus de la barre. Pousse dans le sol avec les jambes et termine hanches tendues, sans partir en arrière.',
  },
  {
    id: 'hyperextension', name: 'Hyperextension',
    equipmentOptions: [['GHD'],['Chaise romaine']],
    muscles: { primary: ['Dos','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Bassin calé sur le coussin, hanches libres. Descends en gardant le dos droit et remonte jusqu\'à l\'alignement du corps — ne pars pas en hyperextension lombaire au sommet.',
  },
  {
    id: 'good_morning', name: 'Good morning',
    equipmentOptions: [['Barre olympique']],
    muscles: { primary: ['Ischio-jambiers','Dos'], secondary: ['Fessiers'] },
    type: 'compound', block: 'B', objectives: ['strength'],
    level: ['advanced'], failureAllowed: false,
    cue: 'Barre sur le haut du dos, genoux légèrement fléchis, dos plat. Pousse les hanches vers l\'arrière jusqu\'à l\'étirement des ischios. Charge modérée, c\'est un exercice technique.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÉPAULES
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'ohp_barbell', name: 'Développé militaire barre',
    equipmentOptions: [['Barre olympique']],
    muscles: { primary: ['Épaules'], secondary: ['Triceps'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: false,
    cue: 'Debout, gainage serré, fessiers contractés. Pousse la barre à la verticale au-dessus de la tête en rentrant légèrement la tête au passage. Ne cambre pas le bas du dos.',
  },
  {
    id: 'ohp_dumbbell', name: 'Développé militaire haltères',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Épaules'], secondary: ['Triceps'] },
    type: 'compound', block: 'A', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Haltères au niveau des oreilles, pousse à la verticale. Gainage serré, pas de cambrure lombaire.',
  },
  {
    id: 'ohp_machine', name: 'Développé épaules machine',
    equipmentOptions: [['Développé épaules machine']],
    muscles: { primary: ['Épaules'], secondary: ['Triceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Siège réglé pour que les poignées soient au niveau des épaules. Pousse verticalement sans cambrer, dos plaqué au dossier.',
  },
  {
    id: 'lateral_raise_dumbbell', name: 'Élévations latérales haltères',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Épaules'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Monte les bras sur les côtés jusqu\'à l\'horizontale, coudes légèrement fléchis. Charge légère — c\'est un petit muscle, l\'élan ne sert à rien.',
  },
  {
    id: 'lateral_raise_cable', name: 'Élévations latérales câble',
    equipmentOptions: [['Câble poulie basse'],['Station câbles double']],
    muscles: { primary: ['Épaules'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Poulie basse, monte le bras sur le côté jusqu\'à l\'horizontale. Coude légèrement fléchi, sans hausser l\'épaule.',
  },
  {
    id: 'front_raise_dumbbell', name: 'Élévations frontales haltères',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Épaules'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Monte les bras tendus devant toi jusqu\'à hauteur des yeux, pas plus haut. Pas d\'élan de hanches : si tu dois balancer, l\'haltère est trop lourd.',
  },
  {
    id: 'rear_delt_fly', name: 'Oiseau haltères (deltoïde postérieur)',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Épaules','Dos'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Buste penché, bras tendus vers le sol. Ouvre les bras sur les côtés sans hausser les épaules.',
  },
  {
    id: 'shrug_barbell', name: 'Shrugs barre',
    equipmentOptions: [['Barre olympique']],
    muscles: { primary: ['Épaules'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','strength'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Bras tendus, barre devant les cuisses. Monte les épaules vers les oreilles à la verticale et marque un temps en haut. Les rotations d\'épaules n\'apportent rien.',
  },
  {
    id: 'shrug_dumbbell', name: 'Shrugs haltères',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Épaules'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Haltères le long du corps, bras tendus. Hausse les épaules à la verticale et marque un temps en haut ; ne plie pas les coudes pour tricher.',
  },
  {
    id: 'upright_row', name: 'Tirage vertical menton barre',
    equipmentOptions: [['Barre olympique'],['Barre EZ'],['Haltères']],
    muscles: { primary: ['Épaules'], secondary: ['Biceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Prise un peu plus large que les épaules. Monte les coudes jusqu\'à hauteur d\'épaules, PAS PLUS HAUT : au-delà, l\'épaule se pince. Si tu sens un pincement, élargis la prise.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // BICEPS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'curl_barbell', name: 'Curl barre droite',
    equipmentOptions: [['Barre olympique']],
    muscles: { primary: ['Biceps'], secondary: ['Avant-bras'] },
    type: 'isolation', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Coudes collés au corps et fixes. Monte la barre sans reculer les coudes ni balancer le buste, et contrôle la descente jusqu\'aux bras tendus.',
  },
  {
    id: 'curl_ez', name: 'Curl barre EZ',
    equipmentOptions: [['Barre EZ']],
    muscles: { primary: ['Biceps'], secondary: ['Avant-bras'] },
    type: 'isolation', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Coudes fixes le long du corps, monte la barre sans balancer le buste. La prise coudée de l\'EZ ménage les poignets.',
  },
  {
    id: 'curl_dumbbell', name: 'Curl haltères alternés',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Biceps'], secondary: ['Avant-bras'] },
    type: 'isolation', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Un bras après l\'autre, coudes fixes le long du corps. Tourne progressivement la paume vers le haut en montant.',
  },
  {
    id: 'hammer_curl', name: 'Curl marteau',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Biceps','Avant-bras'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Prise neutre, pouces vers le haut, coudes fixes. Travaille aussi le brachial et l\'avant-bras.',
  },
  {
    id: 'concentration_curl', name: 'Curl concentré',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Biceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Assis, coude calé contre l\'intérieur de la cuisse. Monte jusqu\'à la contraction complète et descends lentement bras tendu, sans aucun mouvement d\'épaule.',
  },
  {
    id: 'incline_curl', name: 'Curl incliné haltères',
    equipmentOptions: [['Haltères','Banc réglable']],
    muscles: { primary: ['Biceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Assis sur un banc incliné, bras qui pendent en arrière du buste. C\'est cet étirement de départ qui fait l\'exercice — n\'avance pas les coudes pour tricher.',
  },
  {
    id: 'curl_machine', name: 'Curl biceps machine',
    equipmentOptions: [['Curl biceps machine']],
    muscles: { primary: ['Biceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Règle le siège pour que le coude soit aligné avec l\'axe de rotation. Ne décolle pas les bras du coussin et contrôle le retour.',
  },
  {
    id: 'preacher_curl', name: 'Preacher curl machine',
    equipmentOptions: [['Preacher curl machine']],
    muscles: { primary: ['Biceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Aisselles bien calées en haut du pupitre. Ne tends pas les bras d\'un coup en bas : la remontée doit rester sous contrôle, le biceps est vulnérable en position étirée.',
  },
  {
    id: 'cable_curl_low', name: 'Curl câble poulie basse',
    equipmentOptions: [['Câble poulie basse'],['Station câbles double']],
    muscles: { primary: ['Biceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Debout face à la poulie, coudes fixes contre le corps. Le câble garde la tension même en bas — profites-en pour contrôler la descente.',
  },
  {
    id: 'cable_curl_high', name: 'Curl câble poulie haute (spider)',
    equipmentOptions: [['Câble poulie haute'],['Station câbles double']],
    muscles: { primary: ['Biceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Poulie en haut, bras tendu à l\'horizontale. Amène la main vers la tête sans bouger le coude ; la tension est maximale en position contractée.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TRICEPS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'close_grip_bench', name: 'Développé couché prise serrée',
    equipmentOptions: [['Barre olympique','Banc plat']],
    muscles: { primary: ['Triceps'], secondary: ['Poitrine'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: false,
    cue: 'Mains à largeur d\'épaules, pas plus serrées : trop serré, ce sont les poignets qui prennent. Coudes près du corps, descends vers le bas des pectoraux.',
  },
  {
    id: 'skull_crusher_ez', name: 'Skull crusher barre EZ',
    equipmentOptions: [['Barre EZ','Banc plat']],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'B', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Allongé, coudes fixes pointés vers le plafond. Descends la barre vers le front : seuls les avant-bras bougent.',
  },
  {
    id: 'skull_crusher_dumbbell', name: 'Skull crusher haltères',
    equipmentOptions: [['Haltères','Banc plat']],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'B', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Coudes fixes pointés vers le plafond. Descends les haltères de part et d\'autre de la tête, seuls les avant-bras bougent. Meilleure position de poignet qu\'à la barre.',
  },
  {
    id: 'triceps_pushdown_rope', name: 'Triceps poulie haute corde',
    equipmentOptions: [['Câble poulie haute'],['Station câbles double']],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Coudes fixes le long du corps. Tends les bras vers le bas et écarte la corde en fin de mouvement.',
  },
  {
    id: 'triceps_pushdown_bar', name: 'Triceps câble barre',
    equipmentOptions: [['Câble poulie haute']],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Coudes collés au corps, buste légèrement penché. Tends les bras complètement vers le bas et contrôle le retour sans remonter les coudes.',
  },
  {
    id: 'triceps_cable_low', name: 'Triceps poulie basse',
    equipmentOptions: [['Câble poulie basse']],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Dos à la poulie, bras au-dessus de la tête, coudes serrés. Tends les bras vers le haut sans laisser les coudes s\'écarter.',
  },
  {
    id: 'kickback', name: 'Kickback haltères',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Buste penché, bras collé au corps, coude fixe et haut. Tends l\'avant-bras vers l\'arrière jusqu\'au verrouillage et marque un temps ; charge légère obligatoire.',
  },
  {
    id: 'overhead_ext_dumbbell', name: 'Extension triceps haltère bilatérale',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'B', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Haltère tenu à deux mains derrière la tête, coudes serrés et pointés vers le haut. Descends jusqu\'à l\'étirement complet du triceps sans écarter les coudes.',
  },
  {
    id: 'overhead_ext_unilateral', name: 'Extension triceps haltère unilatérale',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Un bras au-dessus de la tête, coude pointé vers le plafond, l\'autre main peut soutenir le coude. Descends derrière la nuque et remonte sans bouger le coude.',
  },
  {
    id: 'triceps_machine', name: 'Triceps machine',
    equipmentOptions: [['Triceps machine']],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Règle le siège pour aligner tes coudes avec l\'axe de la machine. Tends les bras complètement et contrôle le retour sans te laisser tirer par la charge.',
  },
  {
    id: 'dips_triceps_machine', name: 'Dips triceps machine',
    equipmentOptions: [['Dips triceps machine']],
    muscles: { primary: ['Triceps'], secondary: ['Épaules'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Dos calé, coudes serrés le long du corps. Tends les bras sans verrouiller brutalement.',
  },
  {
    id: 'diamond_pushup', name: 'Pompe diamant',
    equipmentOptions: [[]], // bodyweight
    muscles: { primary: ['Triceps'], secondary: ['Poitrine'] },
    // COMPOUND : une pompe met en jeu l'épaule ET le coude. C'était le seul des
    // treize mouvements de pompe de la base classé en isolation — les dips buste
    // droit, qui visent pourtant aussi les triceps, sont bien en compound.
    // L'écart comptait : les isolations sont rognées EN PREMIER quand le temps
    // manque, celle-ci sautait donc avant des mouvements équivalents.
    type: 'compound', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Mains jointes en losange sous la poitrine, coudes serrés le long du corps. Ce sont les triceps qui travaillent, pas les pectoraux.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // QUADRICEPS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'squat_barbell', name: 'Squat barre',
    equipmentOptions: [['Barre olympique','Rack squat'],['Barre olympique','Rack demi-cage']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers','Mollets','Dos'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: false,
    cue: 'Barre sur le haut du dos, descends au moins jusqu\'aux cuisses parallèles. Genoux dans l\'axe des pieds, dos plat, regard neutre.',
  },
  {
    id: 'squat_dumbbell', name: 'Squat haltères',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Haltères le long du corps, pieds largeur d\'épaules. Descends en poussant les hanches vers l\'arrière, dos droit, jusqu\'à ce que les cuisses soient au moins parallèles au sol.',
  },
  {
    id: 'goblet_squat', name: 'Squat gobelet',
    equipmentOptions: [['Kettlebells'],['Haltères']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Kettlebell tenue contre la poitrine, coudes rentrés. Le poids devant sert de contrepoids : il t\'aide à garder le buste droit et à descendre bas.',
  },
  {
    id: 'squat_bodyweight', name: 'Squat au poids du corps',
    equipmentOptions: [[]], // bodyweight
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['endurance'],
    level: ['beginner'], failureAllowed: true,
    cue: 'Pieds largeur d\'épaules, descends au moins jusqu\'aux cuisses parallèles. Dos plat, genoux dans l\'axe des pieds.',
  },
  {
    id: 'leg_press', name: 'Leg press',
    equipmentOptions: [['Leg press']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Pieds au milieu du plateau, descends jusqu\'à environ 90° sans décoller le bassin. Ne verrouille pas les genoux en haut.',
  },
  {
    id: 'hack_squat', name: 'Hack squat machine',
    equipmentOptions: [['Hack squat machine']],
    muscles: { primary: ['Quadriceps'], secondary: ['Fessiers'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Dos calé, pieds au milieu du plateau. Descends au moins jusqu\'aux cuisses parallèles.',
  },
  {
    id: 'leg_extension', name: 'Leg extension',
    equipmentOptions: [['Leg extension']],
    muscles: { primary: ['Quadriceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Dos calé, axe de rotation de la machine aligné sur le genou. Tends complètement et contrôle la descente.',
  },
  {
    id: 'sissy_squat', name: 'Sissy squat',
    equipmentOptions: [[]],
    muscles: { primary: ['Quadriceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Genoux vers l\'avant, buste et cuisses alignés, descends en arrière. Amplitude progressive : c\'est exigeant pour les genoux.',
  },
  {
    id: 'dips_weighted_parallel', name: 'Dips lestés aux barres parallèles',
    equipmentOptions: [['Barres parallèles','Ceinture de lest']],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: false,
    cue: 'Ceinture de lest, buste penché en avant. Contrôle la descente, pas de rebond en bas.',
  },
  {
    id: 'curl_rings', name: 'Curl aux anneaux',
    equipmentOptions: [['Anneaux de gymnaste']],
    muscles: { primary: ['Biceps'], secondary: [] },
    type: 'isolation', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Anneaux réglés bas, corps incliné en arrière, paumes vers toi. Fléchis les coudes pour amener les mains vers le front, coudes hauts et fixes.',
  },
  {
    id: 'curl_band', name: 'Curl élastique',
    equipmentOptions: [['Élastiques de résistance']],
    muscles: { primary: ['Biceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Pieds sur l\'élastique, coudes fixes le long du corps. La résistance augmente en fin de montée : ralentis la descente.',
  },
  {
    id: 'calf_single_weighted', name: 'Mollets lestés une jambe',
    equipmentOptions: [['Gilet lesté']],
    muscles: { primary: ['Mollets'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Sur une jambe, avant-pied sur une marche, gilet ou ceinture de lest. Amplitude complète, contrôle la descente.',
  },
  {
    id: 'lunge_barbell', name: 'Fente avant barre',
    equipmentOptions: [['Barre olympique']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: false,
    cue: 'Barre sur les trapèzes, un grand pas en avant. Le genou arrière descend vers le sol, buste droit, genou avant au-dessus du pied. Ne va pas à l\'échec : l\'équilibre lâche avant le muscle.',
  },
  {
    id: 'lunge_dumbbell', name: 'Fente avant haltères',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Haltères le long du corps, grand pas en avant. Le genou arrière descend vers le sol, le buste reste vertical. Pousse sur le talon avant pour revenir.',
  },
  {
    id: 'bulgarian_split_squat', name: 'Fente bulgare haltères',
    equipmentOptions: [['Haltères','Banc réglable'],['Haltères','Banc plat']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Pied arrière sur un banc, descends sur la jambe avant. Buste légèrement penché pour plus de fessiers, droit pour plus de quadriceps.',
  },
  {
    id: 'squat_smith', name: 'Squat Smith',
    equipmentOptions: [['Smith machine']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: false,
    cue: 'Pieds légèrement avancés par rapport à la barre : la barre étant guidée, c\'est la position des pieds qui fixe la trajectoire. Vérifie les crochets avant de charger.',
  },
  {
    id: 'walking_lunge', name: 'Fente marchée haltères',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Avance en fentes en alternant les jambes, genou arrière proche du sol. Grand pas = fessiers, petit pas = quadriceps.',
  },
  {
    id: 'belt_squat', name: 'Belt squat',
    equipmentOptions: [['Belt squat machine'],['Ceinture de lest','Rack squat'],['Ceinture de lest','Rack demi-cage']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers','Mollets'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Ceinture sur les hanches, la charge tire vers le bas sans passer par le dos. Descends bas en gardant le buste droit — l\'intérêt de la machine est justement d\'épargner les lombaires.',
  },
  {
    id: 'step_up', name: 'Step-up haltères',
    equipmentOptions: [['Haltères','Banc plat'],['Haltères','Banc réglable']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Pose tout le pied sur le banc et pousse sur le TALON du pied posé, sans t\'aider d\'un élan de la jambe restée au sol. Redescends en contrôlant, ne saute pas.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ISCHIO-JAMBIERS & FESSIERS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'rdl_barbell', name: 'Soulevé de terre roumain barre',
    equipmentOptions: [['Barre olympique']],
    muscles: { primary: ['Ischio-jambiers','Fessiers'], secondary: ['Dos'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: false,
    cue: 'Jambes quasi tendues, pousse les hanches vers l\'arrière en gardant la barre proche des jambes. Descends jusqu\'à l\'étirement des ischios, pas plus bas.',
  },
  {
    id: 'rdl_dumbbell', name: 'Soulevé de terre roumain haltères',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Ischio-jambiers','Fessiers'], secondary: ['Dos'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Jambes quasi tendues, genoux à peine fléchis. Pousse les hanches vers l\'arrière et descends les haltères le long des jambes jusqu\'à l\'étirement des ischios, dos plat.',
  },
  {
    id: 'leg_curl_lying', name: 'Leg curl allongé',
    equipmentOptions: [['Leg curl allongé']],
    muscles: { primary: ['Ischio-jambiers'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'À plat ventre, ramène les talons vers les fessiers sans décoller les hanches du support.',
  },
  {
    id: 'leg_curl_seated', name: 'Leg curl assis',
    equipmentOptions: [['Leg curl assis']],
    muscles: { primary: ['Ischio-jambiers'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Dos calé, ramène les talons sous le siège et contrôle le retour sans relâcher d\'un coup.',
  },
  {
    id: 'hip_thrust_barbell', name: 'Hip thrust barre',
    equipmentOptions: [['Barre olympique','Banc plat']],
    muscles: { primary: ['Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Haut du dos contre le banc, barre sur les hanches avec un coussin. Monte jusqu\'à l\'alignement genoux-hanches-épaules, menton rentré, et serre en haut.',
  },
  {
    id: 'hip_thrust_machine', name: 'Hip thrust machine',
    equipmentOptions: [['Hip thrust machine']],
    muscles: { primary: ['Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Dos calé, pousse le coussin par les hanches. Marque un temps d\'arrêt en haut en serrant les fessiers.',
  },
  {
    id: 'hip_thrust_dumbbell', name: 'Hip thrust haltères',
    equipmentOptions: [['Haltères','Banc plat']],
    muscles: { primary: ['Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Haut du dos calé sur le banc, haltère sur le bassin. Monte les hanches jusqu\'à l\'alignement épaules-hanches-genoux, menton rentré, et serre les fessiers en haut.',
  },
  {
    id: 'glute_kickback_cable', name: 'Kickback fessier câble',
    equipmentOptions: [['Câble poulie basse']],
    muscles: { primary: ['Fessiers'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Sangle à la cheville, buste légèrement penché en appui. Envoie la jambe vers l\'arrière en gardant le dos immobile ; ne cambre pas pour gagner de l\'amplitude.',
  },
  {
    id: 'fessier_machine', name: 'Fessier machine',
    equipmentOptions: [['Fessier machine']],
    muscles: { primary: ['Fessiers'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Cale bien le buste et le bassin. Pousse jusqu\'à l\'extension complète de la hanche, sans cambrer le bas du dos pour aller plus loin.',
  },
  {
    id: 'glute_bridge', name: 'Pont fessier au sol',
    equipmentOptions: [[]], // bodyweight
    muscles: { primary: ['Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'isolation', block: 'C', objectives: ['endurance'],
    level: ['beginner'], failureAllowed: true,
    cue: 'Allongé sur le dos, pieds au sol près des fessiers. Monte le bassin en serrant les fessiers, sans creuser le bas du dos en haut.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ADDUCTEURS & ABDUCTEURS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'abductor_machine', name: 'Abducteur machine',
    equipmentOptions: [['Abducteur machine']],
    muscles: { primary: ['Abducteurs'], secondary: ['Fessiers'] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Assis, dos calé, écarte les genoux contre la résistance et contrôle le retour. Ne t\'aide pas avec le buste.',
  },
  {
    id: 'adductor_machine', name: 'Adducteur machine',
    equipmentOptions: [['Adducteur machine']],
    muscles: { primary: ['Adducteurs'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Règle l\'écartement de départ sans forcer l\'étirement. Serre les cuisses jusqu\'à la fermeture et contrôle le retour, sans laisser les jambes s\'écarter brutalement.',
  },
  {
    id: 'sumo_squat', name: 'Squat sumo',
    equipmentOptions: [['Haltères'],['Kettlebells'],['Barre olympique']],
    muscles: { primary: ['Adducteurs','Quadriceps','Fessiers'], secondary: [] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Pieds bien plus larges que les épaules, pointes vers l\'extérieur. Descends entre les jambes, genoux dans l\'axe des pieds ; tu dois sentir l\'intérieur des cuisses.',
  },
  {
    id: 'miniband_abduction', name: 'Abduction mini-bands',
    equipmentOptions: [['Mini-bands']],
    muscles: { primary: ['Abducteurs','Fessiers'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['endurance'],
    level: ['beginner','intermediate'], failureAllowed: true,
    cue: 'Élastique au-dessus des genoux. Écarte les genoux contre la résistance sans bouger le bassin ; le mouvement est court, la tension reste continue.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // MOLLETS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'calf_raise_machine', name: 'Mollets debout machine',
    equipmentOptions: [['Mollets debout machine']],
    muscles: { primary: ['Mollets'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Jambes tendues, amplitude complète, temps de pause en haut de chaque répétition.',
  },
  {
    id: 'seated_calf_raise', name: 'Mollets assis machine',
    equipmentOptions: [['Mollets assis machine']],
    muscles: { primary: ['Mollets'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Genoux fléchis à 90°, monte le plus haut possible et descends en étirement complet. Genou fléchi = c\'est le soléaire qui travaille.',
  },
  {
    id: 'leg_press_calf', name: 'Mollets leg press',
    equipmentOptions: [['Leg press']],
    muscles: { primary: ['Mollets'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Avant-pieds sur le bas du plateau. Pousse par les orteils sans déverrouiller les genoux.',
  },
  {
    id: 'calf_raise_barbell', name: 'Mollets debout barre',
    equipmentOptions: [['Barre olympique']],
    muscles: { primary: ['Mollets'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Barre sur les trapèzes, avant-pieds sur une cale si tu en as une. Monte le plus haut possible sur les pointes, marque un temps, et descends jusqu\'à l\'étirement complet.',
  },
  {
    id: 'calf_raise_dumbbell', name: 'Mollets debout haltères',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Mollets'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Haltères le long du corps. Monte sur les pointes au maximum, temps d\'arrêt en haut, descente lente jusqu\'à l\'étirement : c\'est l\'amplitude complète qui fait le travail.',
  },
  {
    id: 'calf_raise_bodyweight', name: 'Mollets unilatéraux poids du corps',
    equipmentOptions: [[]], // bodyweight
    muscles: { primary: ['Mollets'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['endurance'],
    level: ['beginner','intermediate'], failureAllowed: true,
    cue: 'Sur une jambe, avant-pied sur une marche. Monte le plus haut possible et contrôle la descente jusqu\'à l\'étirement.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ABDOS & CORE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'crunch_machine', name: 'Crunch machine',
    equipmentOptions: [['Crunch abdos machine']],
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Dos bien calé, poignées au niveau des épaules. Enroule le buste et contrôle le retour sans laisser la charge te tirer.',
  },
  {
    id: 'rotation_machine', name: 'Rotation obliques machine',
    equipmentOptions: [['Rotation obliques machine']],
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Bassin bloqué, la rotation vient du buste. Va progressivement et sans à-coups : le bas du dos n\'aime pas la rotation chargée et rapide.',
  },
  {
    id: 'hanging_leg_raise', name: 'Relevés de jambes suspendu',
    equipmentOptions: [['Barre de traction'],['Captain chair']],
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Suspendu à la barre, monte les jambes tendues sans balancer. Enroule le bassin en fin de montée : c\'est là que les abdos travaillent vraiment.',
  },
  {
    id: 'captain_chair', name: 'Captain chair relevés genoux',
    equipmentOptions: [['Captain chair']],
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Avant-bras calés, dos plaqué. Monte les genoux en ENROULANT le bassin vers le haut — si tu montes seulement les cuisses, ce sont les fléchisseurs de hanche qui travaillent, pas les abdos.',
  },
  {
    id: 'cable_crunch', name: 'Crunch câble',
    equipmentOptions: [['Câble poulie haute']],
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'À genoux face à la poulie haute, corde derrière la nuque. Enroule le buste vers les cuisses en gardant les hanches fixes — ce sont les abdos qui tirent, pas les bras.',
  },
  {
    id: 'plank', name: 'Planche',
    equipmentOptions: [[]], // bodyweight
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'compound', block: 'C', objectives: ['endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Appui sur les avant-bras et les pointes de pieds, corps aligné des talons à la tête. Serre les fessiers et rentre le bassin — pas de dos creux.',
  },
  {
    id: 'side_plank', name: 'Gainage latéral',
    equipmentOptions: [[]], // bodyweight
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Sur le côté, coude sous l\'épaule. Monte le bassin jusqu\'à l\'alignement pieds-hanches-épaules et tiens la position sans laisser les hanches redescendre.',
  },
  {
    id: 'russian_twist', name: 'Russian twist',
    equipmentOptions: [['Medicine ball'],['Haltères'],[]],
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Buste incliné en arrière, pieds décollés ou au sol. Fais tourner les ÉPAULES d\'un côté à l\'autre, pas seulement les bras, et va lentement.',
  },
  {
    id: 'crunch', name: 'Crunch au sol',
    equipmentOptions: [[]], // bodyweight
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Allongé sur le dos, genoux fléchis. Décolle les omoplates en enroulant le buste, sans tirer sur la nuque. Inter./avancé : tiens un sac chargé contre la poitrine ou bras tendus derrière la tête.',
  },
  {
    id: 'swiss_ball_crunch', name: 'Crunch Swiss ball',
    equipmentOptions: [['Swiss ball']],
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate'], failureAllowed: true,
    cue: 'Bas du dos sur le ballon, pieds bien stables. Descends légèrement en arrière pour étirer les abdos, puis enroule le buste : c\'est cette amplitude en extension qui fait l\'intérêt du ballon.',
  },
  {
    id: 'pallof_press', name: 'Pallof press câble',
    equipmentOptions: [['Câble poulie haute'],['Câble poulie basse'],['Station câbles double']],
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'compound', block: 'C', objectives: ['strength','endurance'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'De profil à la poulie, mains devant le sternum. Tends les bras en résistant à la rotation — le but est de NE PAS bouger. Gaine et respire.',
  },
  {
    id: 'dead_bug', name: 'Dead bug',
    equipmentOptions: [[]], // bodyweight
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'compound', block: 'C', objectives: ['endurance'],
    level: ['beginner','intermediate'], failureAllowed: true,
    cue: 'Allongé, bas du dos plaqué au sol. Descends un bras et la jambe opposée sans jamais laisser le dos se creuser ; si le dos décolle, réduis l\'amplitude.',
  },
  {
    id: 'dragon_flag', name: 'Dragon flag',
    equipmentOptions: [['Banc plat']],
    muscles: { primary: ['Abdominaux'], secondary: ['Dos'] },
    type: 'compound', block: 'B', objectives: ['strength'],
    level: ['advanced'], failureAllowed: true,
    cue: 'Accroche-toi derrière la tête, corps gainé d\'un seul bloc. Descends le corps entier lentement en gardant la ligne épaules-hanches-pieds. Très difficile : commence genoux pliés.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // AJOUTS — VARIANTES DE PRISE & EXERCICES UNIVERSELS MANQUANTS
  // ══════════════════════════════════════════════════════════════════════════

  // ISCHIO-JAMBIERS
  {
    id: 'nordic_curl', name: 'Nordic curl',
    equipmentOptions: [['GHD'],['Banc plat'],['Banc réglable'],[]],
    muscles: { primary: ['Ischio-jambiers'], secondary: ['Fessiers'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'À genoux, chevilles bloquées. Descends le buste vers l\'avant en résistant le plus longtemps possible, puis rattrape-toi sur les mains.',
  },
  {
    id: 'kettlebell_swing', name: 'Kettlebell swing',
    equipmentOptions: [['Kettlebells']],
    muscles: { primary: ['Ischio-jambiers','Fessiers'], secondary: ['Dos','Épaules'] },
    type: 'compound', block: 'B', objectives: ['strength','endurance'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'C\'est une charnière de HANCHE, pas un squat : les hanches reculent, la kettlebell passe entre les jambes. La projection vient du coup de hanches, les bras ne font que suivre.',
  },

  // TRICEPS
  {
    id: 'french_press_ez', name: 'French press barre EZ (overhead)',
    equipmentOptions: [['Barre EZ','Banc réglable'],['Barre EZ','Banc plat']],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'B', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Assis dossier haut, barre EZ au-dessus de la tête, coudes serrés. Descends derrière la nuque jusqu\'à l\'étirement et remonte sans écarter les coudes.',
  },

  // BICEPS / AVANT-BRAS
  {
    id: 'reverse_curl_ez', name: 'Curl inversé barre EZ',
    equipmentOptions: [['Barre EZ'],['Barre olympique']],
    muscles: { primary: ['Avant-bras'], secondary: ['Biceps'] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Prise en pronation, paumes vers le bas, coudes fixes. La charge est nettement plus légère qu\'au curl classique, c\'est normal : le levier est défavorable.',
  },
  {
    id: 'zottman_curl', name: 'Curl Zottman',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Biceps','Avant-bras'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Monte en supination paumes vers le haut, tourne les poignets en haut, redescends en pronation paumes vers le bas. La descente en pronation est le vrai travail.',
  },
  {
    id: 'wrist_curl', name: 'Wrist curl barre EZ',
    equipmentOptions: [['Barre EZ'],['Haltères']],
    muscles: { primary: ['Avant-bras'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Avant-bras posés sur les cuisses ou un banc, poignets dans le vide. Laisse la barre dérouler jusqu\'au bout des doigts puis enroule. Amplitude complète, charge légère.',
  },

  // DOS — VARIANTES DE PRISE
  {
    id: 'barbell_row_supinated', name: 'Rowing barre prise supination',
    equipmentOptions: [['Barre olympique']],
    muscles: { primary: ['Dos'], secondary: ['Biceps'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: false,
    cue: 'Prise en supination largeur d\'épaules, buste penché à 45°, dos plat. Tire vers le nombril, coudes près du corps. Ne va pas à l\'échec : c\'est le dos qui cède en premier.',
  },
  {
    id: 'lat_pulldown_supinated', name: 'Tirage vertical prise supination',
    equipmentOptions: [['Tirage vertical']],
    muscles: { primary: ['Dos'], secondary: ['Biceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Mains en supination largeur d\'épaules. Tire la barre vers le haut de la poitrine en sortant le sternum, coudes vers le bas et l\'arrière.',
  },
  {
    id: 'cable_row_unilateral', name: 'Rowing câble unilatéral',
    equipmentOptions: [['Câble poulie basse'],['Station câbles double']],
    muscles: { primary: ['Dos'], secondary: ['Biceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Un bras à la fois, buste stable. Laisse l\'omoplate s\'étirer vers l\'avant en fin de retour, puis tire en la ramenant vers la colonne. Ne pivote pas le buste pour aller plus loin.',
  },

  // ÉPAULES
  {
    id: 'reverse_fly_machine', name: 'Oiseau machine (pec deck inversé)',
    equipmentOptions: [['Pec deck']],
    muscles: { primary: ['Épaules'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Poitrine contre le dossier, bras quasi tendus. Écarte vers l\'arrière en pensant à écarter les COUDES, pas les mains ; garde les épaules basses.',
  },

  // ABDOMINAUX
  {
    id: 'l_sit', name: 'L-sit',
    equipmentOptions: [['Barres parallèles'],['Captain chair']],
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'compound', block: 'C', objectives: ['strength'],
    level: ['advanced'], failureAllowed: true,
    cue: 'Aux barres parallèles, bras tendus, épaules basses. Décolle le bassin et tends les jambes à l\'horizontale, puis tiens la position.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // NOUVEAUX EXERCICES — GAINAGE / FONCTIONNEL / MÉTABOLIQUE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'hollow_body_hold', name: 'Hollow body hold',
    equipmentOptions: [[]],
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Bas du dos plaqué au sol, épaules et jambes décollées. Cherche la position où le dos reste collé : si tu sens un creux lombaire, remonte les jambes.',
  },
  {
    id: 'copenhagen_plank', name: 'Copenhagen plank',
    equipmentOptions: [[]],
    muscles: { primary: ['Adducteurs'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'En gainage latéral, jambe du dessus posée sur un support. Monte le bassin en poussant sur l\'intérieur de la cuisse posée. Commence genou plié, c\'est très intense pour les adducteurs.',
  },
  {
    id: 'pistol_squat', name: 'Pistol squat',
    equipmentOptions: [[]],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers','Mollets','Abdominaux'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['advanced'], failureAllowed: true,
    cue: 'Squat sur une jambe, l\'autre tendue devant. Tends les bras devant toi pour l\'équilibre, contrôle la descente.',
  },
  {
    id: 'ab_wheel_rollout', name: 'Roulette abdominale',
    equipmentOptions: [['Roulette abdominale']],
    muscles: { primary: ['Abdominaux'], secondary: ['Épaules','Dos'] },
    type: 'compound', block: 'C', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'À genoux, déroule la roulette vers l\'avant en gardant le bas du dos plat. Ne va que jusqu\'où tu peux revenir sans creuser.',
  },
  {
    id: 'burpees', name: 'Burpees',
    equipmentOptions: [[]],
    muscles: { primary: ['Quadriceps','Pectoraux','Épaules'], secondary: ['Fessiers','Abdominaux','Triceps'] },
    type: 'compound', block: 'B', objectives: ['endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Enchaîne squat, mains au sol, jambes en arrière, pompe, retour des jambes, saut. Garde le dos gainé au moment de la pompe : c\'est la fatigue qui fait creuser les lombaires.',
  },
  {
    id: 'mountain_climbers', name: 'Mountain climbers',
    equipmentOptions: [[]],
    muscles: { primary: ['Abdominaux'], secondary: ['Épaules','Quadriceps','Fessiers'] },
    type: 'compound', block: 'C', objectives: ['endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Position de pompe, bassin stable. Ramène les genoux vers la poitrine en alternant, sans laisser les hanches monter ni s\'affaisser.',
  },
  {
    id: 'thruster_dumbbell', name: 'Thruster haltères',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Quadriceps','Épaules','Fessiers'], secondary: ['Triceps','Abdominaux','Ischio-jambiers'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy','endurance'],
    level: ['intermediate','advanced'], failureAllowed: false,
    cue: 'Haltères sur les épaules, squat complet, puis la remontée enchaîne directement sur le développé — un seul mouvement fluide. Ne va pas à l\'échec avec une charge au-dessus de la tête.',
  },
  {
    id: 'renegade_row', name: 'Renegade row',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Dos','Abdominaux'], secondary: ['Épaules','Biceps'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Position de pompe, une main sur chaque haltère, pieds écartés pour la stabilité. Tire un haltère vers la hanche sans laisser le bassin pivoter.',
  },
  {
    id: 'farmers_carry', name: 'Marche du fermier',
    equipmentOptions: [['Haltères'],['Kettlebell'],['Barre olympique']],
    muscles: { primary: ['Avant-bras','Trapèzes','Abdominaux'], secondary: ['Épaules','Quadriceps','Mollets'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Haltères le long du corps, épaules basses et en arrière, buste droit. Marche à pas réguliers en gainant ; le poids ne doit pas te faire pencher d\'un côté.',
  },
  {
    id: 'jump_rope', name: 'Corde à sauter',
    equipmentOptions: [['Corde à sauter']],
    muscles: { primary: ['Mollets'], secondary: ['Épaules','Abdominaux'] },
    type: 'compound', block: 'C', objectives: ['endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Sauts bas et rapides sur l\'avant du pied, genoux souples. La corde est tournée par les POIGNETS, pas par les épaules.',
  },
  {
    id: 'box_jump', name: 'Box jump',
    equipmentOptions: [['Boîte pliométrique']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Mollets','Ischio-jambiers'] },
    type: 'compound', block: 'A', objectives: ['strength','endurance'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Saute et réceptionne en amorti, pieds à plat sur la boîte. REDESCENDS EN MARCHANT — ne saute pas depuis la boîte, c\'est là que le tendon d\'Achille lâche.',
  },
  {
    id: 'wall_sit', name: 'Wall sit',
    equipmentOptions: [[]],
    muscles: { primary: ['Quadriceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Dos plaqué au mur, cuisses parallèles au sol, genoux à 90° à l\'aplomb des chevilles. Tiens la position sans poser les mains sur les cuisses.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // NOUVEAUX EXERCICES — POULIE / CÂBLE
  // ══════════════════════════════════════════════════════════════════════════
    {
    id: 'bayesian_curl', name: 'Curl câble bayésien',
    equipmentOptions: [['Câble poulie basse']],
    muscles: { primary: ['Biceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Dos à la poulie basse, bras légèrement en ARRIÈRE du corps. Cette position étire le biceps et place la tension maximale en bas : c\'est tout l\'intérêt de la variante.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // NOUVEAUX EXERCICES — DOS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'seal_row', name: 'Seal row',
    equipmentOptions: [['Barre olympique','Banc plat'],['Haltères','Banc plat']],
    muscles: { primary: ['Dos'], secondary: ['Biceps','Arrière épaule'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','strength'],
    level: ['intermediate','advanced'], failureAllowed: true,
    cue: 'Allongé sur le ventre sur un banc surélevé, bras pendants. Tire la barre vers le banc : le buste ne pouvant pas bouger, aucune triche n\'est possible.',
  },
  {
    id: 'rack_pull', name: 'Rack pull',
    equipmentOptions: [['Barre olympique','Rack squat'],['Barre olympique','Rack demi-cage']],
    muscles: { primary: ['Dos','Ischio-jambiers','Fessiers'], secondary: ['Avant-bras','Trapèzes'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: false,
    cue: 'Barre calée dans le rack au niveau des genoux ou juste en dessous. Dos plat, tire en poussant le sol. La charge est lourde : la moindre rondeur lombaire se paie.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // NOUVEAUX EXERCICES — TRICEPS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'jm_press', name: 'JM press',
    equipmentOptions: [['Barre olympique','Banc plat'],['Barre EZ','Banc plat']],
    muscles: { primary: ['Triceps'], secondary: ['Épaules'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: false,
    cue: 'À mi-chemin entre le développé serré et le skull crusher : descends la barre vers le haut de la poitrine en laissant les coudes avancer. Charge modérée, très exigeant pour les coudes.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // NOUVEAUX EXERCICES — QUADRICEPS / FULL BODY
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'front_squat_barbell', name: 'Front squat barre',
    equipmentOptions: [['Barre olympique','Rack squat'],['Barre olympique','Rack demi-cage']],
    muscles: { primary: ['Quadriceps'], secondary: ['Fessiers','Abdominaux','Dos'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: false,
    cue: 'Barre sur les deltoïdes avant, coudes hauts. Le buste reste droit — c\'est ce qui cible les quadriceps.',
  },
  {
    id: 'trap_bar_deadlift', name: 'Soulevé de terre trap bar',
    equipmentOptions: [['Trap bar']],
    muscles: { primary: ['Quadriceps','Fessiers','Dos'], secondary: ['Ischio-jambiers','Avant-bras','Trapèzes'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: false,
    cue: 'Debout au centre de la trap bar, poignées sur les côtés. Dos plat, pousse le sol avec les jambes. Plus tolérant pour les lombaires que la barre droite, mais ne va pas à l\'échec.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // AJOUTS — exercices requis par les programmes pré-générés (2026-07)
  // (mouvements non couverts par la base existante : écarté incliné, pompes
  //  piquées, extension triceps élastique, fentes alternées au poids du corps)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'incline_fly_dumbbell', name: 'Écarté incliné haltères',
    equipmentOptions: [['Haltères','Banc réglable']],
    muscles: { primary: ['Poitrine'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Bras légèrement fléchis, angle fixe du début à la fin. Ouvre jusqu\'à l\'étirement, referme sans laisser les haltères se toucher.',
  },
  {
    id: 'pike_pushup', name: 'Pompes piquées',
    equipmentOptions: [[]],
    muscles: { primary: ['Épaules'], secondary: ['Triceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate'], failureAllowed: true,
    cue: 'Pompe en position pliée, bassin haut, mains sous les épaules. Descends le sommet du crâne vers le sol — c\'est la marche avant le handstand push-up.',
  },
  {
    id: 'triceps_extension_band', name: 'Extension triceps élastique',
    equipmentOptions: [['Élastiques de résistance']],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    cue: 'Élastique fixé en hauteur, coudes fixes le long du corps. Tends les bras vers le bas et contrôle le retour.',
  },
  {
    id: 'lunge_bodyweight', name: 'Fentes alternées',
    equipmentOptions: [[]],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate'], failureAllowed: true,
    cue: 'Grand pas en avant, genou arrière vers le sol, buste vertical. Pousse sur le talon avant pour revenir, puis alterne. Le genou avant reste au-dessus du pied.',
  },

  // ══ DÉBUT bloc généré : replis sans matériel ══
  // Exercices de repli, générés par program-data/gen-integration.mjs à partir des
  // substitutions validées (program-data/substitutions-*.csv). NE PAS ÉDITER À LA
  // MAIN : relancer le script.
  // Aucun n'exige de matériel — le sac lesté, une chaise ou un lit ne sont pas du
  // matériel suivi, ils vivent dans la consigne. Un repli existe donc toujours,
  // quelle que soit la configuration déclarée.
  // Le drapeau fallback les réserve à ce rôle : comme ils ne demandent rien, ils
  // seraient sinon éligibles partout, et un utilisateur en salle pourrait se voir
  // proposer un « curl avec sac ». Les sélections normales les placent en dernier
  // et ne les retiennent que si plus rien d'autre n'est faisable.
  // (RETIRÉ) « Crunch bras tendus au-dessus de la tête ». Ce n'était pas un
  // exercice mais un crunch avec les bras tendus — un RÉGLAGE de difficulté du
  // crunch au sol. Le garder comme entrée distincte permettait de le voir tomber
  // dans la même séance que le crunch normal, comme s'il s'agissait de deux
  // mouvements. Le réglage vit désormais dans les consignes du crunch au sol
  // (src/lib/bodyweight-adjust.js). Sa seule autre référence était la
  // substitution de « Roulette abdominale », repointée sur « Crunch au sol ».
  {
    id: 'l_sit_au_sol', name: 'L-sit au sol',
    equipmentOptions: [[]],
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'compound', block: 'C', objectives: ['strength'],
    level: ['advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Assis au sol, mains à plat de chaque côté des hanches, décolle le bassin et tends les jambes à l\'horizontale. Garde la position.',
  },
  {
    id: 'releves_de_jambes_au_sol', name: 'Relevés de jambes au sol',
    equipmentOptions: [[]],
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['strength','hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Allongé sur le dos, mains sous les fesses, monte les jambes tendues sans décoller le bas du dos. Trop facile ? Serre un sac chargé entre les pieds.',
  },
  {
    id: 'abduction_de_hanche_allonge_sur_le_cote', name: 'Abduction de hanche allongé sur le côté',
    equipmentOptions: [[]],
    muscles: { primary: ['Abducteurs'], secondary: ['Fessiers'] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Allongé sur le côté, monte la jambe du dessus tendue, contrôle la descente. Trop facile ? Pose un sac chargé sur la cuisse.',
  },
  {
    id: 'curl_avec_sac', name: 'Curl avec sac',
    equipmentOptions: [[]],
    muscles: { primary: ['Biceps'], secondary: ['Avant-bras'] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Prends un sac par les poignées, paumes vers le haut (supination), et remplis-le au poids voulu. Coudes fixes le long du corps.',
  },
  {
    id: 'curl_avec_sac_alterne', name: 'Curl avec sac alterné',
    equipmentOptions: [[]],
    muscles: { primary: ['Biceps'], secondary: ['Avant-bras'] },
    type: 'isolation', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Un sac dans chaque main en supination, un bras après l\'autre. Coudes fixes le long du corps.',
  },
  {
    id: 'curl_incline_sur_chaise_avec_sac', name: 'Curl incliné sur chaise avec sac',
    equipmentOptions: [[]],
    muscles: { primary: ['Biceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Assis au bord de la chaise, haut du dos contre le dossier, bras qui pendent le long du dossier. Curl en gardant les coudes en arrière — c\'est cet étirement qui fait l\'exercice.',
  },
  {
    id: 'curl_marteau_avec_sac', name: 'Curl marteau avec sac',
    equipmentOptions: [[]],
    muscles: { primary: ['Biceps','Avant-bras'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Prends le sac par les poignées, pouces vers le haut (prise neutre), et remplis-le au poids voulu.',
  },
  {
    id: 'pullover_avec_sac', name: 'Pullover avec sac',
    equipmentOptions: [[]],
    muscles: { primary: ['Dos'], secondary: ['Pectoraux','Triceps','Abdominaux'] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Allongé en travers d\'un lit ou d\'une chaise, tout le dos en appui. Un sac tenu à deux mains, bras légèrement fléchis (15-20°) et cet angle ne bouge plus. Descends jusqu\'à sentir l\'étirement des dorsaux, puis ramène les coudes vers les hanches — ne pousse pas avec les bras. Arrête la montée quand les bras sont au-dessus de la poitrine.',
  },
  {
    id: 'rowing_avec_sac', name: 'Rowing avec sac',
    equipmentOptions: [[]],
    muscles: { primary: ['Dos'], secondary: ['Biceps','Épaules'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Buste penché à environ 45°, dos plat, un sac chargé dans chaque main. Tire les coudes vers les hanches.',
  },
  {
    id: 'rowing_bucheron_avec_sac', name: 'Rowing bûcheron avec sac',
    equipmentOptions: [[]],
    muscles: { primary: ['Dos'], secondary: ['Biceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Un genou et une main en appui sur une chaise, l\'autre main tient le sac. Tire le coude le long du corps, sans tourner le buste.',
  },
  {
    id: 'rowing_unilateral_avec_sac', name: 'Rowing unilatéral avec sac',
    equipmentOptions: [[]],
    muscles: { primary: ['Dos'], secondary: ['Biceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Buste penché, une main en appui, l\'autre tient le sac. Tire le coude vers la hanche.',
  },
  {
    id: 'traction_pronation_barre_de_fortune', name: 'Traction pronation (barre de fortune)',
    equipmentOptions: [[]],
    muscles: { primary: ['Dos'], secondary: ['Biceps','Épaules'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Une barre solide suffit : dessous d\'escalier, barre de but, structure fixe. Paumes vers l\'avant. Débutant : pose un pied sur une chaise pour t\'aider, et retire de l\'aide au fil des semaines. Avancé : sac à dos chargé. Évite les huisseries de porte, elles ne sont pas prévues pour supporter un corps.',
  },
  {
    id: 'traction_supination_barre_de_fortune', name: 'Traction supination (barre de fortune)',
    equipmentOptions: [[]],
    muscles: { primary: ['Dos','Biceps'], secondary: ['Épaules'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Même chose en prise supination, paumes vers toi — les biceps travaillent davantage. Débutant : un pied sur une chaise pour t\'aider. Évite les huisseries de porte.',
  },
  {
    id: 'souleve_de_terre_avec_sac', name: 'Soulevé de terre avec sac',
    equipmentOptions: [[]],
    muscles: { primary: ['Dos','Ischio-jambiers','Fessiers'], secondary: ['Quadriceps','Mollets'] },
    type: 'compound', block: 'A', objectives: ['strength'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Un sac chargé dans chaque main, le long des jambes. Dos plat, pousse dans le sol avec les jambes et termine hanches tendues.',
  },
  {
    id: 'elevations_laterales_avec_sac_ou_bouteilles', name: 'Élévations latérales avec sac ou bouteilles',
    equipmentOptions: [[]],
    muscles: { primary: ['Épaules'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Une bouteille d\'eau dans chaque main suffit — la charge utile est faible sur cet exercice. Monte les bras sur les côtés jusqu\'à l\'horizontale, coudes légèrement fléchis. Un sac tenu par la poignée quand les bouteilles deviennent trop légères.',
  },
  {
    id: 'handstand_push_up_contre_un_mur', name: 'Handstand push-up contre un mur',
    equipmentOptions: [[]],
    muscles: { primary: ['Épaules'], secondary: ['Triceps'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['advanced'], failureAllowed: true,
    fallback: true,
    cue: 'En équilibre sur les mains, dos ou ventre au mur selon ce que tu maîtrises. Descends la tête vers le sol et repousse. À ne tenter qu\'une fois l\'équilibre au mur maîtrisé.',
  },
  {
    id: 'face_pull_avec_sac', name: 'Face pull avec sac',
    equipmentOptions: [[]],
    muscles: { primary: ['Épaules','Dos'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Buste penché en avant, un sac tenu à deux mains. Tire vers le visage en gardant les coudes hauts, écarte les mains en fin de mouvement.',
  },
  {
    id: 'oiseau_avec_sac_ou_bouteilles', name: 'Oiseau avec sac ou bouteilles',
    equipmentOptions: [[]],
    muscles: { primary: ['Épaules','Dos'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Buste penché, bras tendus vers le sol, une bouteille ou un sac dans chaque main. Ouvre les bras sur les côtés sans hausser les épaules.',
  },
  {
    id: 'pont_fessier_avec_sac_ou_unilateral', name: 'Pont fessier avec sac ou unilatéral',
    equipmentOptions: [[]],
    muscles: { primary: ['Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Allongé sur le dos, pieds au sol, monte le bassin en serrant les fessiers. Pose un sac chargé sur les hanches, ou fais-le sur une seule jambe pour durcir.',
  },
  {
    id: 'leg_curl_au_sol_avec_sac', name: 'Leg curl au sol avec sac',
    equipmentOptions: [[]],
    muscles: { primary: ['Ischio-jambiers'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'À plat ventre, serre un sac chargé entre les pieds et ramène les talons vers les fesses.',
  },
  {
    id: 'good_morning_avec_sac', name: 'Good morning avec sac',
    equipmentOptions: [[]],
    muscles: { primary: ['Ischio-jambiers','Dos'], secondary: ['Fessiers'] },
    type: 'compound', block: 'B', objectives: ['strength'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Un sac chargé sur le haut du dos, dos plat, genoux légèrement fléchis. Pousse les hanches vers l\'arrière jusqu\'à sentir l\'étirement des ischios, puis reviens.',
  },
  {
    id: 'souleve_de_terre_roumain_avec_sac', name: 'Soulevé de terre roumain avec sac',
    equipmentOptions: [[]],
    muscles: { primary: ['Ischio-jambiers','Fessiers'], secondary: ['Dos'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Un sac chargé dans chaque main. Jambes quasi tendues, pousse les hanches vers l\'arrière en gardant le dos plat. Descends jusqu\'à l\'étirement des ischios, pas plus bas.',
  },
  {
    id: 'mollets_assis_avec_sac', name: 'Mollets assis avec sac',
    equipmentOptions: [[]],
    muscles: { primary: ['Mollets'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Assis sur une chaise, genoux fléchis à 90°, un sac chargé posé sur les cuisses juste au-dessus des genoux. Monte les talons le plus haut possible, descends en étirement complet. Genou fléchi = c\'est le soléaire qui travaille, pas les jumeaux.',
  },
  {
    id: 'mollets_unilateraux_avec_sac', name: 'Mollets unilatéraux avec sac',
    equipmentOptions: [[]],
    muscles: { primary: ['Mollets'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Sur une jambe, avant-pied sur une marche, monte le plus haut possible et contrôle la descente. Sac à dos chargé pour durcir.',
  },
  {
    id: 'dips_entre_deux_chaises_buste_penche', name: 'Dips entre deux chaises (buste penché)',
    equipmentOptions: [[]],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Mains sur deux chaises stables, buste penché en avant pour cibler les pectoraux. Pieds éloignés ou surélevés pour durcir, sac à dos chargé ensuite. Vérifie que les chaises ne peuvent pas glisser.',
  },
  {
    id: 'pompe_large', name: 'Pompe large',
    equipmentOptions: [[]],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Pompe mains nettement plus larges que les épaules : l\'amplitude se fait davantage sur les pectoraux. Sac à dos chargé si c\'est trop simple.',
  },
  {
    id: 'pompe_large_pieds_sureleves_chaise', name: 'Pompe large pieds surélevés (chaise)',
    equipmentOptions: [[]],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Pompe large avec les pieds sur une chaise — plus les pieds sont hauts, plus le haut des pectoraux travaille. Sac à dos chargé ensuite.',
  },
  {
    id: 'pompe_pieds_sureleves_chaise', name: 'Pompe pieds surélevés (chaise)',
    equipmentOptions: [[]],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','strength'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Pompe classique avec les pieds sur une chaise. Sac à dos chargé si c\'est trop simple.',
  },
  {
    id: 'front_squat_avec_sac', name: 'Front squat avec sac',
    equipmentOptions: [[]],
    muscles: { primary: ['Quadriceps'], secondary: ['Fessiers','Abdominaux','Dos'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Un sac chargé tenu contre la poitrine, coudes hauts. Descends en gardant le buste droit.',
  },
  {
    id: 'leg_extension_assis_avec_sac', name: 'Leg extension assis avec sac',
    equipmentOptions: [[]],
    muscles: { primary: ['Quadriceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Assis sur une chaise, un sac chargé accroché aux pieds ou posé sur les chevilles. Tends les jambes, contrôle la descente.',
  },
  {
    id: 'fente_bulgare_chaise', name: 'Fente bulgare (chaise)',
    equipmentOptions: [[]],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Pied arrière posé sur une chaise, descends sur la jambe avant. Sac à dos chargé, ou un sac dans chaque main, pour ajouter du poids.',
  },
  {
    id: 'fente_marchee_avec_sac', name: 'Fente marchée avec sac',
    equipmentOptions: [[]],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Sac à dos chargé, avance en fentes en alternant les jambes. Genou arrière proche du sol sans le toucher.',
  },
  {
    id: 'squat_avec_sac', name: 'Squat avec sac',
    equipmentOptions: [[]],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers','Mollets','Dos'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Sac à dos chargé sur le dos, ou tenu contre la poitrine. Descends au moins jusqu\'aux cuisses parallèles, dos plat.',
  },
  {
    id: 'dips_entre_deux_chaises_buste_droit', name: 'Dips entre deux chaises (buste droit)',
    equipmentOptions: [[]],
    muscles: { primary: ['Triceps'], secondary: ['Épaules'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Mains sur deux chaises stables, buste droit et coudes serrés pour cibler les triceps. Pieds éloignés ou surélevés pour durcir, sac à dos chargé ensuite. Vérifie que les chaises ne peuvent pas glisser.',
  },
  {
    id: 'extension_triceps_avec_sac', name: 'Extension triceps avec sac',
    equipmentOptions: [[]],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Un sac chargé tenu à deux mains derrière la nuque, coudes hauts et fixes. Tends les bras vers le haut.',
  },
  {
    id: 'kickback_triceps_avec_sac', name: 'Kickback triceps avec sac',
    equipmentOptions: [[]],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Buste penché en avant, coude fixé le long du corps, bras replié. Tends l\'avant-bras vers l\'arrière jusqu\'à verrouiller le coude et marque un temps — c\'est en fin de course que le triceps travaille le plus sur ce mouvement. Un sac par la poignée dans chaque main, ou une main après l\'autre en appui sur une chaise.',
  },
  {
    id: 'skull_crusher_avec_sac', name: 'Skull crusher avec sac',
    equipmentOptions: [[]],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Allongé au bord d\'un lit ou d\'une chaise, sac chargé tenu à deux mains. Coudes fixes, descends le sac vers le front.',
  },
  {
    id: 'tirage_australien', name: 'Tirage australien',
    equipmentOptions: [[]],
    muscles: { primary: ['Dos'], secondary: ['Biceps','Épaules'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner'], failureAllowed: true,
    fallback: true,
    cue: 'Sous une table solide ou une barre basse, corps incliné et pieds au sol. Plus les pieds sont loin, plus c\'est dur.',
  },
  // ══ FIN bloc généré ══
];

// ─────────────────────────────────────────────────────────────────────────────
// PROFILS DE TENSION
// stretch = muscle maximalement chargé en position étirée (lengthened)
// peak    = muscle maximalement chargé au pic de contraction (shortened)
// neutral = tension relativement uniforme / isométrique
// ─────────────────────────────────────────────────────────────────────────────
export const TENSION_PROFILES = {
  // POITRINE
  bench_press_barbell:      'neutral',
  bench_press_dumbbell:     'stretch',
  incline_press_barbell:    'neutral',
  incline_press_dumbbell:   'stretch',
  decline_press_dumbbell:   'stretch',
  bench_press_machine:      'peak',
  incline_press_machine:    'peak',
  pec_deck:                 'peak',
  cable_crossover:          'peak',
  cable_fly_low:            'stretch',
  cable_fly_high:           'peak',
  dumbbell_fly:             'stretch',
  pushup:                   'stretch',
  pushup_elevated:          'stretch',
  dips_chest:               'stretch',
  bench_smith:              'neutral',

  // DOS
  pullup:                   'stretch',
  chinup:                   'stretch',
  trx_row:                  'peak',
  lat_pulldown_wide:        'stretch',
  barbell_row:              'peak',
  dumbbell_row:             'peak',
  cable_row:                'peak',
  machine_row:              'peak',
  tbar_row:                 'peak',
  pullover_dumbbell:        'stretch',
  face_pull:                'peak',
  straight_arm_pulldown:    'peak',
  deadlift:                 'stretch',
  hyperextension:           'stretch',
  good_morning:             'stretch',
  barbell_row_supinated:    'peak',
  lat_pulldown_supinated:   'stretch',
  cable_row_unilateral:     'peak',
  seal_row:                 'peak',
  rack_pull:                'neutral',
  pullover_cable:           'stretch',

  // ÉPAULES
  ohp_barbell:              'stretch',
  ohp_dumbbell:             'stretch',
  ohp_machine:              'stretch',
  lateral_raise_dumbbell:   'peak',
  lateral_raise_cable:      'stretch',
  front_raise_dumbbell:     'peak',
  rear_delt_fly:            'stretch',
  shrug_barbell:            'peak',
  shrug_dumbbell:           'peak',
  upright_row:              'peak',
  reverse_fly_machine:      'stretch',

  // BICEPS
  curl_barbell:             'neutral',
  curl_ez:                  'neutral',
  curl_dumbbell:            'neutral',
  hammer_curl:              'neutral',
  concentration_curl:       'peak',
  incline_curl:             'stretch',
  curl_machine:             'peak',
  preacher_curl:            'stretch',
  cable_curl_low:           'stretch',
  cable_curl_high:          'peak',
  reverse_curl_ez:          'neutral',
  zottman_curl:             'neutral',
  bayesian_curl:            'stretch',

  // TRICEPS
  close_grip_bench:         'peak',
  skull_crusher_ez:         'stretch',
  skull_crusher_dumbbell:   'stretch',
  triceps_pushdown_rope:    'peak',
  triceps_pushdown_bar:     'peak',
  triceps_cable_low:        'stretch',
  kickback:                 'peak',
  overhead_ext_dumbbell:    'stretch',
  overhead_ext_unilateral:  'stretch',
  triceps_machine:          'peak',
  dips_triceps_machine:     'peak',
  diamond_pushup:           'peak',
  french_press_ez:          'stretch',
  jm_press:                 'peak',

  // QUADRICEPS
  squat_barbell:            'stretch',
  squat_dumbbell:           'stretch',
  goblet_squat:             'stretch',
  squat_bodyweight:         'stretch',
  leg_press:                'stretch',
  hack_squat:               'stretch',
  leg_extension:            'peak',
  lunge_barbell:            'stretch',
  lunge_dumbbell:           'stretch',
  bulgarian_split_squat:    'stretch',
  squat_smith:              'stretch',
  walking_lunge:            'stretch',
  step_up:                  'stretch',
  front_squat_barbell:      'stretch',
  pistol_squat:             'stretch',
  belt_squat:               'stretch',

  // ISCHIO-JAMBIERS & FESSIERS
  rdl_barbell:              'stretch',
  rdl_dumbbell:             'stretch',
  leg_curl_lying:           'peak',
  leg_curl_seated:          'stretch',
  hip_thrust_barbell:       'peak',
  hip_thrust_machine:       'peak',
  hip_thrust_dumbbell:      'peak',
  glute_kickback_cable:     'peak',
  fessier_machine:          'peak',
  glute_bridge:             'peak',
  nordic_curl:              'stretch',
  kettlebell_swing:         'stretch',
  trap_bar_deadlift:        'stretch',

  // ADDUCTEURS & ABDUCTEURS
  abductor_machine:         'peak',
  adductor_machine:         'peak',
  sumo_squat:               'stretch',
  miniband_abduction:       'peak',
  copenhagen_plank:         'neutral',

  // MOLLETS
  calf_raise_machine:       'stretch',
  seated_calf_raise:        'stretch',
  leg_press_calf:           'stretch',
  calf_raise_barbell:       'stretch',
  calf_raise_dumbbell:      'stretch',
  calf_raise_bodyweight:    'stretch',

  // ABDOS & CORE
  crunch_machine:           'peak',
  rotation_machine:         'peak',
  hanging_leg_raise:        'stretch',
  captain_chair:            'stretch',
  cable_crunch:             'peak',
  plank:                    'neutral',
  side_plank:               'neutral',
  russian_twist:            'peak',
  crunch:                   'peak',
  swiss_ball_crunch:        'stretch',
  pallof_press:             'neutral',
  dead_bug:                 'neutral',
  dragon_flag:              'stretch',
  hollow_body_hold:         'neutral',
  l_sit:                    'neutral',
  ab_wheel_rollout:         'stretch',

  // FONCTIONNEL / MÉTABOLIQUE
  burpees:                  'neutral',
  mountain_climbers:        'neutral',
  thruster_dumbbell:        'stretch',
  renegade_row:             'peak',
  farmers_carry:            'neutral',
  jump_rope:                'neutral',
  box_jump:                 'stretch',
  wall_sit:                 'neutral',

  // DIVERS
  wrist_curl:               'peak',
};

export function getTensionProfile(exerciseId) {
  return TENSION_PROFILES[exerciseId] || 'neutral';
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Vérifie si l'utilisateur a tout l'équipement d'au moins une option
export function isExerciseAvailable(exercise, userEquipment = []) {
  return exercise.equipmentOptions.some(option =>
    option.length === 0 // bodyweight — toujours disponible
      ? true
      : option.every(eq => userEquipment.includes(eq))
  );
}

// Retourne les exercices disponibles pour un muscle donné
export function getExercisesForMuscle(muscleName, userEquipment = [], filters = {}) {
  const { objectives = [], level = 'intermediate', block = null } = filters;

  return EXERCISES.filter(ex => {
    if (!ex.muscles.primary.includes(muscleName) && !ex.muscles.secondary.includes(muscleName)) return false;
    if (!isExerciseAvailable(ex, userEquipment)) return false;
    if (objectives.length && !ex.objectives.some(o => objectives.includes(o))) return false;
    if (!ex.level.includes(level)) return false;
    if (block && ex.block !== block) return false;
    return true;
  });
}

// Retourne les exercices disponibles filtrés par équipement + objectif + niveau
export function getAvailableExercises(userEquipment = [], objectives = [], level = 'intermediate') {
  return EXERCISES.filter(ex =>
    isExerciseAvailable(ex, userEquipment) &&
    ex.level.includes(level) &&
    (objectives.length === 0 || ex.objectives.some(o => objectives.includes(o)))
  );
}

// Sélectionne les meilleurs exercices pour une séance (par muscle, bloc A→B→C)
export function selectSessionExercises({ muscles = [], userEquipment = [], objectives = [], level = 'intermediate', maxExercises = 5, disliked = [] }) {
  const selected = [];

  for (const muscle of muscles) {
    for (const block of ['A', 'B', 'C']) {
      const candidates = getExercisesForMuscle(muscle, userEquipment, { objectives, level, block })
        .filter(ex => !disliked.includes(ex.name) && !selected.find(s => s.id === ex.id));

      if (candidates.length > 0) {
        selected.push(candidates[0]);
        if (selected.length >= maxExercises) return selected;
        break;
      }
    }
  }

  return selected;
}

// Stats de la base
export const DB_STATS = {
  total: EXERCISES.length,
  byMuscle: [...new Set(EXERCISES.flatMap(e => e.muscles.primary))].reduce((acc, m) => {
    acc[m] = EXERCISES.filter(e => e.muscles.primary.includes(m)).length;
    return acc;
  }, {}),
  bodyweightCount: EXERCISES.filter(e => e.equipmentOptions.some(o => o.length === 0)).length,
};
