#!/bin/bash

VAULT_ADDR="http://localhost:8200"
SECRET_PATH="user_db"
VAULT_TOKEN=$(cat /tmp/.key)

response=$(curl -s --header "X-Vault-Token: $VAULT_TOKEN" "$VAULT_ADDR/v1/kv/$SECRET_PATH")

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


# curl -s --header "X-Vault-Token: hvs.dsUt3IEvhcsDIbtwntivY2xU" "http://localhost:8200/v1/kv/user_db
# {
#     "request_id": "87814caa-91c2-7122-daeb-390e3a760d9c",
#     "lease_id": "",
#     "renewable": false,
#     "lease_duration": 604800,
#     "data": {
#         "db_name": "testbase",
#         "db_password": "kingp4bl0",
#         "db_username": "dbking"
#     },
#     "wrap_info": null,
#     "warnings": null,
#     "auth": null
# }