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
#-----------------------------------------------#
echo "[VAULT SECRET] User container secret"
ENV_FILE="/vault/user/.env"
SECRET_PATH="user_db"

if [ -f "$ENV_FILE" ]; then
    set -a
    . "$ENV_FILE"
    set +a
    vault kv put kv/"$SECRET_PATH" db_name="$USERDB_BASENAME" db_username="$USERDB_USER" db_password="$USERDB_PASSWORD"
else
    echo "$ENV_FILE unknow file."
fi

#------------------------------------------------#
#------------------------------------------------#
echo "[VAULT SECRET] Token container secret"
ENV_FILE="/vault/token/.env"
SECRET_PATH="jwt_key"

if [ -f "$ENV_FILE" ]; then
    set -a
    . "$ENV_FILE"
    set +a
    vault kv put kv/"$SECRET_PATH" key="$SECRET_KEY"
else
    echo "$ENV_FILE unknow file."
fi
#------------------------------------------------#


