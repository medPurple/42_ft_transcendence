#!/bin/bash

network_name="microservices"
image_name="vault"

# Crée le réseau s'il n'existe pas déjà
create_network() {
	if [[ -z "$(docker network ls | grep $network_name)" ]]; then
		docker network create -d bridge $network_name
	fi
}

# Construit l'image si elle n'existe pas déjà
build_image() {
	if [[ -z "$(docker images | grep -w $image_name)" ]]; then
		docker build -t $image_name ./services/vault/
	fi
}

# Distribue les clés
key_distrib() {
	docker exec -i vault sh -c "cat /vault/file/chat_token.txt | grep '^token' | awk '{print \$2; exit}'" > services/backend/chat/conf/.key
	docker exec -i vault sh -c "cat /vault/file/nginx_token.txt | grep '^token' | awk '{print \$2; exit}'" > services/nginx/conf/.key
	docker exec -i vault sh -c "cat /vault/file/pokemap_token.txt | grep '^token' | awk '{print \$2; exit}'" > services/backend/pokemap/conf/.key
	docker exec -i vault sh -c "cat /vault/file/JWToken_token.txt | grep '^token' | awk '{print \$2; exit}'" > services/backend/JWToken/conf/.key
	docker exec -i vault sh -c "cat /vault/file/user_token.txt | grep '^token' | awk '{print \$2; exit}'" > services/backend/user/conf/.key
	docker exec -i vault sh -c "cat /vault/file/game3d_token.txt | grep '^token' | awk '{print \$2; exit}'" > services/backend/game3d/conf/.key
}

# Lance le conteneur Vault
start_vault_container() {
    if [[ -z "$(docker ps -aqf name=$container_name)" ]]; then
		docker run --name vault --network microservices -p 8200:8200 -v secret_volume:/vault/file --cap-add IPC_LOCK -e VAULT_ADDR=http://127.0.0.1:8200 -d vault
        sleep 5
    else
        echo "Container $container_name already exists."
    fi
}

# Supprime les clés
key_remove() {
    files_to_delete=(
		"services/backend/chat/conf/.key"
		"services/backend/pokemap/conf/.key"
		"services/nginx/conf/.key"
		"services/backend/JWToken/conf/.key"
        "services/backend/user/conf/.key"
        "services/backend/game3d/conf/.key"
    )

    for file in "${files_to_delete[@]}"; do
        if [ -f "$file" ]; then
            rm "$file"
        fi
    done
}
