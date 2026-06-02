FROM hashicorp/vault


RUN apk add --no-cache openssl

RUN openssl genrsa -out /tmp/private.key 2048
RUN openssl req -x509 -nodes -out /tmp/.transcendance_crt.crt \
                            -keyout /tmp/.transcendance_key.key \
                            -subj "/C=FR/ST=IDF/L=Paris/O=42/OU=42/CN=transcendance/UID=patpatrouille"

COPY init_vault.sh /vault/init_vault.sh
COPY secret_creation.sh /vault/secret_creation.sh
COPY vault.json /vault/vault.json

# Les fichiers .env par service sont montés en volume au runtime via docker run :
#   secrets/services/<service>/.env -> /vault/services/<service>/.env (read-only)
# Aucun secret n'est baked dans l'image.

RUN chmod +x /vault/secret_creation.sh
RUN chmod +x /vault/init_vault.sh
RUN chmod +r /vault/vault.json

CMD ["/bin/sh", "/vault/init_vault.sh"]
