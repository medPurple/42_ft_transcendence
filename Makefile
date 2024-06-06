SHELL := /bin/bash


#######	VARIABLES #######

NAME = ft_transcendence

SRCS_PATH = ./services/
PREFIX = 42_ft_transcendence

NG_NAME = nginx
G3_NAME = game3d
CH_NAME = chat
TK_NAME = jwtoken
US_NAME = user
VA_NAME = vault
MA_NAME = matchmaking
VA_VOL_NAME = secret_volume
PM_NAME = pokemap

NG_IMG = $(shell docker images | grep nginx | wc -l)
G3_IMG = $(shell docker images | grep game3d | wc -l)
CH_IMG = $(shell docker images | grep chat | wc -l)
TK_IMG = $(shell docker images | grep jwtoken | wc -l)
US_IMG = $(shell docker images | grep user | wc -l)
VA_IMG = $(shell docker images | grep vault | wc -l)

VA_PS = $(shell docker ps | grep vault | wc -l)
PM_IMG = $(shell docker images | grep pokemap | wc -l)


US_VOL = $(shell docker volume ls | grep user | wc -l)
G3_VOL = $(shell docker volume ls | grep game3d | wc -l)
VA_VOL = $(shell docker volume ls | grep secret_volume | wc -l)
MA_VOL = $(shell docker volume ls | grep matchmaking | wc -l)
CH_VOL = $(shell docker volume ls | grep chat | wc -l)
PM_VOL = $(shell docker volume ls | grep pokemap | wc -l)
#######	COLORS #######

WHITE = \033[97;4m
GREEN = \033[32;1m
YELLOW = \033[33;1m
RED = \033[31;1m
CEND = \033[0m

#######	RULES #######

all: run_script up
	@ echo -e "\n$(GREEN)★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★$(CEND)"
	@ echo -e "\n$(GREEN)★ Welcome to $(NAME) ★$(CEND)"

	@ echo -e "\n$(WHITE)	nginx set $(CEND)"
	@ echo -e "\n$(WHITE)	game3d set $(CEND)"
	@ echo -e "\n$(WHITE)	token set $(CEND)"
	@ echo -e "\n$(WHITE)	user set $(CEND)"
	@ echo -e "\n$(WHITE)	chat set $(CEND)"

	@ echo -e "\n$(GREEN)★ Everything is running smoothly at https://localhost:4430/ ★$(CEND)"
	@ echo -e "\n$(GREEN)★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★$(CEND)"

up:
	@ echo -e "\n$(YELLOW)★ Launching Docker ★$(CEND)"
	@ docker --version
	@ echo -e "$(WHITE) A self-sufficient runtime for containers$(CEND)"
	@ docker compose -f docker-compose.yml up -d --pull never
	@ source ./scripts/starting_script.sh && key_remove
	@ echo -e "$(GREEN)★ Images Ready ★$(CEND)\n"

run_script:
	@ if [ $(VA_IMG) = "1" ]; then echo "	SCRIPT already runned"; \
	else \
		(chmod +x ./scripts/starting_script.sh) && \
		(source ./scripts/starting_script.sh && create_network) && \
		(source ./scripts/starting_script.sh && build_image) && \
		(source ./scripts/starting_script.sh && start_vault_container) && \
		(source ./scripts/starting_script.sh && key_distrib); \
	fi;

down:
	@ echo -e "\n$(YELLOW)★ Stopping Docker ★$(CEND)"
	@ docker compose -f docker-compose.yml down
	@ if [ $(VA_PS) = "1" ]; then docker stop $(VA_NAME); \
	else echo "	VAULT Process already stopped"; fi;
	@ echo -e "$(GREEN)★ Docker stopped ★$(CEND)\n"

microservices:
	@ chmod +x ./scripts/create_microservice.sh
	@ ./scripts/create_microservice.sh

re_ng: down run_script
	@ if [ $(NG_IMG) = "1" ]; then docker rmi $(NG_NAME); fi;
	@ docker compose -f docker-compose.yml up -d --pull never
	@ source ./scripts/starting_script.sh && key_remove

re_g3: down	run_script
	@ if [ $(G3_IMG) = "1" ]; then docker rmi $(G3_NAME); fi;
	@ docker compose -f docker-compose.yml up -d --pull never
	@ source ./scripts/starting_script.sh && key_remove

re_ch: down	run_script
	@ if [ $(CH_IMG) = "1" ]; then docker rmi $(CH_NAME); fi;
	@ docker compose -f docker-compose.yml up -d --pull never
	@ source ./scripts/starting_script.sh && key_remove

re_tk: down	run_script
	@ if [ $(TK_IMG) = "1" ]; then docker rmi $(TK_NAME); fi;
	@ docker compose -f docker-compose.yml up -d --pull never
	@ source ./scripts/starting_script.sh && key_remove

re_us: down	run_script
	@ if [ $(US_IMG) = "1" ]; then docker rmi $(US_NAME); fi;
	@ docker compose -f docker-compose.yml up -d --pull never
	@ source ./scripts/starting_script.sh && key_remove

re_ma: down	run_script
	@ if [ $(MA_IMG) = "1" ]; then docker rmi $(MA_NAME); fi;
	@ docker compose -f docker-compose.yml up -d --pull never
	@ source ./scripts/starting_script.sh && key_remove

re_pm: down	run_script
	@ if [ $(PM_IMG) = "1" ]; then docker rmi $(PM_NAME); fi;
	@ docker compose -f docker-compose.yml up -d --pull never
	@ source ./scripts/starting_script.sh && key_remove


clean : down
	@ echo -e -e "\n$(YELLOW)★ Cleaning Images - Volumes ★$(CEND)"

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
	@ if [ $(VA_IMG) = "1" ]; then docker rmi -f $(VA_NAME); \
	else echo "	VAULT Image already deleted"; fi;

	@ if [ $(G3_VOL) = "1" ]; then docker volume rm $(PREFIX)_$(G3_NAME); \
	else echo "	GAME3D Volume already deleted"; fi;
	@ if [ $(US_VOL) = "1" ]; then docker volume rm $(PREFIX)_$(US_NAME); \
	else echo "	USER Volume already deleted"; fi;
	@ if [ $(MA_VOL) = "1" ]; then docker volume rm $(PREFIX)_$(MA_NAME); \
	else echo "	MATCHMAKING Volume already deleted"; fi;
	@ if [ $(CH_VOL) = "1" ]; then docker volume rm $(PREFIX)_$(CH_NAME); \
	else echo "	CHAT Volume already deleted"; fi;
	@ if [ $(PM_VOL) = "1" ]; then docker volume rm services_$(PM_NAME); \
	else echo "	POKEMAP Volume already deleted"; fi;

	@ docker system prune -af
	@ docker volume prune -f

	@ if [ $(VA_VOL) = "1" ]; then docker volume rm $(VA_VOL_NAME); \
	else echo "	vault Volume already deleted"; fi;
	
	
	@ echo -e "$(GREEN)★ Images cleaned - Volumes cleaned ★$(CEND)\n"

fclean : clean
	docker system prune -af
	docker volume prune -f

re : fclean all

piv:
	@ docker ps
	@ docker images
	@ docker volume ls

.PHONY: all volumes up down clean fclean re re_ng re_g3 re_ch re_tk re_us
