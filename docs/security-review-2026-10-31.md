# Revue ciblée — Google Auth et exposition des clés

## Périmètre

Code local, tous les blobs Git accessibles localement, artefacts navigateur du build et noms/types des variables injectées. La revue ne lit pas les fichiers de comptes cloud externes et ne reproduit aucune valeur secrète dans ce rapport.

## Constatations

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` injectée est de type publishable, prévu pour être public. Une URL Supabase et une clé publishable/anon dans les fichiers navigateur ne sont pas une fuite de clé administrative. Leur sécurité dépend notamment des RLS et de la configuration Auth.
- Aucun secret détecté par le scan du dépôt, de l'historique disponible et des artefacts navigateur locaux : signatures de clés Supabase privées, JWT service_role, jetons GitHub, clés privées PEM et secrets Google, ainsi que correspondances exactes avec les valeurs secrètes déjà injectées dans cet environnement.
- `npm audit --omit=dev` ne signale aucune vulnérabilité connue dans les dépendances de production au moment de ce contrôle. Ce résultat n'est pas un audit exhaustif de la chaîne logicielle.
- La valeur SITE_URL historique du cloud pointe vers localhost. Le code utilise désormais une origine serveur validée (`SITE_URL`), avec repli contrôlé sur le domaine de production fourni par Vercel ; aucune confiance dans un en-tête Host arbitraire pour le départ OAuth.
- Les variables publiques sont vérifiées avant `next build` et `next dev`. Le test d'injection d'une clé privilégiée synthétique bloque effectivement le build. Une vérification d'exécution refuse également une clé Supabase privilégiée.
- Les cookies Auth et PKCE sont `HttpOnly`, `SameSite=Lax`, host-only et `Secure` en production. La CSP autorise uniquement les destinations nécessaires au formulaire OAuth, en plus des destinations préexistantes. Le callback n'est pas mis en cache et utilise une redirection relative pour conserver l'origine du navigateur derrière un proxy.

## Reproduction

```sh
npm run security:audit
npm test
npm run build
npm run security:audit
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e
```

Le scanner affiche des catégories et emplacements, jamais les valeurs détectées. Il ne détecte pas toutes les formes possibles de secret, les clés transformées/encodées autrement, les variables d'un compte Vercel non connecté ou les commits non accessibles localement. En cas de vraie fuite, révoquer et remplacer le secret chez son fournisseur, puis nettoyer l'historique et les anciens déploiements ; supprimer une ligne dans le dernier commit ne suffit pas.

## Limites externes

La vérification HTTP du déploiement fourni et la lecture des réglages Auth Supabase reçoivent un refus réseau 403 du proxy cloud. Il s'agit d'une limite d'inspection, pas de la preuve que le site est indisponible ou qu'une clé a fui. Les domaines exacts du déploiement et du projet Supabase ont été ajoutés au brouillon réseau en conservant `api.vercel.com` ; ce brouillon doit être appliqué avant une nouvelle vérification. Aucun secret Vercel n'a de liaison enregistrée dans le brouillon observé.

La configuration réelle du fournisseur Google, les URI autorisées, les clés dans les réglages Vercel, les anciens déploiements distants et les politiques RLS de la base hébergée n'ont pas pu être inspectés. La CSP conserve `unsafe-inline` pour l'hydratation Next.js ; le passage aux nonces reste un durcissement séparé. Les limites d'authentification Supabase et le rate limiting distribué doivent également être vérifiés sur l'instance hébergée.

Voir `google-auth.md` pour les réglages des consoles. Ne jamais envoyer de secret Google, de service_role ou de jeton Vercel dans le chat.

## Résultats finaux de cette modification

- Lint, TypeScript strict, formatage et compilation de production : réussis.
- Vitest : **38 tests réussis**, 4 fichiers.
- Playwright : **16 tests réussis**, aucun ignoré, ordinateur et mobile. Le départ OAuth est intercepté avant Google ; génération PKCE, cookie HttpOnly/Secure/SameSite, consentement et annulation sont réellement exercés. Les contrôles axe des pages d'authentification passent.
- Scan final : **88 fichiers de travail, 77 blobs historiques, 40 artefacts navigateur**, aucun secret détecté sur le périmètre décrit avant création du commit de cette modification.
- Vérifications négatives du prébuild : une clé privilégiée synthétique et des identifiants incorporés à une URL publique sont tous deux rejetés.
- Les tests navigateur ont révélé une redirection vers l'hôte interne derrière un proxy : corrigée par une Location relative, puis vérifiée. Le dernier passage complet réussit sans relance automatique.

Le succès de ces tests ne prouve pas qu'un compte Google réel peut déjà se connecter sur Vercel : l'activation du fournisseur et les réglages en ligne restent à vérifier.
