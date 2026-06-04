#!/bin/bash
# Runs once when the postgres container is first initialized.
# Reads DB credentials from Vault for each service and creates the databases.
set -e

VAULT_ADDR="http://vault:8200"

# Helper: wait for Vault to be ready
wait_vault() {
  echo "[postgres-init] Waiting for Vault..."
  for i in $(seq 1 30); do
    if curl -sf "$VAULT_ADDR/v1/sys/health" > /dev/null 2>&1; then
      echo "[postgres-init] Vault ready."
      return 0
    fi
    sleep 2
  done
  echo "[postgres-init] ERROR: Vault not reachable after 60s"
  exit 1
}

# Helper: create DB + user from Vault secret path
create_db() {
  local token_file="$1"
  local secret_path="$2"

  if [ ! -f "$token_file" ]; then
    echo "[postgres-init] WARNING: token file $token_file not found, skipping $secret_path"
    return 0
  fi

  local token
  token=$(cat "$token_file")
  local response
  response=$(curl -sf -H "X-Vault-Token: $token" "$VAULT_ADDR/v1/kv/$secret_path")

  local db_user db_name db_pass
  db_user=$(echo "$response" | jq -r '.data.db_username')
  db_name=$(echo "$response" | jq -r '.data.db_name')
  db_pass=$(echo "$response" | jq -r '.data.db_password')

  if [ -z "$db_user" ] || [ "$db_user" = "null" ]; then
    echo "[postgres-init] WARNING: could not read credentials for $secret_path, skipping"
    return 0
  fi

  echo "[postgres-init] Creating database '$db_name' with user '$db_user'..."
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${db_user}') THEN
    CREATE USER ${db_user} WITH PASSWORD '${db_pass}';
  END IF;
END
\$\$;

SELECT 'CREATE DATABASE ${db_name}' WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = '${db_name}'
)\gexec

GRANT ALL PRIVILEGES ON DATABASE ${db_name} TO ${db_user};
SQL

  # Grant schema ownership (needed for Django migrations)
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$db_name" <<SQL
GRANT ALL PRIVILEGES ON SCHEMA public TO ${db_user};
SQL

  echo "[postgres-init] Database '$db_name' ready."
}

wait_vault

create_db "/run/secrets/vault_token_user"    "user_db"
create_db "/run/secrets/vault_token_chat"    "chat_db"
create_db "/run/secrets/vault_token_game3d"  "game_db"
create_db "/run/secrets/vault_token_pokemap" "pokemap"

echo "[postgres-init] All databases initialized."
