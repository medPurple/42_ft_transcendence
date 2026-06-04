# Guide de déploiement — VPS + Cloudflare Pages

> **Serveur 8 Go RAM** : le projet est optimisé pour tourner en ~2 Go de RAM au runtime.
> Voir la section "Optimisations mémoire" pour les détails.

## Architecture cible

```
Navigateur
   │
   ├─ frontend (HTML/CSS/JS statique)
   │     └── Cloudflare Pages  (CDN gratuit, deploy auto depuis GitHub)
   │
   └─ backend (API REST + WebSockets)
         └── VPS  ─── nginx (port 443, Let's Encrypt)
                          ├── /api/*    → microservices Django
                          └── /ws/*     → WebSockets
```

---

## 1. Prérequis VPS

- Ubuntu 22.04+ avec Docker et Docker Compose v2 installés
- Un domaine pointé sur l'IP du VPS (record A dans Cloudflare → **DNS only**, pas proxifié pour Let's Encrypt)
- Ports 80 et 443 ouverts dans le firewall (`ufw allow 80 && ufw allow 443`)

---

## 2. Cloner et configurer

```bash
git clone <repo> ft_transcendence
cd ft_transcendence

cp .env.vps.example .env.vps
nano .env.vps   # remplir DOMAIN, FRONTEND_ORIGIN, CERTBOT_EMAIL, GRAFANA_PASSWORD
```

---

## 3. Obtenir le certificat SSL (première fois)

Le certificat doit être obtenu **avant** de démarrer nginx en HTTPS.

```bash
# Étape 1 — démarrer nginx en HTTP uniquement pour le challenge ACME
#            (nginx.vps.conf répond au /.well-known/acme-challenge/ sur le port 80)
make vps

# Étape 2 — obtenir le certificat
make vps_cert

# nginx redémarre automatiquement avec le cert Let's Encrypt
```

Pour renouveler (à mettre dans un cron) :
```bash
make vps_renew
```

---

## 4. Déploiements suivants

```bash
git pull
make vps
```

---

## 5. Déployer le frontend sur Cloudflare Pages

### Depuis le dashboard Cloudflare

1. **Pages → Create a project → Connect to Git**
2. Sélectionne ton repo GitHub
3. **Build settings** :
   - Framework preset : `None`
   - Build command : *(laisser vide)*
   - Build output directory : `services/nginx/frontend`
4. **Variables d'environnement** (onglet "Environment variables") :
   - Ajouter une variable dans le HTML n'est pas possible directement via Cloudflare Pages.
   - À la place, modifie `services/nginx/frontend/index.html` :
     ```html
     <script>window.__BACKEND_URL__ = "https://monsite.com";</script>
     ```
   - Commite ce changement avant le déploiement.

> **Alternative sans modifier index.html** : utilise Cloudflare Pages Functions
> pour injecter `__BACKEND_URL__` dynamiquement. Voir section 6.

5. **`_redirects`** est déjà présent dans `services/nginx/frontend/` — il gère le routing SPA.

---

## 6. (Optionnel) Injection dynamique de BACKEND_URL via Pages Functions

Crée `services/nginx/frontend/functions/_middleware.js` :

```js
export async function onRequest({ request, next, env }) {
  const response = await next();
  const html = await response.text();
  const patched = html.replace(
    'window.__BACKEND_URL__ = "";',
    `window.__BACKEND_URL__ = "${env.BACKEND_URL || ''}";`
  );
  return new Response(patched, {
    headers: response.headers,
    status: response.status,
  });
}
```

Puis dans Cloudflare Pages → Settings → Environment variables :
- `BACKEND_URL` = `https://monsite.com`

---

## 7. CORS

Le CORS est configuré dans `nginx.vps.conf` via la variable `FRONTEND_ORIGIN`.
Mets l'URL de ton Cloudflare Pages dans `.env.vps` :

```
FRONTEND_ORIGIN=https://my-project.pages.dev
```

---

## 8. Grafana

Grafana est accessible à `https://monsite.com/grafana/` (pas de port public exposé).
Login : valeurs `GRAFANA_USER` / `GRAFANA_PASSWORD` de `.env.vps`.

---

## 9. Optimisations mémoire (serveur 8 Go)

Les modifications suivantes réduisent la consommation RAM à ~2 Go au runtime :

| Optimisation | Détail |
|---|---|
| **PostgreSQL tuning** | `shared_buffers=32MB`, `max_connections=15`, `work_mem=2MB` par service (4 instances) |
| **Redis limité** | `--maxmemory 64mb --maxmemory-policy allkeys-lru` par service (4 instances) |
| **uvicorn 1 worker** | `--workers 1` explicite sur chaque service Django |
| **gunicorn 1w/2t** | JWToken : `--workers 1 --threads 2` |
| **Docker mem_limit** | Plafond par container (user/chat/game3d/pokemap : 400m, nginx : 256m, etc.) |
| **Prometheus rétention 7j** | `--storage.tsdb.retention.time=7d` |
| **Scrape interval 60s** | Au lieu de 15s — réduit la charge CPU |
| **nginx sans recompilation** | `Dockerfile.vps` utilise `libnginx-mod-http-modsecurity` (apt) au lieu de compiler ModSecurity depuis les sources — réduit le RAM de build de ~2 GB à ~300 MB |

### Budget mémoire estimé (runtime)

```
nginx        200 MB    vault        100 MB
user         350 MB    jwtoken       80 MB
chat         350 MB    game3d       350 MB
pokemap      350 MB    prometheus   100 MB
grafana      150 MB
─────────────────────────────────────────
Total      ≈ 2.0 GB   Libre ≈ 6.0 GB
```

### Swap recommandé (sécurité)

Si ton VPS n'a pas de swap, ajoute 2 Go (aide si un pic de mémoire dépasse les limites) :

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

## 10. Résumé des commandes

| Commande | Action |
|----------|--------|
| `make vps` | Build + start la stack VPS |
| `make vps_cert` | Obtenir le certificat Let's Encrypt |
| `make vps_renew` | Renouveler le certificat |
| `make vps_down` | Arrêter la stack VPS |
| `make all` | Stack locale (port 4430, self-signed) |
