#!/bin/bash

sh /tmp/init_db.sh
service postgresql start

sleep 5
redis-server &

python3 manage.py makemigrations friends
python3 manage.py makemigrations profiles


python3 manage.py migrate

data=$(curl -H "X-Vault-Token: $(cat /tmp/.key)" http://vault:8200/v1/kv/nginx | jq -r '.data'| sed 's/\\n/\\\\n/g')
echo $data

ssl_certificate=$(echo $data | jq -r '.ssl_certificate')
ssl_certificate_key=$(echo $data | jq -r '.ssl_certificate_key')

echo "$ssl_certificate" > /tmp/server.crt
echo "$ssl_certificate_key" > /tmp/server.key

cp /tmp/server.crt /usr/local/share/ca-certificates/
update-ca-certificates
openssl x509 -in /usr/local/share/ca-certificates/server.crt -out /usr/local/share/ca-certificates/server.pem -outform PEM

uvicorn user.asgi:application --host 0.0.0.0 --port 4430 --ssl-keyfile=/tmp/server.key --ssl-certfile=/tmp/server.crt