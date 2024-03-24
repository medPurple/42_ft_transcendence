#!/bin/bash

sh /tmp/init_db.sh
service postgresql start

sleep 5

python3 manage.py makemigrations authentication


sleep 5

python3 manage.py migrate

sleep 5
python3 manage.py runserver 0.0.0.0:8080