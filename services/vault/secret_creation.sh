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
echo "[VAULT SECRET] test container secret"
ENV_FILE="/vault/test/.env"
SECRET_PATH="db"

if [ -f "$ENV_FILE" ]; then
	set -a
	. "$ENV_FILE"
	set +a
    vault kv put kv/db user_db=kingpablo password_db=coucou basename_db=salut 
else
	echo "$ENV_FILE unknow file."
fi
#------------------------------------------------#

#------------------------------------------------#
echo "[VAULT SECRET] bob container secret"
ENV_FILE="/vault/bob/.env"
SECRET_PATH="kj"

if [ -f "$ENV_FILE" ]; then
	set -a
	. "$ENV_FILE"
	set +a
    vault kv put kv/kj sdf=sdf sdf=sdf 
else
	echo "$ENV_FILE unknow file."
fi
#------------------------------------------------#
