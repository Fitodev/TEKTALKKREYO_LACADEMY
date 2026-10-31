# Backlog et critères de sortie

## Premier incrément

- [x] Document de référence conservé, architecture et risques.
- [x] Next.js strict, Tailwind, composant bouton shadcn/ui, pages publiques en créole.
- [x] Catalogue filtrable et plan fidèle des 10 modules / 40 leçons.
- [x] Auth SSR, formulaires, confirmation, récupération, changement de mot de passe, MFA TOTP.
- [x] Schéma SQL, RLS, seed brouillon et tests isolés PostgreSQL.
- [x] Configuration de tests et CI.
- [ ] Valider les parcours de comptes sur Supabase complet avec SMTP et sessions réelles.

## Parcours pédagogiques

- [ ] CMS sécurisé, audit transactionnel, prévisualisation et workflow de publication.
- [ ] Rédiger quatre leçons du module 1 (800–1200 mots utiles chacune), démonstrations, cinq questions et devoirs spécifiques ; relecture humaine avant publication.
- [ ] Répéter pour les modules 2–10 sans recycler les questions génériques du plan comme contenu final.
- [ ] Lecteur Markdown/MDX sans exécution de code non fiable ; composants autorisés.
- [ ] Inscriptions et reprise de progression, favoris, notes, sauvegarde de brouillons.
- [ ] Moteur de quiz transactionnel : réponses privées, échantillonnage de dix questions, seuil 80%, trois tentatives, révision entre les tentatives.
- [ ] Correction manuelle des questions ouvertes, pas de réussite automatique par correspondance naïve.
- [ ] Devoirs, rubrique de notation, stockage privé et URLs signées, limites MIME et taille.
- [ ] Projet final validé et émission atomique de certificat après 40 leçons et 10 examens réussis ; vérification publique minimale.

## Publication et exploitation

- [ ] Vérification des vidéos, droits et embedding ; état « Videyo ap vini » sinon.
- [ ] Validation des domaines affiliés et redirections ; consentement séparé analytics / marketing.
- [ ] Rate limiting distribué au niveau API/edge ; appliquer les paramètres Auth au projet hébergé.
- [ ] Tests HTTP RLS avec vrais JWT, tests E2E élève/éditeur/admin AAL1 et AAL2.
- [ ] Finaliser responsable légal, contacts, pays, conservation et effacement/export.
- [ ] Revue humaine du créole, WCAG 2.2 AA manuelle, Lighthouse mobile cible 90+.
- [ ] Sauvegarde et restauration testées en environnement distinct.
- [ ] Valider les conditions commerciales d'hébergement, licences et coûts réels.

Aucun de ces éléments non cochés n'est présenté comme livré. Priorité suivante : connecter une instance Supabase de développement, valider l'authentification, puis implémenter le CMS.
