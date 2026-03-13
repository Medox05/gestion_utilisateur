# Application de Gestion des Utilisateurs

## Description du projet

Cette application permet de gérer les utilisateurs et leurs accès aux différents sites.

Le système est composé de trois parties principales :

* **Backend :** Laravel API
* **Frontend :** React + TypeScript
* **Base de données :** Microsoft SQL Server

Fonctionnalités principales :

* Afficher les utilisateurs
* Ajouter un utilisateur
* Modifier un utilisateur
* Supprimer un utilisateur
* Gérer les accès aux sites

---

# Structure du projet

```
GESTION-USERS
├ backend        (API Laravel)
├ frontend       (React + TypeScript)
├ database
│ └ database.sql
└ README.md
```

---

# Prérequis

Avant de lancer l'application, installer les logiciels suivants :

### 1️⃣ Node.js

Télécharger :

https://nodejs.org/en/download

Vérifier l'installation :

```
node -v
npm -v
```

---

### 2️⃣ PHP

Télécharger :

https://windows.php.net/download/

Vérifier l'installation :

```
php -v
```

---

### 3️⃣ Composer

Télécharger :

https://getcomposer.org/download/

Vérifier l'installation :

```
composer -V
```

---

### 4️⃣ Microsoft SQL Server

Télécharger SQL Server Express :

https://www.microsoft.com/en-us/sql-server/sql-server-downloads

Installer également **SQL Server Management Studio (SSMS)** :

https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms

---

### 5️⃣ ODBC Driver pour SQL Server

Télécharger :

https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server

---

### 6️⃣ Extensions PHP pour SQL Server

Installer les extensions :

* `sqlsrv`
* `pdo_sqlsrv`

Documentation officielle :

https://learn.microsoft.com/en-us/sql/connect/php/installation-tutorial-linux-mac

Vérifier qu'elles sont activées :

```
php -m
```

Vous devez voir :

```
sqlsrv
pdo_sqlsrv
```

---

# Installation de la base de données

1️⃣ Créer une base de données appelée :

```
gestion_utilisateurs
```

2️⃣ Importer le fichier :

```
database/database.sql
```

---

# Installation du Backend (Laravel)

Aller dans le dossier backend :

```
cd backend
```

Installer les dépendances :

```
composer install
```

Copier le fichier d'environnement :

```
cp .env.example .env
```

Configurer la connexion à la base de données dans `.env` :

```
DB_CONNECTION=sqlsrv
DB_HOST=127.0.0.1
DB_PORT=1433
DB_DATABASE=gestion_utilisateurs
DB_USERNAME=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
```

Générer la clé de l'application :

```
php artisan key:generate
```

Lancer le serveur :

```
php artisan serve
```

Backend accessible sur :

```
http://127.0.0.1:8000
```

---

# Installation du Frontend (React)

Aller dans le dossier frontend :

```
cd frontend
```

Installer les dépendances :

```
npm install
```

Lancer l'application :

```
npm run dev
```

Frontend accessible sur :

```
http://localhost:5173
```

---

# Technologies utilisées

* Laravel
* React
* TypeScript
* Microsoft SQL Server
* Bootstrap

---

# Fonctionnalités

* Gestion des utilisateurs
* Gestion des accès aux sites
* CRUD utilisateurs
* Attribution des sites
