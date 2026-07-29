// ─────────────────────────────────────────────────────────────────────────────
// PROGRAMMES PRÉ-GÉNÉRÉS — catalogue (généré en amont par Claude, activé par le
// profil). Noms d'exercices normalisés vers exercise-database.js. NE PAS éditer
// à la main. match: { level, training_context, objectives_signature,
// weekly_frequency, recommended_for_optimal }.
// Tier présent : intermediate × full_gym (30 programmes).
// ─────────────────────────────────────────────────────────────────────────────

export const PRE_GENERATED_PROGRAMS = [
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "hypertrophy:full_body:primary",
      "weekly_frequency": 3,
      "recommended_for_optimal": false
    },
    "program": {
      "name": "Full Body — Hypertrophie (3j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "full_body",
      "weekly_frequency": 3,
      "sessions": [
        {
          "day_label": "Full Body A",
          "type": "hypertrophy",
          "estimated_duration": 85,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Écarté poulie",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Full Body B",
          "type": "hypertrophy",
          "estimated_duration": 85,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Front squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers",
                  "Abdominaux",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Écarté incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Tirage poulie bras tendus",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Full Body C",
          "type": "hypertrophy",
          "estimated_duration": 85,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Pec deck",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets leg press",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "hypertrophy:full_body:primary",
      "weekly_frequency": 4,
      "recommended_for_optimal": true
    },
    "program": {
      "name": "Full Body — Hypertrophie (4j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "upper_lower",
      "weekly_frequency": 4,
      "sessions": [
        {
          "day_label": "Haut A",
          "type": "hypertrophy",
          "estimated_duration": 75,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté poulie",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Bas A",
          "type": "hypertrophy",
          "estimated_duration": 60,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Haut B",
          "type": "hypertrophy",
          "estimated_duration": 75,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Tirage poulie bras tendus",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Bas B",
          "type": "hypertrophy",
          "estimated_duration": 60,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Front squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers",
                  "Abdominaux",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets leg press",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Roulette abdominale",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": [
                  "Épaules",
                  "Dos"
                ]
              },
              "block": "C",
              "type": "compound",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "hypertrophy:full_body:primary",
      "weekly_frequency": 5,
      "recommended_for_optimal": false
    },
    "program": {
      "name": "Full Body — Hypertrophie (5j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "ppl_upper_lower",
      "weekly_frequency": 5,
      "sessions": [
        {
          "day_label": "Poussée",
          "type": "hypertrophy",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté poulie",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Tirage",
          "type": "hypertrophy",
          "estimated_duration": 40,
          "active_zones": [
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Jambes",
          "type": "hypertrophy",
          "estimated_duration": 60,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Haut",
          "type": "hypertrophy",
          "estimated_duration": 75,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Tirage poulie bras tendus",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Roulette abdominale",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": [
                  "Épaules",
                  "Dos"
                ]
              },
              "block": "C",
              "type": "compound",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Bas",
          "type": "hypertrophy",
          "estimated_duration": 60,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Front squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers",
                  "Abdominaux",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets leg press",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "hypertrophy:upper_body:primary",
      "weekly_frequency": 3,
      "recommended_for_optimal": false
    },
    "program": {
      "name": "Haut du Corps — Hypertrophie (3j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "upper_lower",
      "weekly_frequency": 3,
      "sessions": [
        {
          "day_label": "Haut A",
          "type": "hypertrophy",
          "estimated_duration": 80,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté poulie",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Haut B",
          "type": "hypertrophy",
          "estimated_duration": 80,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Tirage poulie bras tendus",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Bas",
          "type": "hypertrophy",
          "estimated_duration": 55,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "hypertrophy:upper_body:primary",
      "weekly_frequency": 4,
      "recommended_for_optimal": true
    },
    "program": {
      "name": "Haut du Corps — Hypertrophie (4j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "ppl_upper_lower",
      "weekly_frequency": 4,
      "sessions": [
        {
          "day_label": "Poussée",
          "type": "hypertrophy",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté poulie",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Tirage",
          "type": "hypertrophy",
          "estimated_duration": 40,
          "active_zones": [
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Bas",
          "type": "hypertrophy",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Haut",
          "type": "hypertrophy",
          "estimated_duration": 75,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Tirage poulie bras tendus",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Roulette abdominale",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": [
                  "Épaules",
                  "Dos"
                ]
              },
              "block": "C",
              "type": "compound",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "hypertrophy:upper_body:primary",
      "weekly_frequency": 5,
      "recommended_for_optimal": false
    },
    "program": {
      "name": "Haut du Corps — Hypertrophie (5j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "push_pull_legs",
      "weekly_frequency": 5,
      "sessions": [
        {
          "day_label": "Poussée A",
          "type": "hypertrophy",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté poulie",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Tirage A",
          "type": "hypertrophy",
          "estimated_duration": 40,
          "active_zones": [
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Jambes",
          "type": "hypertrophy",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Poussée B",
          "type": "hypertrophy",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Roulette abdominale",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": [
                  "Épaules",
                  "Dos"
                ]
              },
              "block": "C",
              "type": "compound",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Tirage B",
          "type": "hypertrophy",
          "estimated_duration": 40,
          "active_zones": [
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Tirage poulie bras tendus",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "hypertrophy:lower_body:primary",
      "weekly_frequency": 3,
      "recommended_for_optimal": false
    },
    "program": {
      "name": "Bas du Corps — Hypertrophie (3j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "upper_lower",
      "weekly_frequency": 3,
      "sessions": [
        {
          "day_label": "Bas A",
          "type": "hypertrophy",
          "estimated_duration": 65,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Haut",
          "type": "hypertrophy",
          "estimated_duration": 60,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté poulie",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Bas B",
          "type": "hypertrophy",
          "estimated_duration": 65,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Front squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers",
                  "Abdominaux",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets leg press",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "hypertrophy:lower_body:primary",
      "weekly_frequency": 4,
      "recommended_for_optimal": true
    },
    "program": {
      "name": "Bas du Corps — Hypertrophie (4j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "upper_lower",
      "weekly_frequency": 4,
      "sessions": [
        {
          "day_label": "Bas A",
          "type": "hypertrophy",
          "estimated_duration": 60,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Haut A",
          "type": "hypertrophy",
          "estimated_duration": 45,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Bas B",
          "type": "hypertrophy",
          "estimated_duration": 60,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Front squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers",
                  "Abdominaux",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets leg press",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Haut B",
          "type": "hypertrophy",
          "estimated_duration": 45,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Roulette abdominale",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": [
                  "Épaules",
                  "Dos"
                ]
              },
              "block": "C",
              "type": "compound",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "hypertrophy:lower_body:primary",
      "weekly_frequency": 5,
      "recommended_for_optimal": false
    },
    "program": {
      "name": "Bas du Corps — Hypertrophie (5j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "legs_upper",
      "weekly_frequency": 5,
      "sessions": [
        {
          "day_label": "Jambes A",
          "type": "hypertrophy",
          "estimated_duration": 45,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Haut A",
          "type": "hypertrophy",
          "estimated_duration": 45,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Jambes B",
          "type": "hypertrophy",
          "estimated_duration": 45,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Front squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers",
                  "Abdominaux",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Haut B",
          "type": "hypertrophy",
          "estimated_duration": 45,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Roulette abdominale",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": [
                  "Épaules",
                  "Dos"
                ]
              },
              "block": "C",
              "type": "compound",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Jambes C",
          "type": "hypertrophy",
          "estimated_duration": 45,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets leg press",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "endurance:full_body:primary",
      "weekly_frequency": 3,
      "recommended_for_optimal": false
    },
    "program": {
      "name": "Full Body — Endurance (3j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "full_body",
      "weekly_frequency": 3,
      "sessions": [
        {
          "day_label": "Full Body A",
          "type": "endurance",
          "estimated_duration": 65,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Écarté poulie",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "18-25",
              "rest_seconds": 45
            }
          ]
        },
        {
          "day_label": "Full Body B",
          "type": "endurance",
          "estimated_duration": 65,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Front squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers",
                  "Abdominaux",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Écarté incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Tirage poulie bras tendus",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "18-25",
              "rest_seconds": 45
            }
          ]
        },
        {
          "day_label": "Full Body C",
          "type": "endurance",
          "estimated_duration": 65,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Pec deck",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Mollets leg press",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "18-25",
              "rest_seconds": 45
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "endurance:full_body:primary",
      "weekly_frequency": 4,
      "recommended_for_optimal": true
    },
    "program": {
      "name": "Full Body — Endurance (4j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "upper_lower",
      "weekly_frequency": 4,
      "sessions": [
        {
          "day_label": "Haut A",
          "type": "endurance",
          "estimated_duration": 60,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Écarté poulie",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "18-25",
              "rest_seconds": 45
            }
          ]
        },
        {
          "day_label": "Bas A",
          "type": "endurance",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "18-25",
              "rest_seconds": 45
            }
          ]
        },
        {
          "day_label": "Haut B",
          "type": "endurance",
          "estimated_duration": 60,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Écarté incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Tirage poulie bras tendus",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "18-25",
              "rest_seconds": 45
            }
          ]
        },
        {
          "day_label": "Bas B",
          "type": "endurance",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Front squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers",
                  "Abdominaux",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Mollets leg press",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Roulette abdominale",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": [
                  "Épaules",
                  "Dos"
                ]
              },
              "block": "C",
              "type": "compound",
              "sets": 3,
              "target_reps": "18-25",
              "rest_seconds": 45
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "endurance:full_body:primary",
      "weekly_frequency": 5,
      "recommended_for_optimal": false
    },
    "program": {
      "name": "Full Body — Endurance (5j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "ppl_upper_lower",
      "weekly_frequency": 5,
      "sessions": [
        {
          "day_label": "Poussée",
          "type": "endurance",
          "estimated_duration": 35,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Écarté poulie",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "18-25",
              "rest_seconds": 45
            }
          ]
        },
        {
          "day_label": "Tirage",
          "type": "endurance",
          "estimated_duration": 30,
          "active_zones": [
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "18-25",
              "rest_seconds": 45
            }
          ]
        },
        {
          "day_label": "Jambes",
          "type": "endurance",
          "estimated_duration": 45,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "18-25",
              "rest_seconds": 45
            }
          ]
        },
        {
          "day_label": "Haut",
          "type": "endurance",
          "estimated_duration": 55,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Écarté incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Tirage poulie bras tendus",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Roulette abdominale",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": [
                  "Épaules",
                  "Dos"
                ]
              },
              "block": "C",
              "type": "compound",
              "sets": 2,
              "target_reps": "18-25",
              "rest_seconds": 45
            }
          ]
        },
        {
          "day_label": "Bas",
          "type": "endurance",
          "estimated_duration": 45,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Front squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers",
                  "Abdominaux",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 60
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Mollets leg press",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "18-25",
              "rest_seconds": 45
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "18-25",
              "rest_seconds": 45
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "strength:movements[Squat barre,Développé couché,Soulevé de terre]:primary",
      "weekly_frequency": 3,
      "recommended_for_optimal": false
    },
    "program": {
      "name": "Force SBD — Squat/Développé/Soulevé (3j)",
      "level": "intermediate",
      "planned_weeks": 8,
      "split": "movements",
      "weekly_frequency": 3,
      "sessions": [
        {
          "day_label": "Jour Squat",
          "type": "strength",
          "estimated_duration": 55,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 5,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Leg press",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg curl allongé",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Jour Développé couché",
          "type": "strength",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Triceps"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 5,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Élévations latérales haltères",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Jour Soulevé de terre",
          "type": "strength",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Épaules"
            }
          ],
          "exercises": [
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Tirage vertical pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Face pull câble",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules",
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 45
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "strength:movements[Squat barre,Développé couché,Soulevé de terre]:primary",
      "weekly_frequency": 4,
      "recommended_for_optimal": true
    },
    "program": {
      "name": "Force SBD — Squat/Développé/Soulevé (4j)",
      "level": "intermediate",
      "planned_weeks": 8,
      "split": "movements",
      "weekly_frequency": 4,
      "sessions": [
        {
          "day_label": "Jour Soulevé de terre",
          "type": "strength",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Épaules"
            }
          ],
          "exercises": [
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Tirage vertical pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Face pull câble",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules",
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 45
            }
          ]
        },
        {
          "day_label": "Jour Développé couché",
          "type": "strength",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Triceps"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 5,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Élévations latérales haltères",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Jour Squat",
          "type": "strength",
          "estimated_duration": 55,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 5,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Leg press",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg curl allongé",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Accessoires Haut",
          "type": "hypertrophy",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            }
          ],
          "exercises": [
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Développé militaire haltères",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Élévations latérales câble",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Curl haltères alternés",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Triceps poulie haute corde",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "strength:movements[Squat barre,Développé couché,Soulevé de terre]:primary",
      "weekly_frequency": 5,
      "recommended_for_optimal": false
    },
    "program": {
      "name": "Force SBD — Squat/Développé/Soulevé (5j)",
      "level": "intermediate",
      "planned_weeks": 8,
      "split": "movements",
      "weekly_frequency": 5,
      "sessions": [
        {
          "day_label": "Jour Soulevé de terre",
          "type": "strength",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Épaules"
            }
          ],
          "exercises": [
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Tirage vertical pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Face pull câble",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules",
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 45
            }
          ]
        },
        {
          "day_label": "Jour Développé couché",
          "type": "strength",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Triceps"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 5,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Élévations latérales haltères",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Jour Squat",
          "type": "strength",
          "estimated_duration": 55,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 5,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Leg press",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg curl allongé",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Accessoires Haut",
          "type": "hypertrophy",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            }
          ],
          "exercises": [
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Développé militaire haltères",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Élévations latérales câble",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Curl haltères alternés",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Triceps poulie haute corde",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Accessoires Bas",
          "type": "hypertrophy",
          "estimated_duration": 55,
          "active_zones": [
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            }
          ],
          "exercises": [
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 4,
              "target_reps": "8-10",
              "rest_seconds": 120
            },
            {
              "name": "Hack squat machine",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "hypertrophy:upper_body:primary+hypertrophy:lower_body:secondary",
      "weekly_frequency": 3,
      "recommended_for_optimal": false
    },
    "program": {
      "name": "Haut Prioritaire — Hypertrophie (3j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "full_body",
      "weekly_frequency": 3,
      "sessions": [
        {
          "day_label": "Full Body A",
          "type": "hypertrophy",
          "estimated_duration": 80,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté poulie",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Full Body B",
          "type": "hypertrophy",
          "estimated_duration": 80,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Front squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers",
                  "Abdominaux",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Tirage poulie bras tendus",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Full Body C",
          "type": "hypertrophy",
          "estimated_duration": 80,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Pec deck",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets leg press",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "hypertrophy:upper_body:primary+hypertrophy:lower_body:secondary",
      "weekly_frequency": 4,
      "recommended_for_optimal": true
    },
    "program": {
      "name": "Haut Prioritaire — Hypertrophie (4j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "upper_lower",
      "weekly_frequency": 4,
      "sessions": [
        {
          "day_label": "Haut A",
          "type": "hypertrophy",
          "estimated_duration": 75,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté poulie",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Bas A",
          "type": "hypertrophy",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Haut B",
          "type": "hypertrophy",
          "estimated_duration": 75,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Tirage poulie bras tendus",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Bas B",
          "type": "hypertrophy",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Front squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers",
                  "Abdominaux",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Roulette abdominale",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": [
                  "Épaules",
                  "Dos"
                ]
              },
              "block": "C",
              "type": "compound",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "hypertrophy:upper_body:primary+hypertrophy:lower_body:secondary",
      "weekly_frequency": 5,
      "recommended_for_optimal": false
    },
    "program": {
      "name": "Haut Prioritaire — Hypertrophie (5j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "ppl_upper_lower",
      "weekly_frequency": 5,
      "sessions": [
        {
          "day_label": "Poussée",
          "type": "hypertrophy",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté poulie",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Tirage",
          "type": "hypertrophy",
          "estimated_duration": 40,
          "active_zones": [
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Jambes",
          "type": "hypertrophy",
          "estimated_duration": 45,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Haut",
          "type": "hypertrophy",
          "estimated_duration": 75,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Tirage poulie bras tendus",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Roulette abdominale",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": [
                  "Épaules",
                  "Dos"
                ]
              },
              "block": "C",
              "type": "compound",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Bas",
          "type": "hypertrophy",
          "estimated_duration": 45,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Front squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers",
                  "Abdominaux",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "hypertrophy:lower_body:primary+hypertrophy:upper_body:secondary",
      "weekly_frequency": 3,
      "recommended_for_optimal": false
    },
    "program": {
      "name": "Bas Prioritaire — Hypertrophie (3j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "full_body",
      "weekly_frequency": 3,
      "sessions": [
        {
          "day_label": "Full Body A",
          "type": "hypertrophy",
          "estimated_duration": 85,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Full Body B",
          "type": "hypertrophy",
          "estimated_duration": 85,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Front squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers",
                  "Abdominaux",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Full Body C",
          "type": "hypertrophy",
          "estimated_duration": 85,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets leg press",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "hypertrophy:lower_body:primary+hypertrophy:upper_body:secondary",
      "weekly_frequency": 4,
      "recommended_for_optimal": true
    },
    "program": {
      "name": "Bas Prioritaire — Hypertrophie (4j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "upper_lower",
      "weekly_frequency": 4,
      "sessions": [
        {
          "day_label": "Haut A",
          "type": "hypertrophy",
          "estimated_duration": 55,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté poulie",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Bas A",
          "type": "hypertrophy",
          "estimated_duration": 60,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Haut B",
          "type": "hypertrophy",
          "estimated_duration": 55,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Tirage poulie bras tendus",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Bas B",
          "type": "hypertrophy",
          "estimated_duration": 60,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Front squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers",
                  "Abdominaux",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets leg press",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Roulette abdominale",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": [
                  "Épaules",
                  "Dos"
                ]
              },
              "block": "C",
              "type": "compound",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "hypertrophy:lower_body:primary+hypertrophy:upper_body:secondary",
      "weekly_frequency": 5,
      "recommended_for_optimal": false
    },
    "program": {
      "name": "Bas Prioritaire — Hypertrophie (5j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "ppl_upper_lower",
      "weekly_frequency": 5,
      "sessions": [
        {
          "day_label": "Poussée",
          "type": "hypertrophy",
          "estimated_duration": 35,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté poulie",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Tirage",
          "type": "hypertrophy",
          "estimated_duration": 30,
          "active_zones": [
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Jambes",
          "type": "hypertrophy",
          "estimated_duration": 60,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Haut",
          "type": "hypertrophy",
          "estimated_duration": 55,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Tirage poulie bras tendus",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Roulette abdominale",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": [
                  "Épaules",
                  "Dos"
                ]
              },
              "block": "C",
              "type": "compound",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Bas",
          "type": "hypertrophy",
          "estimated_duration": 60,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Front squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers",
                  "Abdominaux",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets leg press",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "strength:movements[Squat barre,Développé couché,Soulevé de terre]:primary+hypertrophy:full_body:secondary",
      "weekly_frequency": 3,
      "recommended_for_optimal": false
    },
    "program": {
      "name": "Powerbuilding — Force & Volume (3j)",
      "level": "intermediate",
      "planned_weeks": 8,
      "split": "movements",
      "weekly_frequency": 3,
      "sessions": [
        {
          "day_label": "Jour Squat",
          "type": "mixed",
          "estimated_duration": 65,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 5,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Leg press",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Fente avant haltères",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg curl allongé",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Jour Développé couché",
          "type": "mixed",
          "estimated_duration": 55,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Triceps"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 5,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Développé incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Élévations latérales haltères",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Jour Soulevé de terre",
          "type": "mixed",
          "estimated_duration": 60,
          "active_zones": [
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Épaules"
            }
          ],
          "exercises": [
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Tirage vertical pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Rowing assis câble",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Face pull câble",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules",
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 45
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "strength:movements[Squat barre,Développé couché,Soulevé de terre]:primary+hypertrophy:full_body:secondary",
      "weekly_frequency": 4,
      "recommended_for_optimal": true
    },
    "program": {
      "name": "Powerbuilding — Force & Volume (4j)",
      "level": "intermediate",
      "planned_weeks": 8,
      "split": "movements",
      "weekly_frequency": 4,
      "sessions": [
        {
          "day_label": "Jour Soulevé de terre",
          "type": "mixed",
          "estimated_duration": 60,
          "active_zones": [
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Épaules"
            }
          ],
          "exercises": [
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Tirage vertical pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Rowing assis câble",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Face pull câble",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules",
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 45
            }
          ]
        },
        {
          "day_label": "Jour Développé couché",
          "type": "mixed",
          "estimated_duration": 55,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Triceps"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 5,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Développé incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Élévations latérales haltères",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Jour Squat",
          "type": "mixed",
          "estimated_duration": 65,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 5,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Leg press",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Fente avant haltères",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg curl allongé",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Accessoires Haut",
          "type": "mixed",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            }
          ],
          "exercises": [
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Développé militaire haltères",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Élévations latérales câble",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Curl haltères alternés",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Triceps poulie haute corde",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "strength:movements[Squat barre,Développé couché,Soulevé de terre]:primary+hypertrophy:full_body:secondary",
      "weekly_frequency": 5,
      "recommended_for_optimal": false
    },
    "program": {
      "name": "Powerbuilding — Force & Volume (5j)",
      "level": "intermediate",
      "planned_weeks": 8,
      "split": "movements",
      "weekly_frequency": 5,
      "sessions": [
        {
          "day_label": "Jour Soulevé de terre",
          "type": "mixed",
          "estimated_duration": 60,
          "active_zones": [
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Épaules"
            }
          ],
          "exercises": [
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Tirage vertical pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Rowing assis câble",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Face pull câble",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules",
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 45
            }
          ]
        },
        {
          "day_label": "Jour Développé couché",
          "type": "mixed",
          "estimated_duration": 55,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Triceps"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 5,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Développé incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Élévations latérales haltères",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Jour Squat",
          "type": "mixed",
          "estimated_duration": 65,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 5,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Leg press",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Fente avant haltères",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg curl allongé",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Accessoires Haut",
          "type": "mixed",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            }
          ],
          "exercises": [
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Développé militaire haltères",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Élévations latérales câble",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Curl haltères alternés",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Triceps poulie haute corde",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Accessoires Bas",
          "type": "mixed",
          "estimated_duration": 55,
          "active_zones": [
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            }
          ],
          "exercises": [
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 4,
              "target_reps": "8-10",
              "rest_seconds": 120
            },
            {
              "name": "Hack squat machine",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "hypertrophy:full_body:primary+strength:lower_body:secondary",
      "weekly_frequency": 3,
      "recommended_for_optimal": false
    },
    "program": {
      "name": "Full Body — Hypertrophie & Force Bas (3j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "full_body",
      "weekly_frequency": 3,
      "sessions": [
        {
          "day_label": "Full Body A",
          "type": "hypertrophy",
          "estimated_duration": 95,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Écarté poulie",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Full Body B",
          "type": "hypertrophy",
          "estimated_duration": 95,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Front squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers",
                  "Abdominaux",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Écarté incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Tirage poulie bras tendus",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Full Body C",
          "type": "hypertrophy",
          "estimated_duration": 95,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Pec deck",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets leg press",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "hypertrophy:full_body:primary+strength:lower_body:secondary",
      "weekly_frequency": 4,
      "recommended_for_optimal": true
    },
    "program": {
      "name": "Full Body — Hypertrophie & Force Bas (4j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "upper_lower",
      "weekly_frequency": 4,
      "sessions": [
        {
          "day_label": "Haut A",
          "type": "hypertrophy",
          "estimated_duration": 75,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté poulie",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Bas A",
          "type": "hypertrophy",
          "estimated_duration": 65,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Haut B",
          "type": "hypertrophy",
          "estimated_duration": 75,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Tirage poulie bras tendus",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Bas B",
          "type": "hypertrophy",
          "estimated_duration": 65,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Front squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers",
                  "Abdominaux",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets leg press",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Roulette abdominale",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": [
                  "Épaules",
                  "Dos"
                ]
              },
              "block": "C",
              "type": "compound",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "hypertrophy:full_body:primary+strength:lower_body:secondary",
      "weekly_frequency": 5,
      "recommended_for_optimal": false
    },
    "program": {
      "name": "Full Body — Hypertrophie & Force Bas (5j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "ppl_upper_lower",
      "weekly_frequency": 5,
      "sessions": [
        {
          "day_label": "Poussée",
          "type": "hypertrophy",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté poulie",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Tirage",
          "type": "hypertrophy",
          "estimated_duration": 40,
          "active_zones": [
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Jambes",
          "type": "hypertrophy",
          "estimated_duration": 65,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Haut",
          "type": "hypertrophy",
          "estimated_duration": 75,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Écarté incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Tirage poulie bras tendus",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Roulette abdominale",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": [
                  "Épaules",
                  "Dos"
                ]
              },
              "block": "C",
              "type": "compound",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        },
        {
          "day_label": "Bas",
          "type": "hypertrophy",
          "estimated_duration": 65,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Front squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers",
                  "Abdominaux",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "3-5",
              "rest_seconds": 210
            },
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "6-8",
              "rest_seconds": 120
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "8-12",
              "rest_seconds": 90
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets leg press",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "endurance:full_body:primary+hypertrophy:full_body:secondary",
      "weekly_frequency": 3,
      "recommended_for_optimal": false
    },
    "program": {
      "name": "Endurance & Hypertrophie (3j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "full_body",
      "weekly_frequency": 3,
      "sessions": [
        {
          "day_label": "Full Body A",
          "type": "mixed",
          "estimated_duration": 75,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Écarté poulie",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 45
            }
          ]
        },
        {
          "day_label": "Full Body B",
          "type": "mixed",
          "estimated_duration": 75,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Front squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers",
                  "Abdominaux",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Écarté incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Tirage poulie bras tendus",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 45
            }
          ]
        },
        {
          "day_label": "Full Body C",
          "type": "mixed",
          "estimated_duration": 75,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 2,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 2,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Pec deck",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Mollets leg press",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 45
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "endurance:full_body:primary+hypertrophy:full_body:secondary",
      "weekly_frequency": 4,
      "recommended_for_optimal": true
    },
    "program": {
      "name": "Endurance & Hypertrophie (4j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "upper_lower",
      "weekly_frequency": 4,
      "sessions": [
        {
          "day_label": "Haut A",
          "type": "mixed",
          "estimated_duration": 65,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Écarté poulie",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 45
            }
          ]
        },
        {
          "day_label": "Bas A",
          "type": "mixed",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 45
            }
          ]
        },
        {
          "day_label": "Haut B",
          "type": "mixed",
          "estimated_duration": 65,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Écarté incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Tirage poulie bras tendus",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 45
            }
          ]
        },
        {
          "day_label": "Bas B",
          "type": "mixed",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Front squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers",
                  "Abdominaux",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Mollets leg press",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Roulette abdominale",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": [
                  "Épaules",
                  "Dos"
                ]
              },
              "block": "C",
              "type": "compound",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 45
            }
          ]
        }
      ]
    }
  },
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "endurance:full_body:primary+hypertrophy:full_body:secondary",
      "weekly_frequency": 5,
      "recommended_for_optimal": false
    },
    "program": {
      "name": "Endurance & Hypertrophie (5j)",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "ppl_upper_lower",
      "weekly_frequency": 5,
      "sessions": [
        {
          "day_label": "Poussée",
          "type": "mixed",
          "estimated_duration": 40,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Dips triceps machine",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": [
                  "Épaules"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Écarté poulie",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 45
            }
          ]
        },
        {
          "day_label": "Tirage",
          "type": "mixed",
          "estimated_duration": 35,
          "active_zones": [
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Traction pronation",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Pull-over poulie",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos",
                  "Pectoraux"
                ],
                "secondary": [
                  "Triceps",
                  "Abdominaux"
                ]
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Relevés de jambes suspendu",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 45
            }
          ]
        },
        {
          "day_label": "Jambes",
          "type": "mixed",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps",
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers",
                  "Mollets",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Soulevé de terre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Dos",
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Quadriceps",
                  "Mollets"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 3,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Hip thrust barre",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Mollets assis machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Crunch machine",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 45
            }
          ]
        },
        {
          "day_label": "Haut",
          "type": "mixed",
          "estimated_duration": 65,
          "active_zones": [
            {
              "muscle_group": "Pectoraux"
            },
            {
              "muscle_group": "Dos"
            },
            {
              "muscle_group": "Épaules"
            },
            {
              "muscle_group": "Biceps"
            },
            {
              "muscle_group": "Triceps"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Développé incliné barre",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": [
                  "Triceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Rowing barre",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": [
                  "Biceps",
                  "Épaules"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Développé militaire barre",
              "muscle_group": "Épaules",
              "muscles": {
                "primary": [
                  "Épaules"
                ],
                "secondary": [
                  "Triceps"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Curl barre EZ",
              "muscle_group": "Biceps",
              "muscles": {
                "primary": [
                  "Biceps"
                ],
                "secondary": [
                  "Avant-bras"
                ]
              },
              "block": "B",
              "type": "isolation",
              "sets": 4,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Skull crusher barre EZ",
              "muscle_group": "Triceps",
              "muscles": {
                "primary": [
                  "Triceps"
                ],
                "secondary": []
              },
              "block": "B",
              "type": "isolation",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Écarté incliné haltères",
              "muscle_group": "Pectoraux",
              "muscles": {
                "primary": [
                  "Poitrine"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Tirage poulie bras tendus",
              "muscle_group": "Dos",
              "muscles": {
                "primary": [
                  "Dos"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Roulette abdominale",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": [
                  "Épaules",
                  "Dos"
                ]
              },
              "block": "C",
              "type": "compound",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 45
            }
          ]
        },
        {
          "day_label": "Bas",
          "type": "mixed",
          "estimated_duration": 50,
          "active_zones": [
            {
              "muscle_group": "Quadriceps"
            },
            {
              "muscle_group": "Ischio-jambiers"
            },
            {
              "muscle_group": "Fessiers"
            },
            {
              "muscle_group": "Mollets"
            },
            {
              "muscle_group": "Abdominaux"
            }
          ],
          "exercises": [
            {
              "name": "Front squat barre",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": [
                  "Fessiers",
                  "Abdominaux",
                  "Dos"
                ]
              },
              "block": "A",
              "type": "compound",
              "sets": 4,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Soulevé de terre roumain barre",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers",
                  "Fessiers"
                ],
                "secondary": [
                  "Dos"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "10-12",
              "rest_seconds": 90
            },
            {
              "name": "Hip thrust machine",
              "muscle_group": "Fessiers",
              "muscles": {
                "primary": [
                  "Fessiers"
                ],
                "secondary": [
                  "Ischio-jambiers"
                ]
              },
              "block": "B",
              "type": "compound",
              "sets": 3,
              "target_reps": "12-15",
              "rest_seconds": 60
            },
            {
              "name": "Leg extension",
              "muscle_group": "Quadriceps",
              "muscles": {
                "primary": [
                  "Quadriceps"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 4,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Leg curl assis",
              "muscle_group": "Ischio-jambiers",
              "muscles": {
                "primary": [
                  "Ischio-jambiers"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Mollets leg press",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Mollets debout machine",
              "muscle_group": "Mollets",
              "muscles": {
                "primary": [
                  "Mollets"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 3,
              "target_reps": "15-20",
              "rest_seconds": 45
            },
            {
              "name": "Crunch câble",
              "muscle_group": "Abdominaux",
              "muscles": {
                "primary": [
                  "Abdominaux"
                ],
                "secondary": []
              },
              "block": "C",
              "type": "isolation",
              "sets": 2,
              "target_reps": "15-20",
              "rest_seconds": 45
            }
          ]
        }
      ]
    }
  }
];
