# Guide administrateur — fondations

1. Configurer Supabase de développement et appliquer la migration et le seed. Les contenus restent en brouillon.
2. Créer un compte par le formulaire et confirmer l'adresse e-mail.
3. Dans un contexte SQL administratif sécurisé, identifier l'UUID exact du compte et attribuer le rôle `admin` à ce profil. Ne jamais donner de clé service_role au navigateur ni promouvoir via raw_user_meta_data.
4. Dans « Sekirite kont lan », enregistrer une application TOTP puis vérifier un code. Le rôle admin seul ne donne pas les capacités administratives sans AAL2.
5. Ouvrir `/admin`. Cette page vérifie la capacité ; le CMS n'est pas encore implémenté. Un éditeur peut accéder à cette porte d'entrée sans droit de publication.

Les fonctions de publication, de gestion de questions, de rôles, d'affiliation et d'analytique restent au backlog. Ne pas éditer un cours published directement par SQL pour contourner le processus futur. Prévoir l'audit et la gestion de récupération MFA avant lancement.
