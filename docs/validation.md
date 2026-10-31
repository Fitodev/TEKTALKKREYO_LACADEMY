# Validation du premier incrément — 31 octobre 2026

## Vérifié dans cet environnement

- `npm run lint` : réussi sans avertissement.
- `npm run typecheck` : réussi, TypeScript strict.
- `npm test` : 13 tests réussis (2 fichiers), couvrant les permissions, MFA, retours de redirection, validation des entrées, structure du programme et recherche de catalogue.
- `npm run db:test` : migration exécutée sur PostgreSQL 17, seed appliqué deux fois, 26 assertions réussies. RLS réelle : profils, notes inter-utilisateur, inscriptions, contenu publié/brouillon, rôles, publication avec AAL2, protection des réponses, scores et certificats. Le conteneur est détruit après le test.
- `npm run build` : compilation de production réussie, pages privées dynamiques.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e` : 10 tests réussis, sur ordinateur et mobile. Navigation accueil → catalogue → programme, affichage des 10 modules, redirection privée, pages d'information, véritable 404, absence de débordement horizontal à 320 px et formulaires explicitement indisponibles sans configuration.
- axe : aucune violation automatisée des tags WCAG 2 A/AA, 2.1 AA et 2.2 AA sur accueil, catalogue, connexion, inscription et programme, dans les deux profils navigateur. Ce résultat ne constitue pas une certification WCAG.
- `npm run format:check` et `git diff --check` : réussis.

## Corrections effectuées pendant la validation

L'extraction initiale du programme absorbait plusieurs modules dans un titre ; corrigée et contrôlée par le test exact 10×4. Le build Next.js échouait lors de la lecture de la sortie du compilateur CLI ; le mode API TypeScript pris en charge est activé, sans ignorer les erreurs de types. Le démarrage de production utilise le serveur standalone et copie ses fichiers statiques. Les tests navigateur sont lancés après la fin complète du build ; le dernier passage réussit sans relance automatique.

Le téléchargement Chromium de Playwright est interdit par la politique réseau (`cdn.playwright.dev`). Le navigateur système installé est utilisé pour la validation locale. La CI peut installer son navigateur dans son propre environnement ; son exécution distante n'a pas été observée.

## Limites et travaux requis

Aucune instance Supabase ni configuration SMTP réelle n'est connectée. Les formulaires et les actions Auth sont codés, mais inscription, confirmation, reset et MFA complets ne sont pas validés avec GoTrue. Le test SQL utilise des contrats minimaux auth.uid/auth.jwt ; il ne teste ni signature JWT ni gateway HTTP. Les tests RLS via API Supabase avec de vrais JWT restent requis.

Le CMS, les leçons complètes, le lecteur de contenu, les examens, les devoirs, la progression et les certificats ne sont pas livrés. Les 40 entrées sont un plan en brouillon. Pas de lien affilié ni de vidéo inventés. La revue linguistique humaine, l'accessibilité manuelle, Lighthouse, la sécurité opérationnelle et la restauration des sauvegardes restent à réaliser avant lancement.

Les instructions `install_script` et `start_skill` et les trois noms de variables de configuration ont été sauvegardés dans le brouillon cloud. Cela ne publie pas l'environnement ni le site. Aucun commit, push ou déploiement public n'a été effectué.
