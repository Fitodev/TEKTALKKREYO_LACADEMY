# Sécurité et modèle de menaces

## Actifs et menaces

| Actif              | Menace                                     | Contrôle initial / restant                                                                                                             |
| ------------------ | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Comptes            | vol de session, brute force                | Supabase Auth SSR, cookies, validation serveur, MFA TOTP ; limites Auth à appliquer au projet hébergé, rate limiting distribué restant |
| Données privées    | IDOR / accès entre élèves                  | RLS sur chaque table, droits par colonne, tests PostgreSQL réels                                                                       |
| Rôles              | auto-promotion par profil ou métadonnées   | trigger impose student, update limité à display_name, rôle lu dans la base                                                             |
| Publication        | éditeur publie ou modifie un enfant publié | politiques restrictives, AAL2 admin ; CMS/audit à implémenter                                                                          |
| Réponses et scores | récupération anticipée ou falsification    | schéma privé pour clés, aucun insert de score/certificat depuis le navigateur                                                          |
| Contenu            | XSS ou exécution MDX                       | React échappe le texte, aucun rendu MDX arbitraire ; pipeline sûr avant CMS                                                            |
| Affiliation        | redirection ouverte / SSRF                 | aucun redirect dans cet incrément ; allowlist HTTPS et vérification de chaque saut avant activation                                    |
| Uploads            | malware / fichiers publics                 | stockage désactivé ; politiques privées, limites et URLs signées avant activation                                                      |

## Défenses initiales

Toutes les mutations Auth utilisent des Server Actions, validation Zod et messages d'erreur qui ne recopient pas la réponse technique du fournisseur. Reset utilise une réponse générique. La destination de retour est limitée aux chemins locaux. MFA utilise challengeAndVerify pour un facteur appartenant à la session. Ne jamais exposer les QR TOTP dans les logs.

CSP, anti-framing, nosniff, permissions et referrer policy sont configurés. La CSP autorise actuellement `unsafe-inline` pour l'hydratation Next.js ; elle doit évoluer vers des nonces testés avant ouverture du CMS. HSTS est à configurer au reverse proxy HTTPS ; ne pas le forcer en développement HTTP.

Aucune clé service_role dans le frontend ou les instructions. Les variables publiques Supabase ne sont pas des secrets d'administration. Ne pas utiliser de données de production pour les tests. La fixture SQL de test reproduit uniquement les contrats auth.uid/auth.jwt et ne valide pas les signatures de JWT.

## Avant lancement

Tester GoTrue, SMTP, expiration/rotation de sessions, CSRF cross-origin, JWT réels, refus inter-utilisateur via HTTP, AAL2 et récupération MFA ; limiter les requêtes à l'edge et conserver les limites Auth. Activer TLS, journaux sans secrets, alertes et sauvegardes avec restauration exercée. Définir suppression/export et conservation. Pas d'analytique ni marketing avant consentement indépendant.

## Retour arrière

Sauvegarder avant migration et tester sur copie. Cette première migration crée le schéma ; sur une base vide de développement, recréer la base est possible. En production, ne pas lancer de DROP CASCADE automatique : revenir au déploiement précédent, restaurer une sauvegarde validée ou écrire une migration corrective revue. La suppression d'un utilisateur cascade les données privées ; les identifiants d'acteur d'audit deviennent NULL.
