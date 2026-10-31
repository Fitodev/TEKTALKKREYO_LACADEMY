# TEKTALKKREYÒL ACADEMY

Plateforme de formation en créole haïtien, construite à partir du [cahier des charges](docs/specification.md).

## État réel

Fondations en cours : Next.js App Router, TypeScript strict, Tailwind 4, bouton shadcn/ui (Radix), catalogue consultable, recherche locale et plan de 10 modules / 40 leçons. Auth Supabase SSR, récupération de mot de passe et MFA TOTP sont implémentés, à valider avec une instance Supabase complète. Migration avec RLS et seed idempotent en brouillon. Les tests PostgreSQL isolés vérifient les règles SQL, sans simuler la vérification des JWT ni GoTrue.

Le CMS, le lecteur MDX, les évaluations, la progression, la correction des devoirs, les certificats et les 40 textes pédagogiques complets restent à réaliser. Aucun contenu de plan n'est publié comme une leçon. Pas de vidéo ni de lien affilié inventé. Les pages légales sont des versions de développement à finaliser avant ouverture publique.

## Développement

Prérequis : Node 22 ou 24, npm ; Docker pour les tests SQL et Supabase local.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Sans Supabase, les pages publiques fonctionnent, les espaces privés redirigent et les formulaires de compte signalent leur indisponibilité. Ne pas interpréter cela comme un mode d'authentification de démonstration.

Pour les comptes réels : créer un projet Supabase de développement ou lancer `npm run db:start`. Renseigner `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` et `NEXT_PUBLIC_SITE_URL` dans `.env.local`. Ne jamais utiliser une clé service_role. Appliquer les migrations et le seed à une base de développement revue ; le seed ne publie rien. Configurer les URL de redirection, la confirmation des e-mails, les limites d'envoi et MFA TOTP. Voir [déploiement](docs/deployment.md).

Les variables `NEXT_PUBLIC_*` sont incorporées à la compilation : reconstruire après changement.

## Vérifications

```sh
npm run lint
npm run typecheck
npm test
npm run db:test
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
npm run format:check
```

Dans le cloud où Chromium est déjà installé, utiliser `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e`. Le serveur de production est lancé par Playwright après le build. `npm run db:test` utilise un conteneur PostgreSQL sans réseau, des contrats Auth minimaux, deux exécutions du seed et des assertions RLS réelles. Il supprime son propre conteneur à la fin. Ne pas exécuter le bootstrap SQL de test sur Supabase.

Les tests Auth/SMTP/MFA de bout en bout sur une vraie instance, Lighthouse mobile, revue humaine du créole et restauration des sauvegardes sont encore requis avant lancement. Voir [backlog](docs/backlog.md) et [rapport de validation](docs/validation.md).

## Documentation

- [Architecture](docs/architecture.md)
- [Sécurité et menaces](docs/security.md)
- [Style des contenus](docs/content-style-guide.md)
- [Guide administrateur](docs/admin-guide.md)
- [Guide utilisateur](docs/user-guide.md)
- [Déploiement](docs/deployment.md)

## Connexion Google et contrôle des clés

Le bouton Google est disponible dans les formulaires, via Supabase PKCE côté serveur. Activer le fournisseur et régler les retours dans les consoles avant usage réel : [guide Google Auth](docs/google-auth.md). Utiliser `SITE_URL` pour l’origine serveur de production. Les secrets Google restent dans Supabase.

`npm run security:audit` vérifie les fichiers locaux, l’historique accessible et les artefacts navigateur. Le prébuild bloque les clés privilégiées dans les variables publiques. Consulter le [rapport ciblé et ses limites](docs/security-review-2026-10-31.md).

Les fichiers `.env*` (sauf `.env.example` sans clés), certificats/clés privées, fichiers de comptes de service, dossiers `secrets/` et `.vercel/` sont exclus de Git et du contexte Docker. `.gitignore` ne retire pas un fichier déjà suivi : le contrôle de sécurité refuse également les chemins de credentials déjà indexés. Les valeurs réelles restent dans les réglages sécurisés Vercel/Supabase, jamais dans le fichier `.gitignore` lui-même.
