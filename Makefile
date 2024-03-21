network_name = microservices
image_name = vault

all: run_script
	@ docker compose -f ./services/docker-compose.yml up -d --build

run_script:
	@ chmod +x make_script.sh
	@ ./make_script.sh

down:
	@ docker compose -f ./services/docker-compose.yml down
	@ docker stop vault
	@ docker rm vault


re: down all

clean:
	@docker stop $$(docker ps -qa);\
	 docker rm $$(docker ps -qa);\
	 docker rmi -f $$(docker images -qa);\
	 docker volume rm $$(docker volume ls -q);\
	 docker network rm $$(docker network ls -q);
 
.PHONY: all re down clean create_network build_image
