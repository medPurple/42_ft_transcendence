FROM debian:bookworm

RUN apt-get update -y && apt-get install -y \
    python3 \
    python3-pip \
    postgresql-client \
    curl \
    jq \
    libpq-dev \
    openssl \
    ca-certificates \
    redis-server \
    && rm -rf /var/lib/apt/lists/*

ENV WATCHFILES_FORCE_POLLING=true

COPY /conf/requirements.txt .
RUN pip install --break-system-packages -r requirements.txt

WORKDIR /app
COPY /tools/game3d/ /app/
COPY /conf/start.sh /home/start.sh
RUN chmod 755 /home/start.sh

EXPOSE 4430

ENTRYPOINT ["sh", "/home/start.sh"]
