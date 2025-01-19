# 🚀 Crypto Portfolio Tracker

Application fullstack permettant de suivre l'évolution de la valeur d'un portefeuille Ethereum, avec visualisation graphique et historique des transactions.

## 📑 Table des Matières

- [Aperçu](#aperçu)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [API Endpoints](#api-endpoints)
- [Docker](#docker)
- [Base de données](#base-de-données)
- [Tests](#tests)
- [Contribution](#contribution)

## 🎯 Aperçu

Cette application permet de :
- Suivre la valeur d'un portefeuille Ethereum en temps réel
- Visualiser l'historique des transactions
- Convertir automatiquement les valeurs ETH en EUR
- Gérer plusieurs portefeuilles par utilisateur
- Authentifier les utilisateurs de manière sécurisée

## 💻 Technologies

### Frontend
- React 18 avec TypeScript
- Chart.js pour les graphiques
- Axios pour les requêtes HTTP
- TailwindCSS pour le styling
- JWT pour l'authentification

### Backend
- Node.js avec Express
- Prisma comme ORM
- PostgreSQL pour la base de données
- JWT pour l'authentification
- Etherscan API pour les données blockchain
- CryptoCompare API pour les prix



## 📥 Installation

1. **Cloner les repositories**
```bash
# Frontend
git clone https://github.com/johannes60-sk/front-project-crypto.git
cd front-project-crypto
npm install

# Backend
git clone https://github.com/Mehdi-Mah/server-project-crypto.git
cd server-project-crypto
npm install
```

2. **Configuration des variables d'environnement**

Frontend (.env) :
```env
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
```

Backend (.env) :
```env
# Database
DATABASE_URL=postgresql://admin:password@localhost:5432/db_project
PORT=8081
ACCESS_TOKEN_SECRET=secret_access_token
REFRESH_TOKEN_SECRET=secret_refresh_token
WALLET_ADDRESS=votre adresse de wallet

# APIs
ETHERSCAN_API_KEY="votre-clé-api-etherscan"
CRYPTOCOMPARE_API_KEY="votre-clé-api-cryptocompare"

# Email
SMTP_HOST=maildev
SMTP_PORT=1025
```

## 🐳 Docker

1. **Créer le docker-compose.yml**
```yaml
version: '3.9'

services:
  db:
    image: postgres:15
    container_name: postgres
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
      POSTGRES_DB: db_project
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

  adminer:
    image: adminer:latest
    container_name: adminer
    ports:
      - "5050:8080"  # Adminer sera accessible sur le port 5050 de l'hôte
    depends_on:
      - db

volumes:
  db_data:

```

2. **Lancer les containers**
```bash
docker-compose up -d
```

## 🗄️ Base de données

1. **Initialiser Prisma**
```bash
npx prisma generate
npx prisma migrate dev
```

2. **Schema Prisma**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            Int             @id @default(autoincrement())
  email         String          @unique
  password      String
  wallet        String
  validateAccount Boolean
  failedLoginAttempts Int       @default(0)
  accountLockedUntil  DateTime?
}

model RefreshToken {
  id        Int      @id @default(autoincrement())
  token     String
  expiredAt DateTime
}
```

## 🔌 API Endpoints

### Authentification
```
POST /api/v1/auth/register - Inscription
POST /api/v1/auth/login    - Connexion
POST /api/v1/auth/refresh  - Rafraîchir le token
POST /api/v1/auth/logout   - Déconnexion
```

### Wallet
```
GET    /api/v1/user/get_data/:address  - Données du wallet
GET    /api/v1/profile/get_wallet      - Récupérer l'adresse
PUT    /api/v1/profile/update_wallet   - Mettre à jour l'adresse
```

## 📱 Utilisation

1. **Démarrer l'application**
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm start
```

## 🧪 Tests

```bash
# Frontend
cd frontend
npm test

# Backend
cd backend
npm test
```


