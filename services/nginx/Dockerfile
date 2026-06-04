# Image officielle OWASP ModSecurity + nginx pré-compilés
# Remplace ~23 min de compilation from-source par un pull de quelques secondes
FROM owasp/modsecurity-crs:nginx

USER root

# jq : nécessaire pour get_ssl.sh (lecture des secrets Vault)
RUN apt-get update -y && apt-get install -y --no-install-recommends jq curl \
    && rm -rf /var/lib/apt/lists/*

# Script SSL runtime (appelé au démarrage, pas au build — vault n'est pas dispo au build)
COPY /conf/get_ssl.sh /tmp/get_ssl.sh
RUN chmod +x /tmp/get_ssl.sh

# Config nginx (remplace le default de l'image)
COPY /conf/nginx.conf /etc/nginx/conf.d/default.conf
COPY /conf/cors.conf  /etc/nginx/conf.d/cors.conf

# Frontend statique
COPY ./frontend/ /usr/share/nginx/html/

# L'image owasp/modsecurity-crs:nginx a déjà :
#   - ModSecurity compilé et chargé
#   - OWASP CRS installé dans /etc/modsecurity.d/
#   - modsecurity_rules_file → /etc/modsecurity.d/include.conf
# Pas besoin de copier modsecurity.conf / modsecurity-crs.conf

CMD ["/bin/sh", "-c", "/tmp/get_ssl.sh && nginx -g 'daemon off;'"]
