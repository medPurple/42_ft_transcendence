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
echo "[VAULT SECRET] game3d container secret"
ENV_FILE="/vault/game3d/.env"
SECRET_PATH="game_db"

if [ -f "$ENV_FILE" ]; then
	set -a
	. "$ENV_FILE"
	set +a
    vault kv put kv/game_db db_username=dbking db_name=testbase db_password=kingp4bl0 
else
	echo "$ENV_FILE unknow file."
fi
#------------------------------------------------#

#------------------------------------------------#
echo "[VAULT SECRET] token container secret"
ENV_FILE="/vault/token/.env"
SECRET_PATH="jwt"

if [ -f "$ENV_FILE" ]; then
	set -a
	. "$ENV_FILE"
	set +a
    vault kv put kv/jwt SECRET_KEY=fsdfbjsgdf
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
    vault kv put kv/user_db db_username=dbking db_name=testbase db_password=kingp4bl0 
else
	echo "$ENV_FILE unknow file."
fi
#------------------------------------------------#
