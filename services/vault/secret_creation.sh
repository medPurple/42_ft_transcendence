#!/bin/bash

# Les .env sont montés depuis le host via docker run :
#   secrets/services/<service>/.env -> /vault/services/<service>/.env (read-only)
# Aucun fichier .env n'est baked dans l'image vault.

#------------------------------------------------#
echo "[VAULT SECRET] nginx container secret"
# nginx n'a pas de .env : le certificat SSL est auto-généré dans le Dockerfile vault
cert_value=$(cat /tmp/.transcendance_crt.crt)
key_value=$(cat /tmp/.transcendance_key.key)
vault kv put kv/nginx ssl_certificate="$cert_value" ssl_certificate_key="$key_value"
#------------------------------------------------#

#------------------------------------------------#
echo "[VAULT SECRET] game3d container secret"
ENV_FILE="/vault/services/game3d/.env"

if [ -f "$ENV_FILE" ]; then
	set -a
	. "$ENV_FILE"
	set +a
	vault kv put kv/game_db \
		db_username="$game_db_username" \
		db_name="$game_db_name" \
		db_password="$game_db_password"
else
	echo "[VAULT ERROR] $ENV_FILE not found. Créer secrets/services/game3d/.env (voir .env.example)."
	exit 1
fi
#------------------------------------------------#

#------------------------------------------------#
echo "[VAULT SECRET] user container secret"
ENV_FILE="/vault/services/user/.env"

if [ -f "$ENV_FILE" ]; then
	set -a
	. "$ENV_FILE"
	set +a
	vault kv put kv/user_db \
		db_username="$env_db_username" \
		db_name="$env_db_name" \
		db_password="$env_db_password"
else
	echo "[VAULT ERROR] $ENV_FILE not found. Créer secrets/services/user/.env (voir .env.example)."
	exit 1
fi
#------------------------------------------------#

#------------------------------------------------#
echo "[VAULT SECRET] JWToken container secret"
# La clé JWT est générée aléatoirement à chaque initialisation de vault.
# Pas besoin de .env : le secret n'est jamais stocké sur le host.
JWT_SECRET=$(dd if=/dev/urandom bs=32 count=1 2>/dev/null | sha256sum -b | sed 's/ .*//')
vault kv put kv/key SECRET_KEY="$JWT_SECRET"
#------------------------------------------------#

#------------------------------------------------#
echo "[VAULT SECRET] pokemap container secret"
ENV_FILE="/vault/services/pokemap/.env"

if [ -f "$ENV_FILE" ]; then
	set -a
	. "$ENV_FILE"
	set +a
	vault kv put kv/pokemap \
		db_name="$pokemap_db_name" \
		db_username="$pokemap_db_username" \
		db_password="$pokemap_db_password"
else
	echo "[VAULT ERROR] $ENV_FILE not found. Créer secrets/services/pokemap/.env (voir .env.example)."
	exit 1
fi
#------------------------------------------------#

#------------------------------------------------#
echo "[VAULT SECRET] chat container secret"
ENV_FILE="/vault/services/chat/.env"

if [ -f "$ENV_FILE" ]; then
	set -a
	. "$ENV_FILE"
	set +a
	vault kv put kv/chat_db \
		db_name="$chat_db_name" \
		db_password="$chat_db_password" \
		db_username="$chat_db_username"
else
	echo "[VAULT ERROR] $ENV_FILE not found. Créer secrets/services/chat/.env (voir .env.example)."
	exit 1
fi
#------------------------------------------------#
