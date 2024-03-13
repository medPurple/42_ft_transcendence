FROM debian:latest

### Necessary dependencies for Django
RUN apt update -y
RUN apt install python3 python3-pip -y
RUN apt install postgresql -y

### Env variables assignation (to fix)
ENV TEMPLATE_DB_USER=dbking
ENV TEMPLATE_DB_PASSWORD=kingp4bl0
ENV TEMPLATE_DB_BASENAME=testbase

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
#CMD python3 manage.py runserver 0.0.0.0:8080
ENTRYPOINT [ "sh", "start.sh" ]
