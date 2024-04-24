#!/bin/bash

if [ ! -f /vault/file/vault_init.txt ]; then

	echo "[VAULT] Starting server"
	vault server -config=/vault/vault.json &
	sleep 2
	echo "[VAULT] Initialisation"
	vault operator init -n 1 -t 1 > /vault/file/vault_init.txt
	
	sleep 1

	echo "[VAULT] Key recuperation"
	UNSEAL_KEY=$(awk '/^Unseal Key 1:/{print $NF}' /vault/file/vault_init.txt)
	ROOT_TOKEN=$(awk '/^Initial Root Token:/{print $NF}' /vault/file/vault_init.txt)
	echo "Unseal Key 1: $UNSEAL_KEY"
	echo "Initial Root Token: $ROOT_TOKEN"
	
	vault operator unseal "$UNSEAL_KEY"
	vault login "$ROOT_TOKEN"

	echo "[VAULT] Token creation"
	vault token create -display-name="chat" > "/vault/file/chat_token.txt"

	vault token create -display-name="JWToken" > "/vault/file/JWToken_token.txt"
	vault token create -display-name="matchmaking" > "/vault/file/matchmaking_token.txt"
	vault token create -display-name="user" > "/vault/file/user_token.txt"
	vault token create -display-name="game3d" > "/vault/file/game3d_token.txt"


	echo "[VAULT] Secret creation"
	vault secrets enable -version=1 kv
	sh /vault/secret_creation.sh

	sleep infinity
else
	echo "[VAULT] Starting server"
	vault server -config=/vault/vault.json &
	sleep 3
	echo "[VAULT] Key recuperation"

	UNSEAL_KEY=$(awk '/^Unseal Key 1:/{print $NF}' /vault/file/vault_init.txt)
	ROOT_TOKEN=$(awk '/^Initial Root Token:/{print $NF}' /vault/file/vault_init.txt)
	echo "Unseal Key 1: $UNSEAL_KEY"
	echo "Initial Root Token: $ROOT_TOKEN"
	
	vault operator unseal "$UNSEAL_KEY"
	vault login "$ROOT_TOKEN"
	sleep infinity

fi
