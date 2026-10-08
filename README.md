# Osiris AGS · Le Cercle Privé

Landing page statique (HTML, CSS, JS) + une fonction Vercel pour l'API Conversions de Meta.

- `index.html` : la page complète (Pixel Meta inclus)
- `assets/img/` : photos et captures en WebP
- `api/lead.js` : envoie l'événement Lead à Meta côté serveur

## Variable d'environnement (obligatoire pour l'API Conversions)
Vercel > Projet > Settings > Environment Variables
- Name : `META_CAPI_TOKEN`
- Value : le token d'accès de l'API Conversions
- Environnements : Production, Preview, Development

Ne mets JAMAIS le token dans un fichier du dépôt.

Optionnel, pour tester dans le Gestionnaire d'événements : `META_TEST_EVENT_CODE` = le code de test (ex. TEST12345). Supprime-la après les tests.

## Modifier le lien du groupe
Cherche `chat.whatsapp.com` dans `index.html` et remplace le lien partout.
