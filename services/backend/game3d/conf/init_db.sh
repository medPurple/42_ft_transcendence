#!/bin/bash

VAULT_ADDR="http://vault:8200"
SECRET_PATH="game_db"
VAULT_TOKEN=$(cat /tmp/.key)

response=$(curl -s --header "X-Vault-Token: $VAULT_TOKEN" "$VAULT_ADDR/v1/kv/$SECRET_PATH")

DB_USER=$(echo "$response" | jq -r ".data.db_username")
DB_BASENAME=$(echo "$response" | jq -r ".data.db_name")
DB_PASSWORD=$(echo "$response" | jq -r ".data.db_password")

service postgresql start

sleep 5

su postgres <<EOF
psql -lqt | cut -d \| -f 1 | grep -qw '${DB_BASENAME}'
EOF

if [ "$?" -eq "0" ]; then

	echo "Database already exists."

else

	su postgres <<EOF

  psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';"
  psql -c "CREATE DATABASE ${DB_BASENAME} OWNER POSTGRES;"
  psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_BASENAME} TO ${DB_USER};"
  psql -c "GRANT ALL PRIVILEGES ON SCHEMA public TO ${DB_USER};"
EOF

fi
