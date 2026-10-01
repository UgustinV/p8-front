# Kasa - Application de location immobilière

## Description du projet

Kasa est une application web permettant de consulter des annonces de location immobilière, de gérer ses biens en tant qu'hôte, de marquer des logements en favoris et d'échanger des messages. Le projet est développé avec **Next.js** (App Router) et **React**, et s'appuie sur une API backend externe pour la gestion des données (utilisateurs, logements, uploads d'images).

Principales fonctionnalités :
- Consultation de logements (`app/(app)/logements`)
- Détail d'un logement avec galerie photo et carrousel (`app/(app)/logements/[id]`)
- Création d'une annonce (`app/(app)/new-logement`)
- Gestion des favoris (`app/(app)/liked`)
- Messagerie (`app/(app)/messages`)
- Authentification (connexion, inscription, déconnexion) via `app/(auth)`

## Pré-requis pour l'installation

Avant d'installer le projet, assurez-vous d'avoir :

- [Node.js](https://nodejs.org/) (version 20 ou supérieure recommandée)
- [pnpm](https://pnpm.io/) (gestionnaire de paquets utilisé par le projet - `pnpm@9.9.0`)
- Un accès à l'API backend (URL fournie via la variable d'environnement `API_URL`)
- Un compte [Cloudinary](https://cloudinary.com/) pour l'upload des images (identifiants requis)

## Installation

1. Cloner le dépôt :
   ```bash
   git clone <url-du-depot>
   cd p8-front
   ```

2. Installer les dépendances :
   ```bash
   pnpm install
   ```

3. Créer un fichier `.env.local` à la racine du projet et renseigner les variables d'environnement suivantes :
   ```env
   # URL de l'API backend (par défaut : http://localhost:8000)
   API_URL=http://localhost:8000

   # Clé secrète utilisée pour signer les sessions (obligatoire)
   SESSION_SECRET=une_chaine_secrete_aleatoire

   # Identifiants Cloudinary pour l'upload des photos de logements
   CLOUDINARY_CLOUD_NAME=xxxxxxxx
   CLOUDINARY_API_KEY=xxxxxxxx
   CLOUDINARY_API_SECRET=xxxxxxxx
   CLOUDINARY_FOLDER=kasa
   ```

## Lancement du projet

### Mode développement

```bash
pnpm dev
```

L'application est alors accessible sur [http://localhost:3000](http://localhost:3000).

### Build de production

```bash
pnpm build
pnpm start
```

### Autres commandes utiles

```bash
pnpm lint        # Analyse du code avec ESLint
pnpm test        # Exécution des tests unitaires (Vitest)
pnpm test:watch  # Tests en mode watch
```