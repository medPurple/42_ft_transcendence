#!/bin/bash

service postgresql start

sleep 2

python3 manage.py runserver 0.0.0.0:8080