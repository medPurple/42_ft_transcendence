FROM postgres:15-bookworm

RUN apt-get update -y && apt-get install -y curl jq && rm -rf /var/lib/apt/lists/*

COPY init-databases.sh /docker-entrypoint-initdb.d/init-databases.sh
RUN chmod +x /docker-entrypoint-initdb.d/init-databases.sh
