#!/bin/bash

service postgresql start

sleep 5

su postgres <<EOF
psql -lqt | cut -d \| -f 1 | grep -qw '${TEMPLATE_DB_BASENAME}'
EOF

if [ "$?" == "0" ]; then

	echo "Database already exists."

else

	su postgres <<EOF

  psql -c "CREATE USER ${TEMPLATE_DB_USER} WITH PASSWORD '${TEMPLATE_DB_PASSWORD}';"
  psql -c "CREATE DATABASE ${TEMPLATE_DB_BASENAME} OWNER ${TEMPLATE_DB_USER};"
  psql -c "GRANT ALL PRIVILEGES ON DATABASE ${TEMPLATE_DB_BASENAME} TO ${TEMPLATE_DB_USER};"
  psql -c "GRANT ALL PRIVILEGES ON SCHEMA public TO ${TEMPLATE_DB_USER};"
EOF

fi
