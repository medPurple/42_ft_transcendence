#!/bin/bash

su postgres <<EOF
service postgresql start
sleep 5

psql -c "CREATE USER ${TEMPLATE_DB_USER} WITH PASSWORD '${TEMPLATE_DB_PASSWORD}';"
psql -c "CREATE DATABASE ${TEMPLATE_DB_BASENAME} OWNER POSTGRES;"
EOF
