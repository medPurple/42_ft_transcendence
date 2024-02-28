#!/bin/bash

su postgres <<EOF
service postgresql start
sleep 5

psql -c "CREATE USER ${USER_DB_USER} WITH PASSWORD '${USER_DB_PASSWORD}';"
psql -c "CREATE DATABASE ${USER_DB_BASENAME} OWNER POSTGRES;"
EOF
