#!/bin/bash

# Fonction pour créer la structure du microservice
create_structure() {
	if [[ $is_backend == "y" || $is_backend == "Y" ]]; then
		mkdir -p services/backend/"$microservice_name"/conf
		mkdir -p services/backend/"$microservice_name"/tools
		touch services/backend/"$microservice_name"/Dockerfile
	else
		mkdir -p services/"$microservice_name"/conf
		mkdir -p services/"$microservice_name"/tools
		touch services/"$microservice_name"/Dockerfile
	fi
}

# Fonction pour créer les secrets
secret_init_file() {
	command="vault token create -display-name=\"$microservice_name\" > \"/vault/file/${microservice_name}_token.txt\""
	line_number=$(grep -n 'echo "\[VAULT\] Token creation"' 'services/vault/init_vault.sh' | cut -d ':' -f 1)
	new_line_number=$((line_number+1))
	sed -i.bak "${new_line_number}i\\
	$command\\
" services/vault/init_vault.sh
	rm services/vault/init_vault.sh.bak
}

secret_creation_file() {
	echo "
#------------------------------------------------#
echo \"[VAULT SECRET] ${microservice_name} container secret\"
ENV_FILE=\"/vault/${microservice_name}/.env\"
SECRET_PATH=\"${secret_category}\"
" >> services/vault/secret_creation.sh

	echo 'if [ -f "$ENV_FILE" ]; then
	set -a
	. "$ENV_FILE"
	set +a' >> services/vault/secret_creation.sh
	echo -n "    vault kv put kv/${secret_category} " >> services/vault/secret_creation.sh
	for ((i=1; i<=${secret_number}; i++)); do
		echo -n "Entrez la clé pour l'itération $i : "
		read key
		echo -n "Entrez le secret pour l'itération $i : "
		read secret

		echo -n "$key=$secret " >> services/vault/secret_creation.sh
	done
	echo '
else
	echo "$ENV_FILE unknow file."
fi
#------------------------------------------------#' >> services/vault/secret_creation.sh
}

secret_starting_script(){
	if [[ $is_backend == "y" || $is_backend == "Y" ]]; then
		command="docker exec -i vault sh -c \"cat /vault/file/${microservice_name}_token.txt | grep '^token' | awk '{print \\\\\\\$2; exit}'\" > services/backend/${microservice_name}/conf/.key"
	else
		command="docker exec -i vault sh -c \"cat /vault/file/${microservice_name}_token.txt | grep '^token' | awk '{print \\\\\\\$2; exit}'\" > services/${microservice_name}/conf/.key"
	fi
	line_number=$(grep -n 'key_distrib() {' 'scripts/starting_script.sh' | cut -d ':' -f 1)
	new_line_number=$((line_number+1))
	sed -i.bak "${new_line_number}i\\
	$command\\
" scripts/starting_script.sh
	rm scripts/starting_script.sh.bak

	if [[ $is_backend == "y" || $is_backend == "Y" ]]; then
		command="\"services/backend/${microservice_name}/conf/.key\""
	else
		command="\"services/${microservice_name}/conf/.key\""
	fi
	line_number=$(grep -n 'files_to_delete=(' 'scripts/starting_script.sh' | cut -d ':' -f 1)
	new_line_number=$((line_number+1))
	sed -i.bak "${new_line_number}i\\
		$command\\
" scripts/starting_script.sh
	rm scripts/starting_script.sh.bak
}

creating_secret(){
	touch "services/vault/env_file/.env_${microservice_name}"
	secret_init_file
	secret_creation_file
	secret_starting_script
	echo ok
}

# Fonction pour créer les fichiers
creating_file(){
	touch services/backend/"$microservice_name"/conf/requirements.txt
	touch services/backend/"$microservice_name"/conf/start.sh
	if [[ $database_needed == "y" || $database_needed == "Y" ]]; then
		touch services/backend/"$microservice_name"/conf/init_db.sh
		touch services/backend/"$microservice_name"/conf/pg_hba.conf
	fi
	echo 'FROM debian:latest

### Necessary dependencies for Django
RUN apt update -y
RUN apt install python3 python3-pip -y
RUN apt install postgresql -y
RUN apt install curl -y
RUN apt-get install jq -y


COPY /conf/pg_hba.conf /etc/postgresql/15/main/pg_hba.conf
COPY /conf/.key /tmp/.key

RUN chmod 777 /etc/postgresql/15/main/pg_hba.conf

### Database basic initialisation
COPY /conf/init_db.sh /tmp/init_db.sh
RUN chmod 777 /tmp/init_db.sh
# RUN ./init_db.sh

### Django and other python packages installation
COPY /conf/requirements.txt .
RUN pip install --break-system-packages -r requirements.txt

### Copy django app files in container
WORKDIR /app
COPY  /tools/user/ /app/
COPY /conf/start.sh .
RUN chmod 777 start.sh


### Expose on port 8080
EXPOSE 8080
EXPOSE 5432

### Launch server/application
ENTRYPOINT [ "sh", "start.sh" ]' > services/backend/"$microservice_name"/Dockerfile

	echo '#!/bin/bash

VAULT_ADDR="http://vault:8200"
SECRET_PATH="'$secret_category'"
VAULT_TOKEN=$(cat /tmp/.key)

response=$(curl -s --header "X-Vault-Token: $VAULT_TOKEN" "$VAULT_ADDR/v1/kv/$SECRET_PATH")

DB_USER=$(echo "$response" | jq -r ".data.db_username")
DB_BASENAME=$(echo "$response" | jq -r ".data.db_name")
DB_PASSWORD=$(echo "$response" | jq -r ".data.db_password")

su postgres <<EOF
service postgresql start
sleep 5

psql -c "CREATE USER ${DB_USER} WITH PASSWORD '\''${DB_PASSWORD}'\'';"
psql -c "CREATE DATABASE ${DB_BASENAME} OWNER ${DB_USER};"
psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_BASENAME} TO ${DB_USER};"
psql -c "GRANT ALL PRIVILEGES ON SCHEMA public TO ${DB_USER};"
EOF' > services/backend/"$microservice_name"/conf/init_db.sh



	echo '#!/bin/bash

sh /tmp/init_db.sh
service postgresql start

sleep 5

python3 manage.py makemigrations authentication


sleep 5

python3 manage.py migrate

sleep 5
python3 manage.py runserver 0.0.0.0:8080' > services/backend/"$microservice_name"/conf/start.sh

	echo '
# Database administrative login by Unix domain socket
local   all             postgres                                peer

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     password
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
host    all             all             ::1/128                 scram-sha-256
# Allow replication connections from localhost, by a user with the
# replication privilege.
local   replication     all                                     peer
host    replication     all             127.0.0.1/32            scram-sha-256
host    replication     all             ::1/128                 scram-sha-256
' > services/backend/"$microservice_name"/conf/pg_hba.conf
	echo ok
}

# MAIN SCRIPT
read -p "Enter a name for the new microservice : " microservice_name;
read -p "Is the microservice for backend ? (y/n) : " is_backend;
read -p "Do you need a database ? (y/n) : " database_needed;
read -p "Do you have any secret ? (y/n) : " secret_needed;

# Appels des fonctions
create_structure
if [[ $secret_needed == "y" || $secret_needed == "Y" ]]; then
	read -p "What is the secret category : " secret_category;
	read -p "How many secret do you need : " secret_number;
	creating_secret
fi

if [[ $is_backend == "y" || $is_backend == "Y" ]]; then
	creating_file
fi
