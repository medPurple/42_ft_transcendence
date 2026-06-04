#!/bin/sh
set -e

# Substitue DOMAIN et FRONTEND_ORIGIN dans la config nginx
envsubst '${DOMAIN} ${FRONTEND_ORIGIN}' \
  < /etc/nginx/conf.d/default.conf \
  > /tmp/nginx_rendered.conf
mv /tmp/nginx_rendered.conf /etc/nginx/conf.d/default.conf

# Injecte __BACKEND_URL__ dans le HTML du frontend pour que config.js
# pointe vers le bon domaine quand le front est sur Cloudflare Pages.
# Si FRONTEND_ORIGIN est vide, le backend sert aussi le front (même domaine).
if [ -n "$FRONTEND_ORIGIN" ]; then
  sed -i "s|window.__BACKEND_URL__ = .*|window.__BACKEND_URL__ = 'https://${DOMAIN}';|g" \
    /usr/share/nginx/html/index.html 2>/dev/null || true
fi

exec nginx -g "daemon off;"
