all:
	@ docker network create -d bridge microservices
	@ docker build -t vault services/vault/
	@ docker run --name vault --network microservices -p 8200:8200 -v secret_volume:/vault/file --cap-add IPC_LOCK -e VAULT_ADDR=http://127.0.0.1:8200  -d vault
	@ docker compose -f ./services/docker-compose.yml up -d --build

down:
	@ docker compose -f ./services/docker-compose.yml down

re:	down
		@ docker compose -f ./services/docker-compose.yml up -d --build

clean:
	@docker stop $$(docker ps -qa);\
	 docker rm $$(docker ps -qa);\
	 docker rmi -f $$(docker images -qa);\
	 docker volume rm $$(docker volume ls -q);\
	 docker network rm $$(docker network ls -q);\

check_network:
    if ! docker network inspect microservices &> /dev/null; then \
        docker network create -d bridge microservices; \
    fi
.PHONY: all re down clean
