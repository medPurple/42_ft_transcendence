#!/bin/bash
set -e

python3 manage.py makemigrations tokenAPI
python3 manage.py migrate

VAULT_TOKEN=$(cat /run/secrets/vault_token_jwtoken)
data=$(curl -sf -H "X-Vault-Token: $VAULT_TOKEN" http://vault:8200/v1/kv/nginx | jq -r '.data' | sed 's/\\n/\\\\n/g')

ssl_certificate=$(echo "$data" | jq -r '.ssl_certificate')
ssl_certificate_key=$(echo "$data" | jq -r '.ssl_certificate_key')

echo "$ssl_certificate" > /tmp/server.crt
echo "$ssl_certificate_key" > /tmp/server.key

cp /tmp/server.crt /usr/local/share/ca-certificates/server.crt
update-ca-certificates

export REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt

gunicorn --certfile=/tmp/server.crt --keyfile=/tmp/server.key JWToken.wsgi:application --bind 0.0.0.0:4430
