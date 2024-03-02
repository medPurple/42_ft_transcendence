all:
	@sudo docker compose -f ./services/docker-compose.yml up -d --build

down:
	@sudo docker compose -f ./services/docker-compose.yml down

re:	down
		@sudo docker compose -f ./services/docker-compose.yml up -d --build

clean:
	@sudo docker stop $$(docker ps -qa);\
	sudo docker rm $$(docker ps -qa);\
	sudo docker rmi -f $$(docker images -qa);\
	sudo docker volume rm $$(docker volume ls -q);\
	sudo docker network rm $$(docker network ls -q);\

.PHONY: all re down clean
