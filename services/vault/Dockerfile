FROM hashicorp/vault

COPY init_vault.sh /vault/init_vault.sh
COPY secret_creation.sh /vault/secret_creation.sh
COPY env_file/.env_user  /vault/user/.env
COPY env_file/.env_JWToken  /vault/JWToken/.env
COPY env_file/.env_game3d  /vault/game3d/.env
COPY env_file/.env_matchmaking  /vault/matchmaking/.env
COPY env_file/.env_pokemap  /vault/pokemap/.env

COPY vault.json /vault/vault.json

RUN chmod +x /vault/secret_creation.sh
RUN chmod +x /vault/init_vault.sh
RUN chmod +r /vault/vault.json

CMD ["/bin/sh", "/vault/init_vault.sh"]