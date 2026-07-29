# BRIEF — Génération d'un catalogue de programmes d'entraînement pré-optimisés

## Ton rôle
Tu es un coach expert en périodisation scientifique (principes RP / Israetel : MEV→MAV→MRV, double progression, fréquence 2×/sem par muscle, SRA). Tu génères un **CATALOGUE de programmes « squelettes »** pour une application. Chaque programme est **sélectionné à l'exécution** selon le profil de l'utilisateur (aucune génération dynamique dans l'app). Tu produis **uniquement du JSON**, rien d'autre.

Prends ton temps, procède par lots, ne bâcle aucun cas. La cohérence entre programmes prime.

---

## 1) LA MATRICE — un programme par combinaison
Génère un programme pour chaque combinaison de :

- **level** : `beginner` · `intermediate` · `advanced`
- **training_context** : `full_gym` · `bodyweight` **(uniquement ces 2)**. Les autres cas (maison/barre, custom, enseignes) seront **dérivés par code** via une table de substitution — tu n'as pas à les faire.
- **objectif-archétype** : voir §2
- **weekly_frequency** (séances/sem) :
  - débutant : 2, 3, 4
  - intermédiaire : 3, 4, 5
  - avancé : 3, 4, 5, 6

**Règles d'exclusion (bon sens) :**
- Pas de force-barre lourde (`strength` mouvements SBD) en `bodyweight`.
- Pas d'endurance « circuit » en powerbuilding.
- **Le split n'est pas une règle fixe — applique ton jugement de coach.**
  - Contrainte non négociable : viser **~2× par muscle et par semaine** (sauf périodisation force) + respecter la **SRA**.
  - Repères (à **adapter à l'objectif**, pas à appliquer mécaniquement) :
    - **Hypertrophie / endurance** → priorité à la fréquence : 2-3 j full body · 4 j haut/bas · 5-6 j PPL / haut-bas.
    - **Force (SBD)** → organise par **mouvement** (jour squat / jour développé couché / jour soulevé de terre + accessoires), **pas** en haut/bas.
    - Évite juste l'incohérence évidente (ex. PPL sur 3 jours = 1×/sem par muscle).
  - Choisis le split **le plus efficace** pour l'objectif + la fréquence donnés.

Pour chaque groupe (level × context × objectif), marque **UN** programme (la fréquence recommandée) avec `recommended_for_optimal: true` — c'est celui que l'app choisit quand l'utilisateur n'a **aucune contrainte d'horaire**. Les autres : `false`.

---

## 2) OBJECTIFS-ARCHÉTYPES (champ `objectives_signature`)
Génère ces formes **exactes** (n'invente pas d'autres signatures). Format : `type:cible:priorité`, plusieurs objectifs joints par `+`, primaire d'abord.

**Objectif unique :**
- `hypertrophy:full_body:primary`
- `hypertrophy:upper_body:primary`
- `hypertrophy:lower_body:primary`
- `endurance:full_body:primary`
- `strength:movements[Squat barre,Développé couché,Soulevé de terre]:primary` *(full_gym uniquement)*

**Multi-objectifs (combos réalistes) :**
- `hypertrophy:upper_body:primary+hypertrophy:lower_body:secondary`
- `hypertrophy:lower_body:primary+hypertrophy:upper_body:secondary`
- `strength:movements[Squat barre,Développé couché,Soulevé de terre]:primary+hypertrophy:full_body:secondary` *(powerbuilding, full_gym)*
- `hypertrophy:full_body:primary+strength:lower_body:secondary` *(full_gym)*
- `endurance:full_body:primary+hypertrophy:full_body:secondary`

⚠️ **NE génère PAS de spécialisation par muscle** (`specific_group`, ex. « focus pecs ») : c'est **géré par code** (emphase de volume + ordre) par-dessus tes archétypes. Idem `peaking`, durée de séance et matériel précis : **gérés par code**, ne t'en occupe pas.

---

## 3) FORMAT DE SORTIE (JSON strict)
Un tableau d'objets. **UTF-8 propre** (accents réels : `Développé`, `Épaules`, `Câble` — jamais `DÃ©veloppÃ©`). JSON **valide et parsable**.

```json
[
  {
    "match": {
      "level": "intermediate",
      "training_context": "full_gym",
      "objectives_signature": "hypertrophy:upper_body:primary+hypertrophy:lower_body:secondary",
      "weekly_frequency": 4,
      "recommended_for_optimal": true
    },
    "program": {
      "name": "Haut Prioritaire — Hypertrophie",
      "level": "intermediate",
      "planned_weeks": 6,
      "split": "upper_lower",
      "weekly_frequency": 4,
      "sessions": [
        {
          "day_label": "Haut A",
          "type": "hypertrophy",
          "estimated_duration": 60,
          "exercises": [
            {
              "name": "Développé couché barre",
              "muscle_group": "Pectoraux",
              "muscles_secondary": ["Triceps", "Épaules"],
              "block": "A",
              "equipment": ["Barre olympique", "Banc plat"],
              "sets": 4,
              "target_reps": "6-8",
              "rest_seconds": 120
            }
          ]
        }
      ]
    }
  }
]
```

**Champs — règles :**
- `name` (exercice) : **français**, tu choisis librement les exercices. **Réutilise EXACTEMENT le même nom** pour le même exercice dans tout le catalogue (cohérence obligatoire).
- `muscle_group` : un parmi `Pectoraux · Dos · Épaules · Biceps · Triceps · Abdominaux · Fessiers · Quadriceps · Ischio-jambiers · Mollets`.
- `muscles_secondary` : liste (mêmes noms).
- `block` : `A` = composé lourd (début de séance) · `B` = accessoire/composé modéré · `C` = isolation.
- `equipment` : liste de matériel (voir §5), noms exacts de la liste fournie.
- `sets` : nombre. `target_reps` : **fourchette en string** (`"6-8"`, `"8-12"`, `"12-15"`, `"5"`). `rest_seconds` : nombre.
- **PAS de RIR, PAS de champ « semaine », PAS de notes.** L'app calcule le RIR et gère la **progression semaine par semaine** elle-même.
- `estimated_duration` : minutes réalistes pour la séance au **volume de référence**.
- `type` (séance) : `hypertrophy` · `strength` · `endurance` · `mixed`.
- `day_label` : nom clair et **COMPLET** (jamais tronqué). Pour un split par **mouvement** (force), utilise le **nom entier du mouvement** : « Jour Soulevé de terre », « Jour Développé couché », « Jour Squat » — **jamais** « Jour Soulevé » ni « Jour Développé ».
- `planned_weeks` : durée de mésocycle conseillée (débutant 4-5 · inter 6-8 · avancé 8-10).

**Une seule semaine de séances par programme** (l'app la répète sur `planned_weeks` en progressant). `sessions.length` = `weekly_frequency`.

---

## 4) VOLUME (à respecter par muscle et par semaine)
Vise le **MAV** adapté au niveau (séries hebdo par muscle, muscles cibles) :
- débutant : ~10-14 séries/sem/muscle (grands), ~8-12 (petits)
- intermédiaire : ~14-18 (grands), ~10-14 (petits)
- avancé : ~16-22 (grands), ~12-16 (petits)
Muscle **secondaire** compte 0,5×. Respecte la SRA (48h mini entre 2 séances hypertrophie d'un même muscle, 72h pour composé lourd). Force (SBD) : plus d'intensité, moins de volume, reps 3-6. Endurance : reps 15-25, repos courts.

### 4bis) Rôle d'objectif → volume (RÈGLE CHIFFRÉE)
- Muscles d'un objectif **PRIMAIRE → MAV** (~16-18 séries/sem, gros muscle).
- Muscles d'un objectif **SECONDAIRE → MEV** (~8-10 séries/sem) — progression plus lente, c'est voulu.
- Muscles **NON ciblés** par un objectif → **aucun travail dédié** (seulement le stimulus indirect des composés). Pas de volume de maintenance forcé.
- L'écart primaire↔secondaire doit être **net et mesurable** : le primaire clairement au-dessus (attention au piège du haut du corps qui a plus de muscles → un « bas prioritaire » doit vraiment donner plus AU BAS, par muscle).

### 4ter) Fréquence par mouvement (objectifs FORCE)
- Vise **~2×/semaine par lift principal** dès **4-5 jours** (un **jour lourd** + un **jour variation/volume** par mouvement) — **jamais** « un jour = un lift » (qui ne donne que 1× de fréquence).
- À **3 jours** : au moins **Squat et Développé 2×** (le Soulevé peut rester 1× vu sa fatigue).

### 4quater) Exécution intelligente (optionnel)
Sois le plus fin possible. Tu peux ajouter un champ **`notes`** (chaîne courte) sur un exercice pour un **cue pertinent** : tempo (ex. « tempo 3-1-0 »), **excentrique accentué**, consigne technique clé. **Uniquement quand ça sert vraiment** — pas sur chaque exo.

---

## 5) MATÉRIEL DISPONIBLE PAR TIER
**full_gym** (accès à tout) :
- Barres & racks : Barre olympique, Barre EZ, Barre trap/hex, Trap bar, Rack squat, Rack demi-cage, Smith machine, Banc plat, Banc réglable, Banc décliné
- Poids libres : Haltères, Kettlebells, Disques olympiques, Medicine ball, Wall ball, Bulgarian bag
- Câbles : Câble poulie haute, Câble poulie basse, Station câbles double, Poulie réglable
- Machines : Pec deck, Développé couché machine, Développé incliné machine, Tirage vertical, Rowing assis machine, Rowing horizontal machine, Rowing T-bar machine, Développé épaules machine, Élévations latérales machine, Curl biceps machine, Preacher curl machine, Triceps machine, Dips triceps machine, Leg press, Hack squat machine, Leg extension, Belt squat machine, Leg curl allongé, Leg curl assis, Hip thrust machine, Fessier machine, Abducteur machine, Adducteur machine, Mollets debout machine, Mollets assis machine, Crunch abdos machine, Chaise romaine, Captain chair
- Suspension/traction : Barre de traction, Anneaux de gymnaste, Sangles TRX, Barre de dips, Barres parallèles
- Accessoires : Élastiques de résistance, Mini-bands, Swiss ball, Gilet lesté, Ceinture de lest, Roulette abdominale, Corde à sauter, Boîte pliométrique

**bodyweight** (parc / street) — **uniquement** :
- Barre de traction haute, Barres parallèles, Barre basse, Anneaux de gymnaste, Sangles TRX, Élastiques de résistance, Gilet lesté, Ceinture de lest
- (et évidemment le poids du corps, `equipment: []`)

Un exercice n'est valide dans un tier que si **tout son matériel** est dans la liste du tier.

---

## 6) LIVRAISON
- Génère **par lots** (ex. un lot par `level` × `training_context`), un **tableau JSON valide par lot**.
- Numérote les lots, dis-moi combien il en reste.
- À la **toute fin**, donne la **liste dédupliquée de tous les exercices utilisés** au format :
  `{ "name", "muscle_group", "muscles_secondary", "block", "equipment" }` — pour que je l'intègre proprement.

Commence quand tu es prêt. Prends le temps qu'il faut.
