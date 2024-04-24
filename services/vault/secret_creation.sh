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

#------------------------------------------------#
echo "[VAULT SECRET] matchmaking container secret"
ENV_FILE="/vault/matchmaking/.env"
SECRET_PATH="mm_db"

if [ -f "$ENV_FILE" ]; then
	set -a
	. "$ENV_FILE"
	set +a
    vault kv put kv/mm_db username_db=mmdb password_db=nnpassdb0 basename_db=dbmm 
else
	echo "$ENV_FILE unknow file."
fi
#------------------------------------------------#

#------------------------------------------------#
echo "[VAULT SECRET] JWToken container secret"
ENV_FILE="/vault/JWToken/.env"
SECRET_PATH="key"

if [ -f "$ENV_FILE" ]; then
	set -a
	. "$ENV_FILE"
	set +a
    vault kv put kv/key SECRET_KEY="refinery strongman stricken tassel enjoyment frigidity underage curling spouse cheating armory jarring"
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
    vault kv put kv/pokemap db_name=pokebase db_username=kingdb db_password=kingp4bl0 
else
	echo "$ENV_FILE unknow file."
fi
#------------------------------------------------#
