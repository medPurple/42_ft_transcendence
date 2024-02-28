#!/bin/bash

su postgres <<EOF
service postgresql start
sleep 5

psql -c "CREATE USER ${CHAT_DB_USER} WITH PASSWORD '${CHAT_DB_PASSWORD}';"
psql -c "CREATE DATABASE ${CHAT_DB_BASENAME} OWNER POSTGRES;"
EOF
