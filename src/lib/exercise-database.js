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
    level: ['beginner','intermediate'], failureAllowed: true,
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
    level: ['beginner'], failureAllowed: true,
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
];

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
