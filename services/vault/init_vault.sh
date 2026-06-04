#!/bin/bash

set -e  # Arrêt immédiat si une commande échoue

wait_for_vault() {
    echo "[VAULT] Attente disponibilité du serveur..."
    for i in $(seq 1 30); do
        if vault status > /dev/null 2>&1; then
            code=0
        else
            code=$?
        fi
        if [ $code -eq 0 ] || [ $code -eq 2 ]; then
            echo "[VAULT] Serveur prêt."
            return 0
        fi
        sleep 1
    done
    echo "[VAULT ERROR] Serveur non disponible après 30s."
    exit 1
}

if [ ! -f /vault/file/vault_init.txt ]; then

    # ── Première initialisation ──────────────────────────────────────────────
    echo "[VAULT] Démarrage du serveur (première init)"
    vault server -config=/vault/vault.json &
    wait_for_vault

    echo "[VAULT] Initialisation"
    vault operator init -n 1 -t 1 > /vault/file/vault_init.txt

    echo "[VAULT] Récupération des clés"
    UNSEAL_KEY=$(awk '/^Unseal Key 1:/{print $NF}' /vault/file/vault_init.txt)
    ROOT_TOKEN=$(awk '/^Initial Root Token:/{print $NF}' /vault/file/vault_init.txt)

    vault operator unseal "$UNSEAL_KEY"
    vault login "$ROOT_TOKEN"

    echo "[VAULT] Création des tokens de service"
    vault token create -display-name="pokemap" > "/vault/file/pokemap_token.txt"
    vault token create -display-name="chat"    > "/vault/file/chat_token.txt"
    vault token create -display-name="JWToken" > "/vault/file/JWToken_token.txt"
    vault token create -display-name="user"    > "/vault/file/user_token.txt"
    vault token create -display-name="game3d"  > "/vault/file/game3d_token.txt"
    vault token create -display-name="nginx"   > "/vault/file/nginx_token.txt"

    echo "[VAULT] Activation du moteur KV et écriture des secrets"
    vault secrets enable -version=1 kv
    sh /vault/secret_creation.sh

    echo "[VAULT] Initialisation terminée — Vault opérationnel"

else

    # ── Redémarrage (Vault déjà initialisé) ─────────────────────────────────
    echo "[VAULT] Démarrage du serveur (redémarrage)"
    vault server -config=/vault/vault.json &
    wait_for_vault

    echo "[VAULT] Récupération des clés"
    UNSEAL_KEY=$(awk '/^Unseal Key 1:/{print $NF}' /vault/file/vault_init.txt)
    ROOT_TOKEN=$(awk '/^Initial Root Token:/{print $NF}' /vault/file/vault_init.txt)

    vault operator unseal "$UNSEAL_KEY"
    vault login "$ROOT_TOKEN"

    echo "[VAULT] Vault déscellé — opérationnel"

fi

# Maintenir le container vivant en attendant le process vault en arrière-plan
wait
