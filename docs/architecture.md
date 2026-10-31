# Architecture

## Périmètre et étapes

1. Architecture, backlog, sécurité et guide de style.
2. Next.js App Router, TypeScript strict, Tailwind CSS, composants shadcn/ui, routes publiques, lint et CI.
3. Migration Supabase, RLS, Auth SSR, rôles et tests PostgreSQL.
4. CMS : brouillon → revue → publication, audit, validation des vidéos et URL.
5. Lecteur de contenu sécurisé, vidéos après interaction, liens transparents.
6. Évaluations corrigées côté serveur, limites transactionnelles de tentatives, progression, devoirs, certificats.
7. Rédaction de 40 leçons par groupes de quatre, avec relecture humaine du créole.
8. Recherche, analytique consentie, accessibilité et performance.
9. E2E authentifiés, revue sécurité, sauvegarde/restauration et déploiement.

Les étapes 1–3 sont le premier incrément ; aucune publication de cours n'est impliquée. Le plan de cours local sert au catalogue de pré-lancement. Le seed SQL conserve exactement ces métadonnées en brouillon ; le CMS remplacera le catalogue statique par des requêtes sur le contenu publié. Cette divergence transitoire est explicite.

## Frontières

Les Server Components lisent Supabase avec la clé publique et les cookies de l'utilisateur. Les Server Actions valident les entrées avec Zod. Next.js vérifie l'origine des Server Actions pour la protection CSRF ; ne pas élargir les origines sans besoin. Le proxy rafraîchit la session. Les pages privées appellent `getUser`, les opérations éditoriales appellent une garde de capacité et la base applique les RLS même en cas de requête directe.

Les rôles sont stockés dans `profiles`, jamais pris depuis les métadonnées soumises à l'inscription. Les opérations admin requièrent AAL2 côté serveur et SQL. L'élève ne dispose d'aucun grant sur les colonnes de rôle, de score ou de note. Les clés de correction résident dans un schéma privé hors des schémas API exposés. Elles ne sont pas simplement masquées dans le client.

## Contenu

Le Markdown/MDX sera traité comme donnée non fiable. Ne pas exécuter du JavaScript MDX arbitraire reçu du CMS. Prévoir un sous-ensemble Markdown/MDX explicitement autorisé, sans imports, expressions ni JSX arbitraire, puis assainir les URLs et HTML. Aucun rendu MDX distant n'est activé dans cet incrément.

## Données

Migration versionnée : profils, cours, modules, leçons, vidéos, outils, inscriptions, progression, notes, favoris, quiz, questions, clés privées, tentatives, devoirs, soumissions, certificats, événements affiliés, audit et consentements. Index et contraintes couvrent les ordres, relations, états et valeurs de notes. Les fonctionnalités non implémentées restent fermées, notamment génération des scores et certificats.

## Dépendances et exécution

Node 22/24, Next.js 16, React 19, PostgreSQL 17, Supabase Auth et SSR, Zod, React Hook Form, Radix, Vitest, Testing Library, Playwright et axe. Le lockfile fixe les versions effectives. Aucune police ou image externe requise. Deux workers de build limitent la consommation du cloud. Le mode compilateur TypeScript API est utilisé pour éviter un échec de capture de sortie du CLI dans l'environnement géré, sans désactiver le typecheck.

Services requis pour l'authentification : Supabase et SMTP/confirmation e-mail ; nécessaires avant lancement : domaine de l'opérateur, coordonnées et politiques finalisées. Les pages publiques restent consultables sans ces services.
