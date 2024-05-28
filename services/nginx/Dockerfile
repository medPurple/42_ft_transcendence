FROM nginx:latest
RUN apt-get update && apt-get install jq -y

COPY /conf/nginx.conf /etc/nginx/conf.d/default.conf
COPY /conf/get_ssl.sh /docker-entrypoint.d/get_ssl.sh
RUN chmod +x /docker-entrypoint.d/get_ssl.sh
COPY ./frontend/ /usr/share/nginx/html/
COPY /conf/.key /tmp/.key


#https://dev.to/henri_sekeladi/install-nginx-with-modsecurity-3-owasp-crs-on-ubuntu-2204-5d6l