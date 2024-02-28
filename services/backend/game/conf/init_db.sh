#!/bin/bash

su postgres <<EOF
service postgresql start
sleep 5

psql -c "CREATE USER ${GAME_DB_USER} WITH PASSWORD '${GAME_DB_PASSWORD}';"
psql -c "CREATE DATABASE ${GAME_DB_BASENAME} OWNER POSTGRES;"
EOF
