FROM debian:latest

RUN apt update -y
RUN apt install -y python3 
RUN apt install -y pip 
RUN apt install -y postgresql 

# Test to establish communication (delete later)
RUN apt install -y nginx

# #Database Initialisation (Work in Progress)
#
# COPY /tools/init_db.sh .
# RUN chmod 777 init_db.sh
# Run init_db.sh 

EXPOSE 5432

# Test to establish communication (delete later)
COPY /conf/nginx.conf /etc/nginx/conf.d/default.conf
COPY /tools/index.html /usr/share/nginx/html
COPY /tools/style.css /usr/share/nginx/html
RUN rm /etc/nginx/sites-enabled/default

CMD [ "nginx", "-g", "daemon off;" ]
