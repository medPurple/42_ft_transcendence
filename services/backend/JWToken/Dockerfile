FROM debian:bookworm

RUN apt-get update -y && apt-get install -y \
    python3 \
    python3-pip \
    curl \
    jq \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Token Vault injecté au runtime via docker secret -> /run/secrets/vault_token_jwtoken

COPY /conf/requirements.txt .
RUN pip install --break-system-packages -r requirements.txt

WORKDIR /app
COPY /tools/JWToken/ /app/
COPY /conf/start.sh .
RUN chmod 755 start.sh

EXPOSE 4430

ENTRYPOINT ["sh", "start.sh"]
