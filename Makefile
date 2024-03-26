SHELL := /bin/bash
network_name = microservices
image_name = vault

all: run_script
	@ docker compose -f ./services/docker-compose.yml up -d --build
	@ source ./scripts/starting_script.sh && key_remove

run_script:
	@ chmod +x ./scripts/starting_script.sh
	@ source ./scripts/starting_script.sh && create_network
	@ source ./scripts/starting_script.sh && build_image
	@ source ./scripts/starting_script.sh && start_vault_container
	@ source ./scripts/starting_script.sh && key_distrib

create_volumes_repo :

						@if [ ! -d ./services/volumes ]; \
						then \
							mkdir ./services/volumes; \
						fi ; \
						if [ ! -d ./services/volumes/userbase  ]; \
						then \
							mkdir ./services/volumes/userbase ; \
						fi ; \

down:
	@ docker compose -f ./services/docker-compose.yml down
	@ docker stop vault
	@ docker rm vault

microservices:
	@ chmod +x ./scripts/create_microservice.sh
	@ ./scripts/create_microservice.sh

re: down all

clean:
	@docker stop $$(docker ps -qa);\
	 docker rm $$(docker ps -qa);\
	 docker rmi -f $$(docker images -qa);\
	 docker volume rm $$(docker volume ls -q);\
	 docker network rm $$(docker network ls -q);

.PHONY: all re down clean run_script
