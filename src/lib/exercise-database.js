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
  },
  {
    id: 'bench_press_dumbbell', name: 'Développé couché haltères',
    equipmentOptions: [['Haltères','Banc plat']],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'A', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'incline_press_barbell', name: 'Développé incliné barre',
    equipmentOptions: [['Barre olympique','Banc réglable']],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: false,
  },
  {
    id: 'incline_press_dumbbell', name: 'Développé incliné haltères',
    equipmentOptions: [['Haltères','Banc réglable']],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'decline_press_dumbbell', name: 'Développé décliné haltères',
    equipmentOptions: [['Haltères','Banc décliné']],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'bench_press_machine', name: 'Développé couché machine',
    equipmentOptions: [['Développé couché machine']],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'incline_press_machine', name: 'Développé incliné machine',
    equipmentOptions: [['Développé incliné machine']],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'pec_deck', name: 'Pec deck',
    equipmentOptions: [['Pec deck']],
    muscles: { primary: ['Poitrine'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'cable_crossover', name: 'Écarté poulie',
    equipmentOptions: [['Station câbles double']],
    muscles: { primary: ['Poitrine'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'cable_fly_low', name: 'Écarté poulie basse',
    equipmentOptions: [['Câble poulie basse'],['Station câbles double']],
    muscles: { primary: ['Poitrine'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'cable_fly_high', name: 'Écarté poulie haute',
    equipmentOptions: [['Câble poulie haute'],['Station câbles double']],
    muscles: { primary: ['Poitrine'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'dumbbell_fly', name: 'Écarté haltères',
    equipmentOptions: [['Haltères','Banc plat']],
    muscles: { primary: ['Poitrine'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'pushup', name: 'Pompe',
    equipmentOptions: [[]], // bodyweight
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'pushup_elevated', name: 'Pompe pieds surélevés',
    equipmentOptions: [['Banc plat'],['Banc réglable']],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'dips_chest', name: 'Dips (poitrine)',
    equipmentOptions: [['Barres parallèles'],['Barre de dips']],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'bench_smith', name: 'Développé couché Smith',
    equipmentOptions: [['Smith machine','Banc plat']],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: false,
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
  },
  {
    id: 'chinup', name: 'Traction supination (chin-up)',
    equipmentOptions: [['Barre de traction']],
    muscles: { primary: ['Dos','Biceps'], secondary: ['Épaules'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'trx_row', name: 'Rowing TRX',
    equipmentOptions: [['Sangles TRX']],
    muscles: { primary: ['Dos'], secondary: ['Biceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate'], failureAllowed: true,
  },
  {
    id: 'lat_pulldown_wide', name: 'Tirage vertical pronation',
    equipmentOptions: [['Tirage vertical'],['Câble poulie haute']],
    muscles: { primary: ['Dos'], secondary: ['Biceps'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'barbell_row', name: 'Rowing barre',
    equipmentOptions: [['Barre olympique']],
    muscles: { primary: ['Dos'], secondary: ['Biceps','Épaules'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: false,
  },
  {
    id: 'dumbbell_row', name: 'Rowing haltère unilatéral',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Dos'], secondary: ['Biceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'cable_row', name: 'Rowing assis câble',
    equipmentOptions: [['Rowing assis machine']],
    muscles: { primary: ['Dos'], secondary: ['Biceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'machine_row', name: 'Rowing horizontal machine',
    equipmentOptions: [['Rowing horizontal machine']],
    muscles: { primary: ['Dos'], secondary: ['Biceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'tbar_row', name: 'Rowing T-bar',
    equipmentOptions: [['Rowing T-bar machine'],['Barre olympique']],
    muscles: { primary: ['Dos'], secondary: ['Biceps'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'pullover_dumbbell', name: 'Pullover haltère',
    equipmentOptions: [['Haltères','Banc plat']],
    muscles: { primary: ['Dos'], secondary: ['Triceps','Poitrine'] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'face_pull', name: 'Face pull câble',
    equipmentOptions: [['Câble poulie haute'],['Station câbles double']],
    muscles: { primary: ['Épaules','Dos'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'straight_arm_pulldown', name: 'Tirage poulie bras tendus',
    equipmentOptions: [['Câble poulie haute']],
    muscles: { primary: ['Dos'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'deadlift', name: 'Soulevé de terre',
    equipmentOptions: [['Barre olympique']],
    muscles: { primary: ['Dos','Ischio-jambiers','Fessiers'], secondary: ['Quadriceps','Mollets'] },
    type: 'compound', block: 'A', objectives: ['strength'],
    level: ['intermediate','advanced'], failureAllowed: false,
  },
  {
    id: 'hyperextension', name: 'Hyperextension',
    equipmentOptions: [['GHD'],['Chaise romaine']],
    muscles: { primary: ['Dos','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'good_morning', name: 'Good morning',
    equipmentOptions: [['Barre olympique']],
    muscles: { primary: ['Ischio-jambiers','Dos'], secondary: ['Fessiers'] },
    type: 'compound', block: 'B', objectives: ['strength'],
    level: ['advanced'], failureAllowed: false,
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
  },
  {
    id: 'ohp_dumbbell', name: 'Développé militaire haltères',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Épaules'], secondary: ['Triceps'] },
    type: 'compound', block: 'A', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'ohp_machine', name: 'Développé épaules machine',
    equipmentOptions: [['Développé épaules machine']],
    muscles: { primary: ['Épaules'], secondary: ['Triceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'lateral_raise_dumbbell', name: 'Élévations latérales haltères',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Épaules'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'lateral_raise_cable', name: 'Élévations latérales câble',
    equipmentOptions: [['Câble poulie basse'],['Station câbles double']],
    muscles: { primary: ['Épaules'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'front_raise_dumbbell', name: 'Élévations frontales haltères',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Épaules'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'rear_delt_fly', name: 'Oiseau haltères (deltoïde postérieur)',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Épaules','Dos'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'shrug_barbell', name: 'Shrugs barre',
    equipmentOptions: [['Barre olympique']],
    muscles: { primary: ['Épaules'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','strength'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'shrug_dumbbell', name: 'Shrugs haltères',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Épaules'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'upright_row', name: 'Tirage vertical menton barre',
    equipmentOptions: [['Barre olympique'],['Barre EZ'],['Haltères']],
    muscles: { primary: ['Épaules'], secondary: ['Biceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
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
  },
  {
    id: 'curl_ez', name: 'Curl barre EZ',
    equipmentOptions: [['Barre EZ']],
    muscles: { primary: ['Biceps'], secondary: ['Avant-bras'] },
    type: 'isolation', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'curl_dumbbell', name: 'Curl haltères alternés',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Biceps'], secondary: ['Avant-bras'] },
    type: 'isolation', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'hammer_curl', name: 'Curl marteau',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Biceps','Avant-bras'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'concentration_curl', name: 'Curl concentré',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Biceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'incline_curl', name: 'Curl incliné haltères',
    equipmentOptions: [['Haltères','Banc réglable']],
    muscles: { primary: ['Biceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'curl_machine', name: 'Curl biceps machine',
    equipmentOptions: [['Curl biceps machine']],
    muscles: { primary: ['Biceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'preacher_curl', name: 'Preacher curl machine',
    equipmentOptions: [['Preacher curl machine']],
    muscles: { primary: ['Biceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'cable_curl_low', name: 'Curl câble poulie basse',
    equipmentOptions: [['Câble poulie basse'],['Station câbles double']],
    muscles: { primary: ['Biceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'cable_curl_high', name: 'Curl câble poulie haute (spider)',
    equipmentOptions: [['Câble poulie haute'],['Station câbles double']],
    muscles: { primary: ['Biceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
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
  },
  {
    id: 'skull_crusher_ez', name: 'Skull crusher barre EZ',
    equipmentOptions: [['Barre EZ','Banc plat']],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'B', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'skull_crusher_dumbbell', name: 'Skull crusher haltères',
    equipmentOptions: [['Haltères','Banc plat']],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'B', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'triceps_pushdown_rope', name: 'Triceps poulie haute corde',
    equipmentOptions: [['Câble poulie haute'],['Station câbles double']],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'triceps_pushdown_bar', name: 'Triceps câble barre',
    equipmentOptions: [['Câble poulie haute']],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'triceps_cable_low', name: 'Triceps poulie basse',
    equipmentOptions: [['Câble poulie basse']],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'kickback', name: 'Kickback haltères',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'overhead_ext_dumbbell', name: 'Extension triceps haltère bilatérale',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'B', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'overhead_ext_unilateral', name: 'Extension triceps haltère unilatérale',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'triceps_machine', name: 'Triceps machine',
    equipmentOptions: [['Triceps machine']],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'dips_triceps_machine', name: 'Dips triceps machine',
    equipmentOptions: [['Dips triceps machine']],
    muscles: { primary: ['Triceps'], secondary: ['Épaules'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'diamond_pushup', name: 'Pompe diamant',
    equipmentOptions: [[]], // bodyweight
    muscles: { primary: ['Triceps'], secondary: ['Poitrine'] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate'], failureAllowed: true,
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
  },
  {
    id: 'squat_dumbbell', name: 'Squat haltères',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'goblet_squat', name: 'Squat gobelet',
    equipmentOptions: [['Kettlebells'],['Haltères']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'squat_bodyweight', name: 'Squat au poids du corps',
    equipmentOptions: [[]], // bodyweight
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['endurance'],
    level: ['beginner'], failureAllowed: true,
  },
  {
    id: 'leg_press', name: 'Leg press',
    equipmentOptions: [['Leg press']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'hack_squat', name: 'Hack squat machine',
    equipmentOptions: [['Hack squat machine']],
    muscles: { primary: ['Quadriceps'], secondary: ['Fessiers'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'leg_extension', name: 'Leg extension',
    equipmentOptions: [['Leg extension']],
    muscles: { primary: ['Quadriceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'sissy_squat', name: 'Sissy squat',
    equipmentOptions: [[]],
    muscles: { primary: ['Quadriceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'dips_weighted_parallel', name: 'Dips lestés aux barres parallèles',
    equipmentOptions: [['Barres parallèles','Ceinture de lest']],
    muscles: { primary: ['Poitrine'], secondary: ['Triceps','Épaules'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: false,
  },
  {
    id: 'curl_rings', name: 'Curl aux anneaux',
    equipmentOptions: [['Anneaux de gymnaste']],
    muscles: { primary: ['Biceps'], secondary: [] },
    type: 'isolation', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'curl_band', name: 'Curl élastique',
    equipmentOptions: [['Élastiques de résistance']],
    muscles: { primary: ['Biceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'calf_single_weighted', name: 'Mollets lestés une jambe',
    equipmentOptions: [['Gilet lesté']],
    muscles: { primary: ['Mollets'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'lunge_barbell', name: 'Fente avant barre',
    equipmentOptions: [['Barre olympique']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: false,
  },
  {
    id: 'lunge_dumbbell', name: 'Fente avant haltères',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'bulgarian_split_squat', name: 'Fente bulgare haltères',
    equipmentOptions: [['Haltères','Banc réglable'],['Haltères','Banc plat']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'squat_smith', name: 'Squat Smith',
    equipmentOptions: [['Smith machine']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: false,
  },
  {
    id: 'walking_lunge', name: 'Fente marchée haltères',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'belt_squat', name: 'Belt squat',
    equipmentOptions: [['Belt squat machine'],['Ceinture de lest','Rack squat'],['Ceinture de lest','Rack demi-cage']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers','Mollets'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'step_up', name: 'Step-up haltères',
    equipmentOptions: [['Haltères','Banc plat'],['Haltères','Banc réglable']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
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
  },
  {
    id: 'rdl_dumbbell', name: 'Soulevé de terre roumain haltères',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Ischio-jambiers','Fessiers'], secondary: ['Dos'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'leg_curl_lying', name: 'Leg curl allongé',
    equipmentOptions: [['Leg curl allongé']],
    muscles: { primary: ['Ischio-jambiers'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'leg_curl_seated', name: 'Leg curl assis',
    equipmentOptions: [['Leg curl assis']],
    muscles: { primary: ['Ischio-jambiers'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'hip_thrust_barbell', name: 'Hip thrust barre',
    equipmentOptions: [['Barre olympique','Banc plat']],
    muscles: { primary: ['Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'hip_thrust_machine', name: 'Hip thrust machine',
    equipmentOptions: [['Hip thrust machine']],
    muscles: { primary: ['Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'hip_thrust_dumbbell', name: 'Hip thrust haltères',
    equipmentOptions: [['Haltères','Banc plat']],
    muscles: { primary: ['Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'glute_kickback_cable', name: 'Kickback fessier câble',
    equipmentOptions: [['Câble poulie basse']],
    muscles: { primary: ['Fessiers'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'fessier_machine', name: 'Fessier machine',
    equipmentOptions: [['Fessier machine']],
    muscles: { primary: ['Fessiers'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'glute_bridge', name: 'Pont fessier au sol',
    equipmentOptions: [[]], // bodyweight
    muscles: { primary: ['Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'isolation', block: 'C', objectives: ['endurance'],
    level: ['beginner'], failureAllowed: true,
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
  },
  {
    id: 'adductor_machine', name: 'Adducteur machine',
    equipmentOptions: [['Adducteur machine']],
    muscles: { primary: ['Adducteurs'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'sumo_squat', name: 'Squat sumo',
    equipmentOptions: [['Haltères'],['Kettlebells'],['Barre olympique']],
    muscles: { primary: ['Adducteurs','Quadriceps','Fessiers'], secondary: [] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'miniband_abduction', name: 'Abduction mini-bands',
    equipmentOptions: [['Mini-bands']],
    muscles: { primary: ['Abducteurs','Fessiers'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['endurance'],
    level: ['beginner','intermediate'], failureAllowed: true,
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
  },
  {
    id: 'seated_calf_raise', name: 'Mollets assis machine',
    equipmentOptions: [['Mollets assis machine']],
    muscles: { primary: ['Mollets'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'leg_press_calf', name: 'Mollets leg press',
    equipmentOptions: [['Leg press']],
    muscles: { primary: ['Mollets'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'calf_raise_barbell', name: 'Mollets debout barre',
    equipmentOptions: [['Barre olympique']],
    muscles: { primary: ['Mollets'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'calf_raise_dumbbell', name: 'Mollets debout haltères',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Mollets'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'calf_raise_bodyweight', name: 'Mollets unilatéraux poids du corps',
    equipmentOptions: [[]], // bodyweight
    muscles: { primary: ['Mollets'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['endurance'],
    level: ['beginner','intermediate'], failureAllowed: true,
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
  },
  {
    id: 'rotation_machine', name: 'Rotation obliques machine',
    equipmentOptions: [['Rotation obliques machine']],
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'hanging_leg_raise', name: 'Relevés de jambes suspendu',
    equipmentOptions: [['Barre de traction'],['Captain chair']],
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'captain_chair', name: 'Captain chair relevés genoux',
    equipmentOptions: [['Captain chair']],
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'cable_crunch', name: 'Crunch câble',
    equipmentOptions: [['Câble poulie haute']],
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'plank', name: 'Planche',
    equipmentOptions: [[]], // bodyweight
    muscles: { primary: ['Abdominaux'], secondary: ['Dos','Épaules'] },
    type: 'compound', block: 'C', objectives: ['endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'side_plank', name: 'Gainage latéral',
    equipmentOptions: [[]], // bodyweight
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'russian_twist', name: 'Russian twist',
    equipmentOptions: [['Medicine ball'],['Haltères'],[]],
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'crunch', name: 'Crunch au sol',
    equipmentOptions: [[]], // bodyweight
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'swiss_ball_crunch', name: 'Crunch Swiss ball',
    equipmentOptions: [['Swiss ball']],
    muscles: { primary: ['Abdominaux'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate'], failureAllowed: true,
  },
  {
    id: 'pallof_press', name: 'Pallof press câble',
    equipmentOptions: [['Câble poulie haute'],['Câble poulie basse'],['Station câbles double']],
    muscles: { primary: ['Abdominaux'], secondary: ['Dos'] },
    type: 'compound', block: 'C', objectives: ['strength','endurance'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'dead_bug', name: 'Dead bug',
    equipmentOptions: [[]], // bodyweight
    muscles: { primary: ['Abdominaux'], secondary: ['Dos'] },
    type: 'compound', block: 'C', objectives: ['endurance'],
    level: ['beginner','intermediate'], failureAllowed: true,
  },
  {
    id: 'dragon_flag', name: 'Dragon flag',
    equipmentOptions: [['Banc plat']],
    muscles: { primary: ['Abdominaux'], secondary: ['Dos'] },
    type: 'compound', block: 'B', objectives: ['strength'],
    level: ['advanced'], failureAllowed: true,
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
  },
  {
    id: 'kettlebell_swing', name: 'Kettlebell swing',
    equipmentOptions: [['Kettlebells']],
    muscles: { primary: ['Ischio-jambiers','Fessiers'], secondary: ['Dos','Épaules'] },
    type: 'compound', block: 'B', objectives: ['strength','endurance'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },

  // TRICEPS
  {
    id: 'french_press_ez', name: 'French press barre EZ (overhead)',
    equipmentOptions: [['Barre EZ','Banc réglable'],['Barre EZ','Banc plat']],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'B', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },

  // BICEPS / AVANT-BRAS
  {
    id: 'reverse_curl_ez', name: 'Curl inversé barre EZ',
    equipmentOptions: [['Barre EZ'],['Barre olympique']],
    muscles: { primary: ['Avant-bras'], secondary: ['Biceps'] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'zottman_curl', name: 'Curl Zottman',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Biceps','Avant-bras'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'wrist_curl', name: 'Wrist curl barre EZ',
    equipmentOptions: [['Barre EZ'],['Haltères']],
    muscles: { primary: ['Avant-bras'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },

  // DOS — VARIANTES DE PRISE
  {
    id: 'barbell_row_supinated', name: 'Rowing barre prise supination',
    equipmentOptions: [['Barre olympique']],
    muscles: { primary: ['Dos'], secondary: ['Biceps'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: false,
  },
  {
    id: 'lat_pulldown_supinated', name: 'Tirage vertical prise supination',
    equipmentOptions: [['Tirage vertical']],
    muscles: { primary: ['Dos'], secondary: ['Biceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'cable_row_unilateral', name: 'Rowing câble unilatéral',
    equipmentOptions: [['Câble poulie basse'],['Station câbles double']],
    muscles: { primary: ['Dos'], secondary: ['Biceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },

  // ÉPAULES
  {
    id: 'reverse_fly_machine', name: 'Oiseau machine (pec deck inversé)',
    equipmentOptions: [['Pec deck']],
    muscles: { primary: ['Épaules'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },

  // ABDOMINAUX
  {
    id: 'l_sit', name: 'L-sit',
    equipmentOptions: [['Barres parallèles'],['Captain chair']],
    muscles: { primary: ['Abdominaux'], secondary: ['Triceps'] },
    type: 'compound', block: 'C', objectives: ['strength'],
    level: ['advanced'], failureAllowed: true,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // NOUVEAUX EXERCICES — GAINAGE / FONCTIONNEL / MÉTABOLIQUE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'hollow_body_hold', name: 'Hollow body hold',
    equipmentOptions: [[]],
    muscles: { primary: ['Abdominaux'], secondary: ['Fessiers','Quadriceps'] },
    type: 'isolation', block: 'C', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'copenhagen_plank', name: 'Copenhagen plank',
    equipmentOptions: [[]],
    muscles: { primary: ['Adducteurs'], secondary: ['Abdominaux','Fessiers'] },
    type: 'isolation', block: 'C', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'pistol_squat', name: 'Pistol squat',
    equipmentOptions: [[]],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers','Mollets','Abdominaux'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['advanced'], failureAllowed: true,
  },
  {
    id: 'ab_wheel_rollout', name: 'Roulette abdominale',
    equipmentOptions: [['Roulette abdominale']],
    muscles: { primary: ['Abdominaux'], secondary: ['Épaules','Dos'] },
    type: 'compound', block: 'C', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'burpees', name: 'Burpees',
    equipmentOptions: [[]],
    muscles: { primary: ['Quadriceps','Pectoraux','Épaules'], secondary: ['Fessiers','Abdominaux','Triceps'] },
    type: 'compound', block: 'B', objectives: ['endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'mountain_climbers', name: 'Mountain climbers',
    equipmentOptions: [[]],
    muscles: { primary: ['Abdominaux'], secondary: ['Épaules','Quadriceps','Fessiers'] },
    type: 'compound', block: 'C', objectives: ['endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'thruster_dumbbell', name: 'Thruster haltères',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Quadriceps','Épaules','Fessiers'], secondary: ['Triceps','Abdominaux','Ischio-jambiers'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy','endurance'],
    level: ['intermediate','advanced'], failureAllowed: false,
  },
  {
    id: 'renegade_row', name: 'Renegade row',
    equipmentOptions: [['Haltères']],
    muscles: { primary: ['Dos','Abdominaux'], secondary: ['Épaules','Biceps'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'farmers_carry', name: 'Marche du fermier',
    equipmentOptions: [['Haltères'],['Kettlebell'],['Barre olympique']],
    muscles: { primary: ['Avant-bras','Trapèzes','Abdominaux'], secondary: ['Épaules','Quadriceps','Mollets'] },
    type: 'compound', block: 'B', objectives: ['strength','hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'jump_rope', name: 'Corde à sauter',
    equipmentOptions: [['Corde à sauter']],
    muscles: { primary: ['Mollets'], secondary: ['Épaules','Abdominaux'] },
    type: 'compound', block: 'C', objectives: ['endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'box_jump', name: 'Box jump',
    equipmentOptions: [['Boîte pliométrique']],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Mollets','Ischio-jambiers'] },
    type: 'compound', block: 'A', objectives: ['strength','endurance'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'wall_sit', name: 'Wall sit',
    equipmentOptions: [[]],
    muscles: { primary: ['Quadriceps'], secondary: ['Fessiers','Ischio-jambiers'] },
    type: 'isolation', block: 'C', objectives: ['endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // NOUVEAUX EXERCICES — POULIE / CÂBLE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'pullover_cable', name: 'Pull-over poulie',
    equipmentOptions: [['Câble poulie haute']],
    muscles: { primary: ['Dos','Pectoraux'], secondary: ['Triceps','Abdominaux'] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'bayesian_curl', name: 'Curl câble bayésien',
    equipmentOptions: [['Câble poulie basse']],
    muscles: { primary: ['Biceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: true,
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
  },
  {
    id: 'rack_pull', name: 'Rack pull',
    equipmentOptions: [['Barre olympique','Rack squat'],['Barre olympique','Rack demi-cage']],
    muscles: { primary: ['Dos','Ischio-jambiers','Fessiers'], secondary: ['Avant-bras','Trapèzes'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['intermediate','advanced'], failureAllowed: false,
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
  },
  {
    id: 'trap_bar_deadlift', name: 'Soulevé de terre trap bar',
    equipmentOptions: [['Trap bar']],
    muscles: { primary: ['Quadriceps','Fessiers','Dos'], secondary: ['Ischio-jambiers','Avant-bras','Trapèzes'] },
    type: 'compound', block: 'A', objectives: ['strength','hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: false,
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
  },
  {
    id: 'pike_pushup', name: 'Pompes piquées',
    equipmentOptions: [[]],
    muscles: { primary: ['Épaules'], secondary: ['Triceps'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate'], failureAllowed: true,
  },
  {
    id: 'triceps_extension_band', name: 'Extension triceps élastique',
    equipmentOptions: [['Élastiques de résistance']],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
  },
  {
    id: 'lunge_bodyweight', name: 'Fentes alternées',
    equipmentOptions: [[]],
    muscles: { primary: ['Quadriceps','Fessiers'], secondary: ['Ischio-jambiers'] },
    type: 'compound', block: 'B', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate'], failureAllowed: true,
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
  {
    id: 'crunch_bras_tendus_au_dessus_de_la_tete', name: 'Crunch bras tendus au-dessus de la tête',
    equipmentOptions: [[]],
    muscles: { primary: ['Abdominaux'], secondary: ['Épaules','Dos'] },
    type: 'isolation', block: 'C', objectives: ['strength','hypertrophy'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Bras tendus au-dessus de la tête, décolle les omoplates sans tirer sur la nuque. Trop facile ? Tiens un sac chargé entre les mains.',
  },
  {
    id: 'l_sit_au_sol', name: 'L-sit au sol',
    equipmentOptions: [[]],
    muscles: { primary: ['Abdominaux'], secondary: ['Triceps'] },
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
    id: 'extension_triceps_nuque_avec_sac', name: 'Extension triceps nuque avec sac',
    equipmentOptions: [[]],
    muscles: { primary: ['Triceps'], secondary: [] },
    type: 'isolation', block: 'C', objectives: ['hypertrophy','endurance'],
    level: ['beginner','intermediate','advanced'], failureAllowed: true,
    fallback: true,
    cue: 'Assis sur une chaise, sac chargé derrière la nuque à deux mains. Coudes fixes, seuls les avant-bras bougent.',
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
