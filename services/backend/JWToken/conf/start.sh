#!/bin/bash

python3  manage.py makemigrations tokenAPI

sleep 2

python3  manage.py migrate


sleep 5
python3 -u manage.py runserver 0.0.0.0:8080
