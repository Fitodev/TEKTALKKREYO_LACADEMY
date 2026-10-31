# Backend des comptes : configuration et validation

## Changements

Inscription avec consentement, confirmation e-mail et renvoi de confirmation sur `/konfime-kont`. Une session déjà confirmée renvoie directement au tableau de bord. La connexion accepte les mots de passe d'anciens comptes sans imposer rétroactivement le minimum de 12 caractères utilisé pour créer un nouveau mot de passe.

La récupération vérifie désormais le résultat réel de l'envoi au lieu d'afficher un succès en cas d'erreur SMTP ou de limite de requêtes. Le callback reconnaît la récupération PKCE et les token hashes `recovery`, même en l'absence du paramètre `next`. Il dirige alors vers `/kont/modpas`. La modification exige deux mots de passe identiques et une session Supabase vérifiée. Les formulaires gardent leurs champs après une erreur serveur. La déconnexion vérifie son résultat et les accès privés continuent de vérifier la session côté serveur.

Les profils existants sont conservés ; une migration ajoute les profils manquants pour les comptes antérieurs. Les noms Google sont utilisables pour l'affichage, jamais pour attribuer un rôle. Un étudiant ne peut pas devenir administrateur en modifiant ses métadonnées.

## Diagnostic de la production observée

Le domaine `https://tektalkkreyo-lacademy.vercel.app` sert l'application attendue. Lors du contrôle avant modification, `/konekte` affichait l'absence de configuration Supabase. Le projet Supabase accessible par la configuration cloud permet l'inscription par e-mail avec confirmation ; Google reste désactivé. La requête anonyme sans données sur `profiles` répondait `404 / PGRST205` : la table n'existe pas dans le schéma exposé de cette instance.

L'API Vercel répond `403 forbidden / Not authorized` avec le jeton injecté, y compris pour lire l'utilisateur. La configuration Vercel n'a donc pas pu être modifiée automatiquement. Aucun accès SQL ou jeton d'administration Supabase n'est fourni. Un push seul ne crée pas les tables et ne renseigne pas les variables de l'hébergeur.

## Réglages nécessaires avant validation en production

1. **Vercel → projet → Settings → Environment Variables**, cibles Production et Preview selon les besoins :
   - `SUPABASE_URL` : URL du projet Supabase.
   - `SUPABASE_PUBLISHABLE_KEY` : clé publishable ou ancienne clé anon. Jamais `service_role`, `sb_secret_…`, ni le secret OAuth Google.
   - `SITE_URL=https://tektalkkreyo-lacademy.vercel.app` pour la production vérifiée.
     Les anciens noms `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` restent pris en charge. Les réglages cloud ne sont pas les réglages Vercel. Redéployer après modification. Les valeurs restent dans les paramètres sécurisés ou `.env.local` ignoré, jamais dans Git.
2. **Supabase → SQL Editor**, sur le bon projet de développement/production après revue et sauvegarde : appliquer les migrations versionnées dans l'ordre. Sur la base encore vide, commencer par `supabase/migrations/20261031000000_foundation.sql`, puis `20261101000000_auth_profile_backfill.sql`. Ne pas exécuter les fixtures `tests/sql` sur un vrai projet. Si la fondation a déjà été appliquée, ne pas la réexécuter ; n'appliquer que la migration manquante.
3. **Supabase → Authentication → URL Configuration** : Site URL `https://tektalkkreyo-lacademy.vercel.app`, autoriser exactement `/auth/confirm` et `/auth/confirm?next=/kont/modpas` sur ce domaine. Conserver les variantes locales uniquement sur le projet de développement.
4. **Supabase → Authentication → Email** : garder la confirmation activée. Configurer un SMTP de production vérifié pour envoyer aux utilisateurs réels ; l'offre d'envoi de test Supabase peut limiter les destinataires et les quotas. Les erreurs et limites sont maintenant signalées sans détails sensibles.
5. Les modèles par défaut avec PKCE fonctionnent dans le même navigateur que la demande. Pour un lien utilisable sur un autre appareil, configurer les liens TokenHash dans les modèles Supabase :
   - confirmation : `https://tektalkkreyo-lacademy.vercel.app/auth/confirm?token_hash={{ .TokenHash }}&type=email`
   - récupération : `https://tektalkkreyo-lacademy.vercel.app/auth/confirm?token_hash={{ .TokenHash }}&type=recovery`
     Conserver l'expiration et l'usage unique du fournisseur. Ne pas publier de vrais liens de récupération dans un ticket ou une conversation.

`/api/health` expose uniquement des booléens de configuration et la révision Git Vercel, avec `no-store`. `auth.configured` ne prouve ni la livraison des e-mails ni la présence des migrations ; ces aspects doivent être vérifiés séparément.

## Test complet sans comptes réels

Pré-requis : Docker, CLI Supabase installée avec les dépendances et Chromium/Playwright.

```sh
npx supabase start -x realtime,storage-api,imgproxy,postgres-meta,studio,edge-runtime,logflare,vector,supavisor
npm run test:accounts
```

Ne pas publier la sortie brute de `supabase status` : elle contient des clés locales. Le lanceur `test:accounts` lit cette configuration en mémoire et refuse toute URL qui ne pointe pas vers localhost/127.0.0.1. Il ne charge dans le build que la configuration publique locale, pas la clé d'administration. Aucune clé de test n'est ajoutée au dépôt.

Le scénario utilise GoTrue, PostgreSQL, le gateway Supabase et Mailpit réels : création, refus d'un compte non confirmé, lecture du mail local, confirmation, accès au tableau de bord, refus admin pour un élève, déconnexion, connexion, récupération, vérification de deux mots de passe, changement, refus de l'ancien mot de passe et connexion avec le nouveau. Les comptes créés sont fictifs et restent uniquement dans la base locale.

Dans ce cloud, le contrôle Docker `wget` de GoTrue est envoyé à tort au proxy pour localhost et répond 403 ; l'instance a été conservée pour diagnostic. Les contrôles HTTP directs via le gateway répondent 200 et le scénario complet passe. Le drapeau de diagnostic `--ignore-health-check` n'est pas utilisé dans la CI normale. La livraison SMTP de production et le fonctionnement sur Vercel ne sont pas attestés par ce test local.

Après ce scénario, les artefacts `.next` correspondent à l'instance locale. Refaire `npm run build` avec la configuration habituelle avant de lancer le serveur de production hors tests. La CI exécute ce parcours isolé dans un job distinct et supprime ses conteneurs à la fin.

## Résultats de cet incrément

- `npm run lint`, `npm run typecheck`, `npm run format:check`, build et vérification des différences : réussis.
- Vitest : 62 tests réussis, dont les actions de compte, erreurs SMTP/quotas, confirmation, sessions et variantes de configuration.
- PostgreSQL : 27 assertions RLS/seed/profils réussies, plus deux vérifications de récupération idempotente des profils antérieurs, sans écraser les rôles existants.
- `npm run test:accounts` : un scénario navigateur complet réussi contre GoTrue/PostgreSQL/Kong/Mailpit réels, avec validation du nouveau mot de passe. Aucune interaction avec une boîte mail ou un compte réel.
- Suite navigateur habituelle : 16 tests réussis ; ses deux variantes du scénario de compte sont ignorées car celui-ci a sa commande isolée `test:accounts` (exécutée séparément avec succès).
- Scan : aucun secret détecté dans les fichiers de travail, l'historique accessible et les artefacts navigateur inspectés. Aucune valeur de clé ne figure dans ce rapport.

La connexion locale fonctionne de bout en bout. La configuration et la livraison e-mail de production restent à finaliser avec les accès appropriés, sans désactiver les confirmations ou les RLS.

## Contrôle complémentaire des retours de compte

Corrigé : un lien e-mail expiré (`otp_expired`, récupération ou retour mot de passe) propose les liens de récupération et de renvoi de confirmation au lieu d'afficher une erreur Google. L'accès à `/kont/modpas` conserve maintenant cette destination lorsqu'une reconnexion est nécessaire, avec validation du chemin pour empêcher une redirection externe.

Validation de ces corrections : 70 tests unitaires, 20 tests navigateur publics, build, lint, formatage et scan de secrets réussis. Les deux variantes du test de compte complet restent exclues de la suite publique et utilisent leur commande séparée ; elles n'ont pas été relancées pour cet incrément de navigation. Le précédent scénario Auth réel reste documenté ci-dessus.

Le contrôle HTTP complémentaire de la page publiée `/enskri` et de 12 ressources statiques associées n'a détecté aucun motif de secret selon les signatures vérifiées. Aucun motif de clé publique Supabase n'a été trouvé sur ce périmètre. Cela ne couvre pas l'ensemble des déploiements et des réglages privés. Au moment du contrôle, l'inscription restait désactivée et l'API Vercel refusait le jeton avec `403 forbidden`, y compris hors sandbox. Les clés n'ont pas été déplacées dans Git pour contourner cet accès refusé.
