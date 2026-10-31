# Déploiement et configuration

## Supabase

Créer un projet de développement distinct. Appliquer `supabase/migrations/*.sql` dans l'ordre puis `supabase/seed.sql`. Avec CLI lié : `npx supabase db push` sur le projet explicitement sélectionné après revue ; ne pas exécuter cette commande implicitement sur une base de production. Le seed est idempotent et n'écrase pas les contenus existants.

Le schéma `private` doit rester hors de la liste des schémas exposés par l'API. Configurer Auth : confirmation email, mot de passe minimum 12 caractères, MFA TOTP, SMTP réel pour production, limites d'envoi et de connexions. Les paramètres locaux se trouvent dans `supabase/config.toml` ; ils ne configurent pas automatiquement un projet hébergé.

Définir Site URL et autoriser explicitement `/auth/confirm` et `/auth/confirm?next=/kont/modpas` pour chaque domaine de l'application. Si les modèles d'email utilisent TokenHash : lien d'inscription `/auth/confirm?token_hash={{ .TokenHash }}&type=email`, lien de récupération `/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/kont/modpas`. Le callback accepte aussi les codes PKCE. Tester les deux parcours et l'expiration avant lancement.

## Application

Variables : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`. Aucune clé service_role requise. Les valeurs publiques sont intégrées au build ; reconstruire après modification.

```sh
npm ci
npm run build
npm run start
```

Préférer un hébergement Node/Docker autorisant l'usage commercial prévu. Vérifier les conditions actuelles du fournisseur, dont Vercel Hobby si envisagé. Aucune plateforme ni offre Google n'est annoncée comme gratuite sans conditions.

## Docker

Le Dockerfile produit l'output standalone Next.js et lance un utilisateur non root. Fournir les trois variables publiques comme build args. Ne jamais fournir de secret d'administration comme build arg. Dans le cloud géré, Docker hérite du proxy ; passer la CA de session en secret BuildKit à l'étape npm si nécessaire : `docker build --secret id=proxy_ca,src="$CODEX_PROXY_CERT" ...`. Le Dockerfile conserve la vérification TLS et n'incorpore pas la CA de session.

Terminer TLS au reverse proxy, activer HSTS en HTTPS, contrôler Host/origines et limites de requêtes. Ne pas exposer Studio, PostgreSQL ou la boîte mail de développement. Les conteneurs des tests SQL n'exposent aucun port.

## Validation et publication

Exécuter les vérifications du README, des parcours Auth complets avec comptes fictifs, les tests HTTP RLS et une restauration de sauvegarde. Finaliser les pages légales et relire le créole. Les tests locaux SQL ne suffisent pas à déclarer Supabase Auth prêt. Publication et déploiement sont des étapes distinctes ; aucun déploiement public n'est effectué par la création de ce dépôt.
