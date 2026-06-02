#!/bin/bash
set -e

# init_db.sh démarre PostgreSQL et crée la base si elle n'existe pas
sh /tmp/init_db.sh

# Redis en arrière-plan
redis-server --daemonize yes

# Migrations
python3 manage.py makemigrations friends
python3 manage.py makemigrations profiles
python3 manage.py migrate

# Récupération du certificat SSL depuis Vault
VAULT_TOKEN=$(cat /run/secrets/vault_token_user)
data=$(curl -sf -H "X-Vault-Token: $VAULT_TOKEN" http://vault:8200/v1/kv/nginx | jq -r '.data' | sed 's/\\n/\\\\n/g')

ssl_certificate=$(echo "$data" | jq -r '.ssl_certificate')
ssl_certificate_key=$(echo "$data" | jq -r '.ssl_certificate_key')

echo "$ssl_certificate" > /tmp/server.crt
echo "$ssl_certificate_key" > /tmp/server.key

# Ajout du cert dans le store CA pour les appels inter-services (verify=True à terme)
cp /tmp/server.crt /usr/local/share/ca-certificates/server.crt
update-ca-certificates

export REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt

uvicorn user.asgi:application \
    --host 0.0.0.0 \
    --port 4430 \
    --ssl-keyfile=/tmp/server.key \
    --ssl-certfile=/tmp/server.crt
