FROM debian:latest

### Necessary dependencies for Django
RUN apt update -y
RUN apt install python3 python3-pip -y
RUN apt install postgresql -y

### Env variables assignation (to fix)
ENV TEMPLATE_DB_USER=dbking
ENV TEMPLATE_DB_PASSWORD=kingp4bl0
ENV TEMPLATE_DB_BASENAME=testbase

COPY /conf/pg_hba.conf /etc/postgresql/15/main/pg_hba.conf
RUN chmod 777 /etc/postgresql/15/main/pg_hba.conf

### Database basic initialisation
COPY /conf/init_db.sh .
RUN chmod 777 init_db.sh
RUN ./init_db.sh

### Django and other python packages installation
COPY /conf/requirements.txt .
RUN pip install --break-system-packages -r requirements.txt

### Copy django app files in container
WORKDIR /app
COPY  /tools/django_project/ /app/
COPY /conf/start.sh .
RUN chmod 777 start.sh


### Expose on port 8080
EXPOSE 8080
EXPOSE 5432

### Launch server/application
ENTRYPOINT [ "sh", "start.sh" ]
