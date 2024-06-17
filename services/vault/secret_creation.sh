#!/bin/bash

#-----------------------------------------------#
# echo "[VAULT SECRET] Template container secret"
# ENV_FILE="/vault/container_name/.env"
# SECRET_PATH="secret_path"
#
# if [ -f "$ENV_FILE" ]; then
#     set -a
#     . "$ENV_FILE"
#     set +a
#     vault kv put kv/"$SECRET_PATH" secret_name=secret_value
#else
#    echo "$ENV_FILE unknow file."
#fi
#------------------------------------------------#

#------------------------------------------------#
echo "[VAULT SECRET] nginx container secret"
ENV_FILE="/vault/nginx/.env"
SECRET_PATH="game_db"
if [ -f "$ENV_FILE" ]; then
	set -a
	. "$ENV_FILE"
	set +a
	cert_value=$(cat /tmp/.transcendance_crt.crt)
	key_value=$(cat /tmp/.transcendance_key.key)
	# echo "$cert_value"
	# echo "$key_value"
	vault kv put kv/nginx ssl_certificate="$cert_value" ssl_certificate_key="$key_value"
else
	echo "$ENV_FILE unknow file."
fi
#------------------------------------------------#

#------------------------------------------------#
echo "[VAULT SECRET] game3d container secret"
ENV_FILE="/vault/game3d/.env"
SECRET_PATH="game_db"

if [ -f "$ENV_FILE" ]; then
	set -a
	. "$ENV_FILE"
	set +a
    vault kv put kv/game_db db_username=$game_db_username db_name=$game_db_name db_password=$game_db_password 
else
	echo "$ENV_FILE unknow file."
fi
#------------------------------------------------#

#------------------------------------------------#
echo "[VAULT SECRET] user container secret"
ENV_FILE="/vault/user/.env"
SECRET_PATH="user_db"

if [ -f "$ENV_FILE" ]; then
	set -a
	. "$ENV_FILE"
	set +a
    vault kv put kv/user_db db_username=$env_db_username db_name=$env_db_name db_password=$env_db_password 
else
	echo "$ENV_FILE unknow file."
fi
#------------------------------------------------#

#------------------------------------------------#
echo "[VAULT SECRET] JWToken container secret"
ENV_FILE="/vault/JWToken/.env"
SECRET_PATH="key"
secret=$(dd if=/dev/urandom bs=32 count=1 2>/dev/null | sha256sum -b | sed 's/ .*//')
# echo "PASS=$secret" > /vault/JWToken/.env
if [ -f "$ENV_FILE" ]; then
	set -a
	. "$ENV_FILE"
	set +a
    vault kv put kv/key SECRET_KEY=$PASS
else
	echo "$ENV_FILE unknow file."
fi
#------------------------------------------------#

#------------------------------------------------#
echo "[VAULT SECRET] pokemap container secret"
ENV_FILE="/vault/pokemap/.env"
SECRET_PATH="pokemap"

if [ -f "$ENV_FILE" ]; then
	set -a
	. "$ENV_FILE"
	set +a
    vault kv put kv/pokemap db_name=$pokemap_db_name db_username=$pokemap_db_username db_password=$pokemap_db_password 
else
	echo "$ENV_FILE unknow file."
fi
#------------------------------------------------#

#------------------------------------------------#
echo "[VAULT SECRET] chat container secret"
ENV_FILE="/vault/chat/.env"
SECRET_PATH="chat_db"

if [ -f "$ENV_FILE" ]; then
	set -a
	. "$ENV_FILE"
	set +a
    vault kv put kv/chat_db db_name=$chat_db_name db_password=$chat_db_password db_username=$chat_db_username 
else
	echo "$ENV_FILE unknow file."
fi
#------------------------------------------------#