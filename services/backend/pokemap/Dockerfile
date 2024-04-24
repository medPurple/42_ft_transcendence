FROM debian:latest

### Necessary dependencies for Django
RUN apt update -y
RUN apt install python3 python3-pip -y
RUN apt install postgresql -y
RUN apt install curl -y
RUN apt-get install jq -y


COPY /conf/pg_hba.conf /etc/postgresql/15/main/pg_hba.conf
COPY /conf/.key /tmp/.key

RUN chmod 777 /etc/postgresql/15/main/pg_hba.conf

### Database basic initialisation
COPY /conf/init_db.sh /tmp/init_db.sh
RUN chmod 777 /tmp/init_db.sh
# RUN ./init_db.sh

### Django and other python packages installation
COPY /conf/requirements.txt .
RUN pip install --break-system-packages -r requirements.txt

### Copy django app files in container
WORKDIR /app
COPY  /tools/pokemap/ /app/
COPY /conf/start.sh .
RUN chmod 777 start.sh


### Expose on port 8080
EXPOSE 8080
EXPOSE 5432

### Launch server/application
ENTRYPOINT [ "sh", "start.sh" ]
