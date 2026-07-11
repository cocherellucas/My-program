import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, FileText } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Pages juridiques — accessibles SANS compte (exigence légale).
// ⚠️ Modèles rédigés pour Coach IA : à faire relire par un professionnel du
// droit avant toute commercialisation, et compléter les champs [À COMPLÉTER].
// ─────────────────────────────────────────────────────────────────────────────

const UPDATED = '8 juillet 2026';
const CONTACT = 'cocherellucas@gmail.com';

const DOCS = {
  cgu: {
    title: "Conditions Générales d'Utilisation",
    sections: [
      { h: '1. Objet et acceptation', c: [
        `Les présentes Conditions Générales d'Utilisation (« CGU ») régissent l'accès et l'utilisation de l'application Coach IA (« l'Application »), éditée par Lucas Cocherel (« l'Éditeur »).`,
        `La création d'un compte ou l'utilisation de l'Application vaut acceptation pleine et entière des présentes CGU et de la Politique de confidentialité. Si tu n'acceptes pas ces conditions, n'utilise pas l'Application.`,
      ]},
      { h: '2. Description du service', c: [
        `Coach IA est une application de suivi d'entraînement sportif : création et importation de programmes, planification et suivi de séances (charges, répétitions, repos), suivi de mesures corporelles, et conseils d'entraînement générés automatiquement par des règles logicielles (ajustement de volume, suivi de gênes, recommandations de récupération).`,
        `Le service est fourni « en l'état ». Les fonctionnalités peuvent évoluer, être ajoutées ou retirées à tout moment.`,
      ]},
      { h: '3. Avertissement santé — IMPORTANT', c: [
        `L'Application N'EST PAS un dispositif médical et NE FOURNIT AUCUN avis, diagnostic ou traitement médical. Les contenus et conseils (programmes, ajustements de charge ou de volume, messages relatifs aux douleurs, estimations caloriques) sont générés automatiquement, à titre purement informatif et général. Ils ne remplacent en aucun cas l'avis d'un médecin, d'un kinésithérapeute ou de tout autre professionnel de santé.`,
        `Avant de commencer ou de reprendre une activité physique, consulte un médecin, en particulier en cas d'antécédents médicaux (cardiaques, articulaires, respiratoires…), de blessure, de grossesse, ou de traitement en cours.`,
        `En cas de douleur vive, inhabituelle ou persistante pendant l'utilisation de l'Application, arrête immédiatement l'exercice et consulte un professionnel de santé. Les messages de l'Application relatifs aux douleurs sont de simples aides informatives et ne constituent jamais un avis médical.`,
        `En utilisant l'Application, tu déclares être apte à la pratique sportive et tu reconnais pratiquer sous ta seule responsabilité.`,
      ]},
      { h: '4. Compte utilisateur', c: [
        `L'inscription est réservée aux personnes âgées d'au moins 15 ans (les mineurs de moins de 15 ans doivent disposer de l'accord d'un titulaire de l'autorité parentale).`,
        `Tu t'engages à fournir des informations exactes et à les maintenir à jour, à garder tes identifiants confidentiels, et à ne créer qu'un seul compte personnel. Toute activité effectuée depuis ton compte est réputée effectuée par toi.`,
        `L'Éditeur peut suspendre ou supprimer un compte en cas de violation des présentes CGU, de fraude ou d'usage abusif du service, après notification sauf urgence.`,
      ]},
      { h: '5. Offres et tarifs', c: [
        `L'Application propose une offre gratuite (« Starter »). Des offres payantes peuvent être proposées ; leurs caractéristiques, prix, durée et conditions de renouvellement et de résiliation sont présentés dans l'Application avant toute souscription.`,
        `Conformément au Code de la consommation, pour un service numérique dont l'exécution commence immédiatement à ta demande, tu peux renoncer expressément à ton droit de rétractation de 14 jours au moment de la souscription. À défaut, le droit de rétractation s'applique.`,
        `Les prix sont indiqués en euros, toutes taxes comprises. Toute évolution tarifaire sera notifiée avant son application et ne s'appliquera qu'aux périodes suivantes.`,
      ]},
      { h: '6. Propriété intellectuelle', c: [
        `L'Application, sa marque, son logo, ses textes, sa base d'exercices et son code sont protégés par le droit de la propriété intellectuelle et restent la propriété exclusive de l'Éditeur.`,
        `L'Éditeur t'accorde une licence d'utilisation personnelle, non exclusive, non cessible et révocable, limitée à l'usage prévu de l'Application. Toute reproduction, extraction, revente ou décompilation est interdite.`,
        `Les données que tu saisis (séances, mesures, notes) restent les tiennes. Tu accordes à l'Éditeur le droit de les traiter uniquement pour fournir le service, conformément à la Politique de confidentialité.`,
      ]},
      { h: '7. Disponibilité du service', c: [
        `L'Éditeur s'efforce d'assurer un accès continu au service, sans garantie d'absence d'interruption (maintenance, panne, mise à jour, cas de force majeure). L'Application peut nécessiter une connexion internet pour certaines fonctions.`,
        `Des sauvegardes raisonnables sont effectuées, mais il t'appartient de conserver par tes propres moyens les informations qui te sont essentielles.`,
      ]},
      { h: '8. Responsabilité', c: [
        `L'utilisation de l'Application et la pratique des exercices proposés se font sous ta seule responsabilité. Dans les limites autorisées par la loi, l'Éditeur ne saurait être tenu responsable des blessures ou dommages résultant de la pratique sportive, d'une mauvaise exécution des exercices, du non-respect de l'avertissement santé (article 3), ou d'un usage non conforme de l'Application.`,
        `L'Éditeur n'est pas responsable des dommages indirects (perte de données liée à un cas de force majeure, préjudice d'agrément, etc.).`,
        `Rien dans les présentes CGU n'exclut ou ne limite la responsabilité de l'Éditeur en cas de dol, de faute lourde, ou de dommage corporel causé par un manquement prouvé de sa part, ni aucune responsabilité qui ne peut être limitée en vertu de la loi.`,
      ]},
      { h: '9. Données personnelles', c: [
        `Le traitement de tes données personnelles (y compris tes données de santé, avec ton consentement explicite) est décrit dans la Politique de confidentialité, qui fait partie intégrante des présentes CGU.`,
      ]},
      { h: '10. Modification des CGU', c: [
        `L'Éditeur peut modifier les présentes CGU. Toute modification substantielle sera portée à ta connaissance dans l'Application. La poursuite de l'utilisation après notification vaut acceptation ; à défaut, tu peux cesser d'utiliser le service et demander la suppression de ton compte.`,
      ]},
      { h: '11. Résiliation', c: [
        `Tu peux cesser d'utiliser l'Application à tout moment et demander la suppression de ton compte et de tes données en écrivant à ${'' + CONTACT}.`,
      ]},
      { h: '12. Droit applicable et litiges', c: [
        `Les présentes CGU sont soumises au droit français. En cas de litige, une solution amiable sera recherchée en priorité : contacte d'abord ${'' + CONTACT}.`,
        `Conformément au Code de la consommation, tu peux recourir gratuitement à un médiateur de la consommation [À COMPLÉTER : médiateur à désigner en cas d'activité commerciale] ou à la plateforme européenne de règlement en ligne des litiges (ec.europa.eu/consumers/odr).`,
        `À défaut de résolution amiable, les tribunaux français sont compétents.`,
      ]},
      { h: '13. Contact', c: [
        `Pour toute question relative aux présentes CGU : ${'' + CONTACT}.`,
      ]},
    ],
  },

  confidentialite: {
    title: 'Politique de confidentialité',
    sections: [
      { h: '1. Responsable du traitement', c: [
        `Les données personnelles collectées via l'application Coach IA sont traitées par Lucas Cocherel (« l'Éditeur »), joignable à ${'' + CONTACT}.`,
      ]},
      { h: '2. Données collectées', c: [
        `• Données de compte : adresse email, nom (facultatif), mot de passe (stocké sous forme hachée par notre prestataire d'authentification — jamais en clair).`,
        `• Données de profil : âge, sexe, taille, poids, taux de masse grasse, mensurations, niveau sportif, équipement disponible, disponibilités d'entraînement, préférences d'exercices, zones sensibles déclarées.`,
        `• Données d'entraînement : programmes, séances réalisées, charges, répétitions, temps de repos, fatigue ressentie, gênes et douleurs signalées et leur suivi, retours sur les exercices.`,
        `• Données techniques : journaux de connexion minimaux nécessaires au fonctionnement et à la sécurité du service.`,
        `Aucune donnée n'est collectée à ton insu : tout ce qui est traité provient de ce que tu saisis dans l'Application.`,
      ]},
      { h: '3. Données de santé — consentement explicite', c: [
        `Certaines données (mensurations, fatigue, douleurs, zones sensibles) sont des données de santé au sens de l'article 9 du RGPD. Elles sont traitées uniquement avec ton consentement explicite, recueilli lors de leur saisie, et dans le seul but de personnaliser ton entraînement et d'assurer le suivi que tu as demandé.`,
        `Tu peux retirer ce consentement à tout moment en supprimant ces données (page Mémoire du coach, bouton « Tout supprimer ») ou en demandant la suppression de ton compte à ${'' + CONTACT}. Le retrait ne remet pas en cause la licéité du traitement antérieur.`,
      ]},
      { h: '4. Finalités et bases légales', c: [
        `• Fournir le service (compte, programmes, suivi de séances) — exécution du contrat (CGU).`,
        `• Personnaliser les programmes et les conseils automatisés — exécution du contrat, et consentement explicite pour les données de santé.`,
        `• Assurer la sécurité du service — intérêt légitime.`,
        `Aucune publicité ciblée, aucune vente de données, aucun profilage à des fins tierces.`,
      ]},
      { h: '5. Destinataires et sous-traitants', c: [
        `Tes données ne sont partagées avec personne, à l'exception de nos sous-traitants techniques strictement nécessaires au fonctionnement :`,
        `• Supabase, Inc. — hébergement de la base de données et authentification (supabase.com).`,
        `• Vercel, Inc. — hébergement de l'application (vercel.com).`,
        `Ces prestataires traitent les données pour notre compte, dans le cadre de contrats conformes au RGPD. Tes données peuvent être communiquées aux autorités si la loi l'exige.`,
      ]},
      { h: '6. Transferts hors Union européenne', c: [
        `Nos prestataires d'hébergement peuvent traiter certaines données en dehors de l'Union européenne (notamment aux États-Unis). Ces transferts sont encadrés par des garanties reconnues par le RGPD (clauses contractuelles types de la Commission européenne et/ou certification au cadre de protection des données UE-États-Unis). [À COMPLÉTER : préciser la région d'hébergement de la base de données choisie dans Supabase.]`,
      ]},
      { h: '7. Durées de conservation', c: [
        `• Données de compte, de profil et d'entraînement : conservées tant que ton compte est actif.`,
        `• Après demande de suppression du compte : suppression effective sous 30 jours (hors obligations légales de conservation).`,
        `• Journaux techniques : durée limitée nécessaire à la sécurité.`,
      ]},
      { h: '8. Tes droits', c: [
        `Conformément au RGPD et à la loi Informatique et Libertés, tu disposes des droits suivants sur tes données : accès, rectification, effacement, portabilité, limitation du traitement, opposition, retrait du consentement à tout moment, et directives post-mortem.`,
        `Pour les exercer : écris à ${'' + CONTACT} (une preuve d'identité pourra être demandée en cas de doute raisonnable). Réponse sous un mois.`,
        `Tu peux également introduire une réclamation auprès de la CNIL (cnil.fr).`,
      ]},
      { h: '9. Cookies et stockage local', c: [
        `L'Application n'utilise ni cookies publicitaires ni traceurs tiers. Seul un stockage local strictement fonctionnel est utilisé sur ton appareil : session de connexion, préférences d'affichage, brouillons de séance en cours, état des tutoriels. Ces informations restent sur ton appareil et ne servent à aucun suivi.`,
      ]},
      { h: '10. Sécurité', c: [
        `Mesures mises en œuvre : chiffrement des échanges (HTTPS), cloisonnement des données par utilisateur au niveau de la base de données (Row Level Security), mots de passe hachés, accès restreints.`,
        `Aucun système n'étant infaillible, en cas de violation de données susceptible d'engendrer un risque élevé pour tes droits, tu seras notifié conformément au RGPD.`,
      ]},
      { h: '11. Mineurs', c: [
        `Le service n'est pas destiné aux moins de 15 ans sans l'accord d'un titulaire de l'autorité parentale. Si un compte a été créé en violation de cette règle, contacte-nous pour sa suppression.`,
      ]},
      { h: '12. Mise à jour de cette politique', c: [
        `Cette politique peut être mise à jour ; toute modification substantielle sera signalée dans l'Application. Version en vigueur : ${'' + UPDATED}.`,
      ]},
    ],
  },

  mentions: {
    title: 'Mentions légales',
    sections: [
      { h: 'Éditeur de l\'application', c: [
        `Application : Coach IA`,
        `Éditeur : Lucas Cocherel`,
        `Contact : ${'' + CONTACT}`,
        `Adresse : [À COMPLÉTER : adresse postale de l'éditeur]`,
        `[À COMPLÉTER si activité commerciale : forme juridique (ex. entrepreneur individuel), numéro SIREN/SIRET, TVA intracommunautaire le cas échéant.]`,
        `Directeur de la publication : Lucas Cocherel`,
      ]},
      { h: 'Hébergement', c: [
        `• Application : Vercel, Inc. — société de droit américain, San Francisco, Californie, États-Unis — vercel.com`,
        `• Base de données et authentification : Supabase, Inc. — société de droit américain — supabase.com`,
      ]},
      { h: 'Propriété intellectuelle', c: [
        `L'ensemble des éléments de l'application Coach IA (marque, logo, textes, interface, base d'exercices, code) est protégé par le droit de la propriété intellectuelle. Toute reproduction non autorisée est interdite.`,
      ]},
      { h: 'Signalement', c: [
        `Pour signaler un contenu ou un problème : ${'' + CONTACT}.`,
      ]},
    ],
  },
};

export default function Legal() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const docKey = ['cgu', 'confidentialite', 'mentions'].includes(params.get('doc')) ? params.get('doc') : 'cgu';
  const doc = DOCS[docKey];

  // Synchronise le fond body/html avec le violet de la page (évite la bande sombre à l'overscroll)
  React.useEffect(() => {
    document.body.classList.add('legal-active');
    document.documentElement.classList.add('legal-active');
    return () => {
      document.body.classList.remove('legal-active');
      document.documentElement.classList.remove('legal-active');
    };
  }, []);

  return (
    <div className="min-h-screen bg-violet-600">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6 pb-16">
        <div className="flex items-center gap-3">
          <button onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))} aria-label="Retour"
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-white leading-tight">{doc.title}</h1>
            <p className="text-xs text-white/50 mt-0.5">Dernière mise à jour : {UPDATED}</p>
          </div>
        </div>

        {/* Navigation entre les 3 documents */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(DOCS).map(([key, d]) => (
            <button key={key} onClick={() => navigate(`/legal?doc=${key}`, { replace: true })}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${key === docKey ? 'bg-white text-violet-700 border-white font-semibold' : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20'}`}>
              {d.title}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          {doc.sections.map(({ h, c }) => (
            <section key={h} className="rounded-2xl bg-white/10 border border-white/15 p-4 sm:p-5">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-white/50 flex-shrink-0" />
                {h}
              </h2>
              <div className="mt-2 space-y-2">
                {c.map((p, i) => (
                  <p key={i} className={`text-[13px] leading-relaxed ${p.startsWith('•') ? 'text-white/80 pl-2' : 'text-white/80'} ${p.includes('À COMPLÉTER') ? 'text-amber-300/90' : ''}`}>
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="text-[11px] text-white/40 leading-relaxed">
          Documents rédigés pour Coach IA. Les mentions « À COMPLÉTER » doivent être renseignées, et une relecture par un professionnel du droit est recommandée avant toute commercialisation.
        </p>
      </div>
    </div>
  );
}
