FROM debian:latest

### Necessary dependencies for Django
RUN apt update -y
RUN apt install python3 python3-pip -y
RUN apt install postgresql -y
RUN apt install curl -y
RUN apt install -y libpq-dev
RUN apt install redis-server -y
#RUN apt install redis-cli -y
RUN apt-get install jq -y

### Clean up
RUN rm -rf /var/lib/apt/lists/*

ENV WATCHFILES_FORCE_POLLING=true

### Postgres configuration
COPY /conf/pg_hba.conf /etc/postgresql/15/main/pg_hba.conf
COPY /conf/.key /tmp/.key
RUN chmod 777 /etc/postgresql/15/main/pg_hba.conf

### Database basic initialisation
COPY /conf/init_db.sh /tmp/init_db.sh
RUN chmod 777 /tmp/init_db.sh

### Django and other python packages installation
COPY /conf/requirements.txt .
RUN pip install --break-system-packages -r requirements.txt

### Copy django app files in container
WORKDIR /app
COPY  /tools/game3d/ /app/

### Copy start script
COPY /conf/start.sh /home/
RUN chmod 777 /home/start.sh

### Launch redis-server

#RUN redis-server --daemonize yes


### Expose on port 4430
EXPOSE 4430
EXPOSE 5432
EXPOSE 6379

### Launch server/application
ENTRYPOINT [ "sh", "/home/start.sh" ]
