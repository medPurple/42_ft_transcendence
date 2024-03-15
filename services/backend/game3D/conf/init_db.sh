#!/bin/bash

service postgresql start

sleep 5

su postgres <<EOF
psql -lqt | cut -d \| -f 1 | grep -qw '${GAME_DB_BASENAME}'
EOF

if [ "$?" == "0" ]; then

	echo "Database already exists."

else

	su postgres <<EOF

	psql -c "CREATE USER ${GAME_DB_USER} WITH PASSWORD '${GAME_DB_PASSWORD}';"
	psql -c "CREATE DATABASE ${GAME_DB_BASENAME} OWNER ${GAME_DB_USER};"
	psql -c "GRANT ALL PRIVILEGES ON DATABASE ${GAME_DB_BASENAME} TO ${GAME_DB_USER};"
	psql -c "GRANT ALL PRIVILEGES ON SCHEMA public TO ${GAME_DB_USER};"
EOF

fi