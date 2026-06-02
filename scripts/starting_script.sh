#!/bin/bash

network_name="microservices"
container_name="vault"
image_name="vault"

# Crée le réseau Docker s'il n'existe pas
create_network() {
	if [[ -z "$(docker network ls | grep $network_name)" ]]; then
		docker network create -d bridge $network_name
	fi
}

# Construit l'image vault si elle n'existe pas
build_image() {
	if [[ -z "$(docker images | grep -w $image_name)" ]]; then
		docker build -t $image_name ./services/vault/
	fi
}

# Lance le conteneur Vault
# - secret_volume  : persiste les clés vault entre redémarrages
# - secrets/services : configs par service montées en read-only (jamais dans l'image)
start_vault_container() {
	if [[ -z "$(docker ps -aqf name=$container_name)" ]]; then
		docker run \
			--name $container_name \
			--network $network_name \
			-p 8200:8200 \
			-v secret_volume:/vault/file \
			-v "$(pwd)/secrets/services:/vault/services:ro" \
			--cap-add IPC_LOCK \
			-e VAULT_ADDR=http://127.0.0.1:8200 \
			-d $image_name
		sleep 5
	else
		echo "Container $container_name already exists."
	fi
}

# Distribue les tokens Vault dans secrets/tokens/
# Les tokens sont montés au runtime via docker-compose secrets.
# Ils ne sont JAMAIS copiés dans les images Docker.
key_distrib() {
	mkdir -p secrets/tokens

	docker exec -i $container_name sh -c \
		"grep '^token ' /vault/file/nginx_token.txt | awk '{print \$2; exit}'" \
		> secrets/tokens/nginx.token

	docker exec -i $container_name sh -c \
		"grep '^token ' /vault/file/user_token.txt | awk '{print \$2; exit}'" \
		> secrets/tokens/user.token

	docker exec -i $container_name sh -c \
		"grep '^token ' /vault/file/JWToken_token.txt | awk '{print \$2; exit}'" \
		> secrets/tokens/jwtoken.token

	docker exec -i $container_name sh -c \
		"grep '^token ' /vault/file/game3d_token.txt | awk '{print \$2; exit}'" \
		> secrets/tokens/game3d.token

	docker exec -i $container_name sh -c \
		"grep '^token ' /vault/file/chat_token.txt | awk '{print \$2; exit}'" \
		> secrets/tokens/chat.token

	docker exec -i $container_name sh -c \
		"grep '^token ' /vault/file/pokemap_token.txt | awk '{print \$2; exit}'" \
		> secrets/tokens/pokemap.token

	echo "[KEY_DISTRIB] Tokens écrits dans secrets/tokens/ (non versionnés)"
}
