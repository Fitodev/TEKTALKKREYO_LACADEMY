# Connexion et inscription avec Google

Le bouton « Kontinye avèk Google » apparaît sur `/enskri` et `/konekte`. Il utilise Supabase Auth côté serveur avec PKCE ; aucune bibliothèque Google, aucun secret OAuth et aucun jeton de fournisseur n'est envoyé par notre code au navigateur. La clé publique Supabase est nécessaire au fonctionnement et peut être visible.

## Configuration à effectuer dans les consoles

1. Dans Google Cloud, configurer l'écran de consentement OAuth et créer un client OAuth de type application Web pour le compte/l'organisation du projet. Limiter les scopes à email et profil. En mode Test, autoriser explicitement les comptes de test ; pour une ouverture publique, finaliser les exigences Google applicables.
2. Dans Supabase → Authentication → Providers → Google, activer Google et renseigner le Client ID et le Client Secret. **Le Client Secret reste dans Supabase : jamais dans `NEXT_PUBLIC_*`, le dépôt ou une conversation.** Copier l'URL callback indiquée par Supabase dans les URI de redirection autorisées du client Google. Elle ressemble à `https://<project-ref>.supabase.co/auth/v1/callback` (utiliser l'adresse exacte affichée).
3. Dans Supabase → Authentication → URL Configuration, définir l'origine HTTPS stable du site et autoriser exactement `https://<domaine-production>/auth/confirm`. Conserver également le retour de récupération de mot de passe documenté dans `deployment.md`. Éviter les wildcards de production. Le retour Google → Supabase et le retour Supabase → application sont deux URL distinctes.
4. Dans Vercel → projet → Settings → Environment Variables, vérifier `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Seule une clé `sb_publishable_…` ou une ancienne clé JWT `anon` est acceptée. Ne pas utiliser `service_role`, `sb_secret_…`, un jeton Vercel ou une clé Google secrète dans une variable publique.
5. Définir de préférence **`SITE_URL`**, variable côté serveur, avec l'origine HTTPS stable du site (sans chemin). L'ancien `NEXT_PUBLIC_SITE_URL` reste pris en charge. Sur Vercel, une valeur localhost n'est jamais utilisée comme retour public : le nom `VERCEL_PROJECT_PRODUCTION_URL` fourni par Vercel sert de repli. Ne pas définir ce dernier à partir d'un en-tête de requête.
6. Redéployer après les changements de configuration. Les variables `NEXT_PUBLIC_*` sont incorporées au build.

Le lien fourni dans cette conversation pointe sur un déploiement Vercel précis. Consulter Settings → Domains pour identifier le domaine de production stable ; ne pas deviner son adresse. Les réglages de l'environnement cloud ne configurent pas automatiquement ceux de Vercel ni de Supabase.

## Mesures appliquées

- Server Action en POST avec protection d'origine Next.js et vérification serveur de l'acceptation des conditions. Le consentement est demandé aussi sur la page de connexion, car Google peut créer un nouveau compte lors du premier accès.
- Supabase SSR génère le vérificateur PKCE, échangé au retour via `exchangeCodeForSession`. Aucun accès Google Drive ou jeton offline n'est demandé.
- Redirection de départ limitée à l'origine du projet Supabase et au chemin `/auth/v1/authorize`.
- Cookies host-only, `HttpOnly`, `SameSite=Lax` et `Secure` en production. Les clients Supabase de cette application sont exclusivement côté serveur ; un futur client Auth navigateur nécessitera une revue de cette décision.
- Retours finaux relatifs, codes et token_hash retirés des destinations, `Cache-Control: private, no-store` et `Referrer-Policy: no-referrer` sur le callback.
- Les erreurs Google ne reflètent ni diagnostics techniques ni `error_description` non fiable.
- Les rôles restent lus dans `profiles` et les RLS, jamais depuis le rôle déclaré dans les métadonnées Google. Google ne remplace pas le MFA TOTP obligatoire pour les capacités admin.

L'acceptation dans le formulaire n'est pas un journal légal durable. Si la version des conditions doit être opposable, ajouter un registre de consentement versionné lors d'un travail distinct ; ne pas confondre cette case avec une preuve juridique.

## Tests

`npm test` couvre les refus de consentement, la construction du flux, les origines sûres, les erreurs, les retours hostiles et le callback. Les tests navigateur vérifient la navigation vers Supabase et les flags du cookie PKCE en interceptant le départ OAuth, sans compte Google réel. L'authentification jusqu'au retour d'un vrai compte Google reste à tester après activation du fournisseur et réglage des URL.

Pour cette vérification manuelle : ouvrir une fenêtre privée, accepter les conditions, choisir Google, terminer le consentement, vérifier l'arrivée sur `/tablo-bod`, se déconnecter, puis recommencer par `/konekte`. Tester aussi l'annulation, l'accès `/admin` sans rôle et l'absence d'AAL2 pour un administrateur. Ne pas copier les codes OAuth ou cookies dans des tickets/logs ; configurer également leur masquage chez l'hébergeur.
