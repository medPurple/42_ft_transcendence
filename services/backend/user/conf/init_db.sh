#!/bin/bash

VAULT_ADDR="http://vault:8200"
SECRET_PATH="user_db"
VAULT_TOKEN=$(cat /run/secrets/vault_token_user)

response=$(curl -s --header "X-Vault-Token: $VAULT_TOKEN" "$VAULT_ADDR/v1/kv/$SECRET_PATH")

DB_USER=$(echo "$response" | jq -r ".data.db_username")
DB_BASENAME=$(echo "$response" | jq -r ".data.db_name")
DB_PASSWORD=$(echo "$response" | jq -r ".data.db_password")

# Tune PostgreSQL for low-memory VPS (8 GB shared across all services)
cat >> /etc/postgresql/15/main/postgresql.conf <<'PGCONF'
shared_buffers = 32MB
work_mem = 2MB
maintenance_work_mem = 16MB
max_connections = 15
effective_cache_size = 96MB
PGCONF

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
  psql -c "CREATE DATABASE ${DB_BASENAME} OWNER ${DB_USER};"
  psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_BASENAME} TO ${DB_USER};"
  psql -c "GRANT ALL PRIVILEGES ON SCHEMA public TO ${DB_USER};"
EOF
fi

