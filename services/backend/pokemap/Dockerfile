FROM debian:bookworm

RUN apt-get update -y && apt-get install -y \
    python3 \
    python3-pip \
    postgresql \
    curl \
    jq \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY /conf/pg_hba.conf /etc/postgresql/15/main/pg_hba.conf
# Token Vault injecté au runtime via docker secret -> /run/secrets/vault_token_pokemap

RUN chmod 644 /etc/postgresql/15/main/pg_hba.conf

COPY /conf/init_db.sh /tmp/init_db.sh
RUN chmod 755 /tmp/init_db.sh

COPY /conf/requirements.txt .
RUN pip install --break-system-packages -r requirements.txt

WORKDIR /app
COPY /tools/pokemap/ /app/
COPY /conf/start.sh .
RUN chmod 755 start.sh

EXPOSE 4430
EXPOSE 5432

ENTRYPOINT ["sh", "start.sh"]
