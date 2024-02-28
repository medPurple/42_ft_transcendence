#!/bin/bash

service postgresql start

sleep 5

su - postgres

echo "CREATE DATABASE $DB_USER_NAME OWNER postgres;" | psql

exit
