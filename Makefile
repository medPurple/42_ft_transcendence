SHELL := /bin/bash


#######	VARIABLES #######

NAME = ft_transcendence

SRCS_PATH = ./services/

NG_NAME = nginx
G3_NAME = game3d
CH_NAME = chat
TK_NAME = jwtoken
US_NAME = user
VA_NAME = vault
MA_NAME = matchmaking

NG_IMG = $(shell docker images | grep nginx | wc -l)
G3_IMG = $(shell docker images | grep game3d | wc -l)
CH_IMG = $(shell docker images | grep chat | wc -l)
TK_IMG = $(shell docker images | grep jwtoken | wc -l)
US_IMG = $(shell docker images | grep user | wc -l)
VA_IMG = $(shell docker images | grep vault | wc -l)


US_VOL = $(shell docker volume ls | grep user | wc -l)
G3_VOL = $(shell docker volume ls | grep game3d | wc -l)
VA_VOL = $(shell docker volume ls | grep secret_volume | wc -l)
MA_VOL = $(shell docker volume ls | grep matchmaking | wc -l)
CH_VOL = $(shell docker volume ls | grep chat | wc -l)

#######	COLORS #######

WHITE = \033[97;4m
GREEN = \033[32;1m
YELLOW = \033[33;1m
RED = \033[31;1m
CEND = \033[0m

#######	RULES #######


all: run_script
	@ docker compose -f $(SRCS_PATH)docker-compose.yml up -d --pull never
	@ source ./scripts/starting_script.sh && key_remove
	@ echo -e "$(GREEN)★ Images Ready ★$(CEND)\n"

run_script:
	@ echo -e "\n$(YELLOW)★ Launching Docker ★$(CEND)"
	@ docker --version
	@ echo -e "$(WHITE) A self-sufficient runtime for containers$(CEND)"
	@ chmod +x ./scripts/starting_script.sh
	@ source ./scripts/starting_script.sh && create_network
	@ source ./scripts/starting_script.sh && build_image
	@ source ./scripts/starting_script.sh && start_vault_container
	@ source ./scripts/starting_script.sh && key_distrib

down:
	@ echo -e "\n$(YELLOW)★ Stopping Docker ★$(CEND)"
	@ docker compose -f $(SRCS_PATH)docker-compose.yml down
	@ docker stop vault
	@ docker rm vault

microservices:
	@ chmod +x ./scripts/create_microservice.sh
	@ ./scripts/create_microservice.sh

re: down all

re_ng: down run_script
	@ if [ $(NG_IMG) = "1" ]; then docker rmi $(NG_NAME); fi;
	@ docker compose -f $(SRCS_PATH)docker-compose.yml up -d --pull never
	@ source ./scripts/starting_script.sh && key_remove

re_g3: down	run_script
	@ if [ $(G3_IMG) = "1" ]; then docker rmi $(G3_NAME); fi;
	@ docker compose -f $(SRCS_PATH)docker-compose.yml up -d --pull never
	@ source ./scripts/starting_script.sh && key_remove

re_ch: down	run_script
	@ if [ $(CH_IMG) = "1" ]; then docker rmi $(CH_NAME); fi;
	@ docker compose -f $(SRCS_PATH)docker-compose.yml up -d --pull never
	@ source ./scripts/starting_script.sh && key_remove

re_tk: down	run_script
	@ if [ $(TK_IMG) = "1" ]; then docker rmi $(TK_NAME); fi;
	@ docker compose -f $(SRCS_PATH)docker-compose.yml up -d --pull never
	@ source ./scripts/starting_script.sh && key_remove

re_us: down	run_script
	@ if [ $(US_IMG) = "1" ]; then docker rmi $(US_NAME); fi;
	@ docker compose -f $(SRCS_PATH)docker-compose.yml up -d --pull never
	@ source ./scripts/starting_script.sh && key_remove

re_ma: down	run_script
	@ if [ $(MA_IMG) = "1" ]; then docker rmi $(MA_NAME); fi;
	@ docker compose -f $(SRCS_PATH)docker-compose.yml up -d --pull never
	@ source ./scripts/starting_script.sh && key_remove


clean : down
	@ echo -e "\n$(YELLOW)★ Cleaning Images - Volumes ★$(CEND)"

	@ if [ $(NG_IMG) = "1" ]; then docker rmi $(NG_NAME); \
	else echo "	NGINX Image already deleted"; fi;
	@ if [ $(G3_IMG) = "1" ]; then docker rmi $(G3_NAME); \
	else echo "	GAME3D Image already deleted"; fi;
	@ if [ $(CH_IMG) = "1" ]; then docker rmi $(CH_NAME); \
	else echo "	CHAT Image already deleted"; fi;
	@ if [ $(TK_IMG) = "1" ]; then docker rmi $(TK_NAME); \
	else echo "	TOKEN Image already deleted"; fi;
	@ if [ $(US_IMG) = "1" ]; then docker rmi $(US_NAME); \
	else echo "	USER Image already deleted"; fi;
	@ if [ $(VA_IMG) = "1" ]; then docker rmi $(VA_NAME); \
	else echo "	USER Image already deleted"; fi;
	@ if [ $(G3_VOL) = "1" ]; then docker volume rm services_$(G3_NAME); \
	else echo "	game3d Volume already deleted"; fi;
	@ if [ $(US_VOL) = "1" ]; then docker volume rm services_$(US_NAME); \
	else echo "	user Volume already deleted"; fi;
	@ if [ $(MA_VOL) = "1" ]; then docker volume rm services_$(MA_NAME); \
	else echo "	user Volume already deleted"; fi;
	@ docker volume rm secret_volume

	@ echo -e "$(GREEN)★ Images cleaned - Volumes cleaned ★$(CEND)\n"

fclean : clean
	docker system prune -af
	docker volume prune -f

re : fclean all

.PHONY: all volumes up down clean fclean re re_ng re_g3 re_ch re_tk re_us
