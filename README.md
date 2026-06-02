# ft_transcendence

Jeu de Pong multijoueur en ligne avec monde Pokémon, chat temps réel et système de tournois.

## Architecture

```
┌─────────────────────────────────────────────────┐
│                    nginx (4430)                  │
│          Reverse proxy + WAF ModSecurity         │
│              SPA frontend (vanilla JS)           │
└────┬──────┬──────┬──────┬──────┬────────────────┘
     │      │      │      │      │
  user   JWToken  chat  game3d  pokemap
 Django  Django  Django Django  Django
 + PG    WSGI   + PG   + PG    + PG
 + Redis        + Redis + Redis

┌──────────┐   ┌─────────────────────┐
│  Vault   │   │ Prometheus + Grafana │
│ (secrets)│   │    (monitoring)      │
└──────────┘   └─────────────────────┘
```

**Stack :** Python 3 / Django 5 / Daphne / PostgreSQL 15 / Redis / Django Channels / Three.js / Vanilla JS / nginx / HashiCorp Vault / Docker

---

## Prérequis

- Docker >= 24
- Docker Compose v2
- GNU Make
- `bash`, `jq`, `curl` (pour les scripts de démarrage)

---

## Lancement en local

### 1. Cloner le repo

```bash
git clone <url> ft_transcendence
cd ft_transcendence
```

### 2. Créer les fichiers de secrets

Chaque service a besoin d'un fichier `.env`. Des exemples sont fournis.

```bash
# Pour chaque service, copier l'exemple et remplir les valeurs
for svc in user game3d chat pokemap nginx; do
    cp secrets/services/$svc/.env.example secrets/services/$svc/.env
done

# Générer une clé Django secrète (commande à répéter pour chaque service)
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
```

**`secrets/services/user/.env`**
```env
env_db_username=user_db_user
env_db_name=user_db
env_db_password=mot_de_passe_fort

DJANGO_SECRET_KEY=<clé générée ci-dessus>

EMAIL_HOST_USER=ton@email.com
EMAIL_HOST_PASSWORD=mot_de_passe_application
```

**`secrets/services/game3d/.env`**
```env
game_db_username=game3d_db_user
game_db_name=game3d_db
game_db_password=mot_de_passe_fort

DJANGO_SECRET_KEY=<clé générée ci-dessus>
```

**`secrets/services/chat/.env`**
```env
chat_db_username=chat_db_user
chat_db_name=chat_db
chat_db_password=mot_de_passe_fort

DJANGO_SECRET_KEY=<clé générée ci-dessus>
```

**`secrets/services/pokemap/.env`**
```env
pokemap_db_username=pokemap_db_user
pokemap_db_name=pokemap_db
pokemap_db_password=mot_de_passe_fort

DJANGO_SECRET_KEY=<clé générée ci-dessus>
```

**`secrets/services/nginx/.env`** — laisser vide, le certificat SSL est auto-généré.

### 3. Créer le fichier d'environnement racine (Grafana)

```bash
cp .env.example .env
# Éditer .env et définir GRAFANA_PASSWORD
```

### 4. Lancer

```bash
make all
```

L'application est accessible sur **https://localhost:4430**

> Le certificat SSL est auto-signé — accepter l'avertissement du navigateur.

### Commandes utiles

| Commande | Description |
|---|---|
| `make all` | Build et démarre tout |
| `make down` | Arrête tous les containers |
| `make clean` | Arrête et supprime images + volumes |
| `make re` | Rebuild complet depuis zéro |
| `make piv` | Liste les containers, images et volumes |
| `make re_ng` | Rebuild uniquement nginx |
| `make re_us` | Rebuild uniquement user |
| `make re_g3` | Rebuild uniquement game3d |
| `make re_ch` | Rebuild uniquement chat |
| `make re_pm` | Rebuild uniquement pokemap |
| `make re_tk` | Rebuild uniquement JWToken |

### Monitoring

| Service | URL |
|---|---|
| Application | https://localhost:4430 |
| Grafana | http://localhost:3000 |
| Prometheus | http://localhost:9090 |
| Vault UI | http://localhost:8200 |

---

## Déploiement en production

### Backend sur serveur — Frontend sur Cloudflare Pages

Dans cette configuration :
- Le **backend** (nginx + microservices) tourne sur votre VPS
- Le **frontend** (SPA statique) est servi par Cloudflare Pages
- Cloudflare proxy les appels API vers votre serveur

```
Navigateur
    │
    ├─── /  ──────────────► Cloudflare Pages (HTML/JS/CSS)
    │                             │
    │                    (appels API via proxy)
    │                             │
    └─── /api/* /ws/* ──────────► VPS : nginx:4430
                                        └── microservices
```

---

### Étape 1 — Préparer le serveur

```bash
# Sur le VPS
git clone <url> ft_transcendence
cd ft_transcendence

# Créer les secrets (même procédure qu'en local)
# ...

# Créer le .env racine
cp .env.example .env
nano .env
```

### Étape 2 — Configurer le domaine backend

Dans `services/nginx/conf/nginx.conf`, remplacer `localhost` par votre domaine :

```nginx
server_name api.votre-domaine.com;
```

Dans `docker-compose.yml`, ajouter `DJANGO_DEBUG=False` est déjà le cas par défaut.

Dans les `settings.py` de chaque service (via les variables Vault), les `ALLOWED_HOSTS` et `CORS_ALLOWED_ORIGINS` sont configurés. Pour un vrai domaine, ajouter celui-ci dans les `secrets/services/<service>/.env` si besoin.

### Étape 3 — Configurer le CORS pour Cloudflare

Dans `services/nginx/conf/nginx.conf`, remplacer les lignes :
```nginx
add_header 'Access-Control-Allow-Origin' '*';
```
par :
```nginx
add_header 'Access-Control-Allow-Origin' 'https://votre-site.pages.dev';
```

> Remplacer sur toutes les `location` API et WebSocket.

### Étape 4 — Adapter le frontend pour appeler le bon backend

Les appels API du frontend utilisent des chemins relatifs (`/api/...`). Pour un frontend hébergé sur Cloudflare qui appelle un backend distant, ajouter un fichier de configuration :

Créer `services/nginx/frontend/js/config.js` :
```js
// URL du backend en production — laisser vide pour utiliser des chemins relatifs (local)
export const API_BASE = 'https://api.votre-domaine.com';
export const WS_BASE  = 'wss://api.votre-domaine.com';
```

Puis dans chaque fichier qui fait des appels réseau, importer et préfixer :
```js
import { API_BASE, WS_BASE } from '../config.js';

// Avant :
fetch('/api/profiles/login/', ...)
// Après :
fetch(API_BASE + '/api/profiles/login/', ...)
```

> Pour le déploiement Cloudflare Pages + Workers, une alternative est de configurer un **Worker** Cloudflare comme proxy qui redirige `/api/*` et `/ws/*` vers votre VPS — dans ce cas aucune modification du code frontend n'est nécessaire.

### Étape 5 — Déployer le frontend sur Cloudflare Pages

```bash
# Installer Wrangler (CLI Cloudflare)
npm install -g wrangler
wrangler login

# Déployer le dossier frontend
wrangler pages deploy services/nginx/frontend/ --project-name=ft-transcendence
```

Ou via l'interface Cloudflare :
1. Cloudflare Dashboard → Pages → Create a project
2. Connect to Git ou upload direct du dossier `services/nginx/frontend/`
3. Pas de build command (SPA statique)
4. Output directory : `.` (racine du dossier)

### Étape 6 — Lancer le backend

```bash
# Sur le VPS
make all
```

Vérifier que le port 4430 est accessible depuis l'extérieur :
```bash
# Sur le VPS (si UFW)
sudo ufw allow 4430/tcp

# Ou avec iptables
sudo iptables -A INPUT -p tcp --dport 4430 -j ACCEPT
```

### Étape 7 — Configurer Cloudflare (optionnel — proxy workers)

Si vous préférez ne pas modifier le code frontend, créer un Worker Cloudflare qui proxy les appels API :

```js
// worker.js
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const BACKEND = 'https://api.votre-domaine.com';

    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/ws/')) {
      return fetch(BACKEND + url.pathname + url.search, request);
    }
    // Laisser Cloudflare Pages gérer le frontend
    return fetch(request);
  }
}
```

---

## Structure des secrets

```
secrets/
├── services/           ← Credentials DB + config par service (gitignorés)
│   ├── user/
│   │   ├── .env        ← À créer depuis .env.example
│   │   └── .env.example
│   ├── game3d/   ...
│   ├── chat/     ...
│   ├── pokemap/  ...
│   └── nginx/    ...
└── tokens/             ← Tokens Vault générés automatiquement (gitignorés)
    ├── user.token
    └── ...
```

> Les fichiers `secrets/services/*/.env` et `secrets/tokens/*.token` sont **gitignorés**. Ne jamais les committer.

---

## Variables d'environnement — référence

### Fichier racine `.env`

| Variable | Description | Exemple |
|---|---|---|
| `GRAFANA_USER` | Login Grafana | `admin` |
| `GRAFANA_PASSWORD` | Mot de passe Grafana | `motdepasse_fort` |

### `secrets/services/user/.env`

| Variable | Description |
|---|---|
| `env_db_username` | Utilisateur PostgreSQL du service user |
| `env_db_name` | Nom de la base PostgreSQL |
| `env_db_password` | Mot de passe PostgreSQL |
| `DJANGO_SECRET_KEY` | Clé secrète Django (générer avec `secrets.token_urlsafe(50)`) |
| `EMAIL_HOST_USER` | Email expéditeur pour la 2FA |
| `EMAIL_HOST_PASSWORD` | Mot de passe application Gmail (ou autre SMTP) |

### `secrets/services/game3d/.env` / `chat/.env` / `pokemap/.env`

| Variable | Description |
|---|---|
| `<service>_db_username` | Utilisateur PostgreSQL |
| `<service>_db_name` | Nom de la base |
| `<service>_db_password` | Mot de passe |
| `DJANGO_SECRET_KEY` | Clé secrète Django |

> La clé JWT (service JWToken) est **auto-générée** aléatoirement à chaque initialisation de Vault — aucun fichier `.env` requis.

---

## Dépannage

**Le build échoue avec "file not found" sur `.env`**
→ Les fichiers `secrets/services/<service>/.env` n'ont pas été créés. Suivre l'étape 2.

**`make all` plante sur `key_distrib`**
→ Le container Vault n'a pas démarré à temps. Relancer `make all`.

**"Invalid token, please reload" dans le navigateur**
→ Le token JWT a expiré (7 jours). Se déconnecter et se reconnecter.

**Les WebSockets ne se connectent pas**
→ Vérifier que le port 4430 est bien ouvert sur le serveur et que `wss://` est utilisé (pas `ws://`).

**Grafana ne démarre pas**
→ La variable `GRAFANA_PASSWORD` n'est pas définie dans `.env`.
