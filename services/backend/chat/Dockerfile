FROM debian:bookworm

RUN apt-get update -y && apt-get install -y \
    python3 \
    python3-pip \
    postgresql-client \
    curl \
    jq \
    openssl \
    ca-certificates \
    redis-server \
    && rm -rf /var/lib/apt/lists/*

COPY /conf/requirements.txt .
RUN pip install --break-system-packages -r requirements.txt

WORKDIR /app
COPY /tools/chat/ /app/
COPY /conf/start.sh .
RUN chmod 755 start.sh

EXPOSE 4430

ENTRYPOINT ["sh", "start.sh"]
