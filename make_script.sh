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
    docker exec -i vault sh -c "cat /vault/file/user_token.txt | grep '^token' | awk '{print \$2; exit}'" > services/backend/user/conf/.key
    docker exec -i vault sh -c "cat /vault/file/token_token.txt | grep '^token' | awk '{print \$2; exit}'" > services/backend/token/conf/.key
}

# Lance le conteneur Vault
start_vault_container() {
    docker run --name vault --network microservices -p 8200:8200 -v secret_volume:/vault/file --cap-add IPC_LOCK -e VAULT_ADDR=http://127.0.0.1:8200 -d vault
    sleep 5
}

# Supprime les clés
key_remove() {
    rm services/backend/user/conf/.key
    rm services/backend/token/conf/.key
}

# Exécute les différentes étapes
create_network
build_image
start_vault_container
key_distrib