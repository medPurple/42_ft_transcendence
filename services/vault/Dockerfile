FROM hashicorp/vault

COPY init_vault.sh /vault/init_vault.sh
COPY vault.json /vault/vault.json

RUN chmod +x /vault/init_vault.sh
RUN chmod +r /vault/vault.json

CMD ["/bin/sh", "/vault/init_vault.sh"]