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
}

# Fonction pour créer les fichiers
creating_file(){
	touch services/backend/"$microservice_name"/conf/requirements.txt
	touch services/backend/"$microservice_name"/conf/start.sh
	if [[ $database_needed == "y" || $database_needed == "Y" ]]; then
		touch services/backend/"$microservice_name"/conf/init_db.sh
		touch services/backend/"$microservice_name"/conf/pg_hba.conf
		cat  scripts/template_db/template_docker_db.txt > services/backend/"$microservice_name"/Dockerfile
		cat  scripts/template_db/template_init_db.txt > services/backend/"$microservice_name"/conf/init_db.sh
		sed -i 's/SECRET_PATH="[^"]*"/SECRET_PATH="'"$secret_category"'"/' services/backend/"$microservice_name"/conf/init_db.sh
		cat  scripts/template_db/template_start_db.txt > services/backend/"$microservice_name"/conf/start.sh
		cat  scripts/template_db/template_pg_hba.txt > services/backend/"$microservice_name"/conf/pg_hba.conf
	else
		if [[ $secret_needed == "y" || $secret_needed == "Y" ]]; then
			cat  scripts/template_nodb/template_docker_secret.txt > services/backend/"$microservice_name"/Dockerfile
		else
			cat  scripts/template_nodb/template_docker_nosecret.txt > services/backend/"$microservice_name"/conf/start.sh
		fi
		cat  scripts/template_nodb/template_start.txt > services/backend/"$microservice_name"/conf/start.sh
	fi
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
