# BookReader Server

API backend pour l'application BookReader de lecture numérique.

## 🚀 Déploiement

### Prérequis

- Node.js >= 18.0.0
- MongoDB Atlas compte
- Compte Render.com

### Configuration

1. Créez un compte MongoDB Atlas et une base de données
2. Créez un cluster et obtenez l'URI de connexion
3. Configurez les variables d'environnement dans Render.com :
   - `PORT`: Port du serveur (auto-configuré par Render)
   - `MONGODB_URI`: URI de connexion MongoDB Atlas
   - `JWT_SECRET`: Clé secrète pour les tokens JWT
   - `NODE_ENV`: "production"

### Déploiement sur Render.com

1. Connectez votre dépôt GitHub à Render.com
2. Créez un nouveau Web Service
3. Sélectionnez le dépôt
4. Configurez le build :
   - Build Command : `npm install && npm run build`
   - Start Command : `npm start`
5. Ajoutez les variables d'environnement
6. Déployez !

## 📝 API Documentation

### Authentification

- POST `/api/auth/register` - Inscription
- POST `/api/auth/login` - Connexion
- GET `/api/auth/profile` - Profil utilisateur
- PUT `/api/auth/profile` - Mise à jour du profil
- POST `/api/auth/reset-password` - Réinitialisation du mot de passe

### Livres

- GET `/api/books` - Liste des livres
- POST `/api/books/upload` - Upload d'un livre
- GET `/api/books/:id` - Détails d'un livre
- PUT `/api/books/:id` - Mise à jour d'un livre
- DELETE `/api/books/:id` - Suppression d'un livre

## 🔧 Développement local

1. Clonez le dépôt
2. Installez les dépendances : `npm install`
3. Créez un fichier `.env` avec les variables nécessaires
4. Lancez en mode développement : `npm run dev`

## 📦 Scripts disponibles

- `npm start` - Lance le serveur en production
- `npm run dev` - Lance le serveur en développement
- `npm run build` - Compile le TypeScript
- `npm run postinstall` - Script post-installation pour Render.com 