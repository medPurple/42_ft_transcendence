#!/bin/bash

VAULT_ADDR="http://localhost:8200"
SECRET_PATH="user_db"
VAULT_TOKEN=$(cat .key)

response=$(curl -s --header "X-Vault-Token: $VAULT_TOKEN" "$VAULT_ADDR/v1/$SECRET_PATH")

DB_USER=$(echo "$response" | jq -r '.data.db_username')
DB_BASENAME=$(echo "$response" | jq -r '.data.db_name')
DB_PASSWORD=$(echo "$response" | jq -r '.data.db_password')

echo "Le secret récupéré est : $DB_USER $DB_BASENAME $DB_PASSWORD"

su postgres <<EOF
service postgresql start
sleep 5

psql -c "CREATE USER ${TEMPLATE_DB_USER} WITH PASSWORD '${TEMPLATE_DB_PASSWORD}';"
psql -c "CREATE DATABASE ${TEMPLATE_DB_BASENAME} OWNER ${TEMPLATE_DB_USER};"
psql -c "GRANT ALL PRIVILEGES ON DATABASE ${TEMPLATE_DB_BASENAME} TO ${TEMPLATE_DB_USER};"
psql -c "GRANT ALL PRIVILEGES ON SCHEMA public TO ${TEMPLATE_DB_USER};"
EOF
