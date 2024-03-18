
# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ancolmen <ancolmen@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/02/21 14:38:30 by ancolmen          #+#    #+#              #
#    Updated: 2024/02/21 17:55:29 by ancolmen         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

#######	VARIABLES #######

NAME = ft_transcendence

SRCS_PATH = ./services/
VOLUMES_PATH = $(SRCS_PATH)volumes

NG_NAME = nginx
G2_NAME = game2d
G3_NAME = game3d
CH_NAME = chat
TK_NAME = token
US_NAME = user

NG_IMG = $(shell docker images | grep nginx | wc -l)
G2_IMG = $(shell docker images | grep game2d | wc -l)
G3_IMG = $(shell docker images | grep game3d | wc -l)
CH_IMG = $(shell docker images | grep chat | wc -l)
TK_IMG = $(shell docker images | grep token | wc -l)
US_IMG = $(shell docker images | grep user | wc -l)

G3_VOL = $(shell docker volume ls | grep game3d | wc -l)

#######	COLORS #######

WHITE = \033[97;4m
GREEN = \033[32;1m
YELLOW = \033[33;1m
RED = \033[31;1m
CEND = \033[0m

#######	RULES #######

all : up volumes
	@ echo "\n$(GREEN)★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★$(CEND)"
	@ echo "\n$(GREEN)★ Welcome to $(NAME) ★$(CEND)"

	@ echo "\n$(WHITE)	nginx set $(CEND)"
	@ echo "\n$(WHITE)	game2d set $(CEND)"
	@ echo "\n$(WHITE)	game3d set $(CEND)"
	@ echo "\n$(WHITE)	token set $(CEND)"
	@ echo "\n$(WHITE)	user set $(CEND)"

	@ echo "\n$(GREEN)★ Everything is running smoothly at http://localhost:8080/ ★$(CEND)"
	@ echo "\n$(GREEN)★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★$(CEND)"

volumes :
	@ echo "\n$(YELLOW)★ Creating Docker Volumes ★$(CEND)"
	@ if [ ! -d $(VOLUMES_PATH) ]; \
	then \
		mkdir -p $(VOLUMES_PATH)/$(G3_NAME); \
		chmod 777 $(VOLUMES_PATH)/$(G3_NAME); \
	else \
		echo "	$(G3_NAME) already created"; \
	fi;
	@ echo "$(GREEN)★ Volumes OK ★$(CEND)\n"

up :
	@ echo "\n$(YELLOW)★ Launching Docker ★$(CEND)"
	@ docker --version
	@ echo "$(WHITE) A self-sufficient runtime for containers$(CEND)"
	docker compose -f $(SRCS_PATH)docker-compose.yml up -d --pull never
	@ echo "$(GREEN)★ Images Ready ★$(CEND)\n"

down :
	@ echo "\n$(YELLOW)★ Stopping Docker ★$(CEND)"
	docker compose -f $(SRCS_PATH)docker-compose.yml down
	@ echo "$(GREEN)★ Docker stopped ★$(CEND)\n"

re_ng: down volumes
	@ if [ $(NG_IMG) = "1" ]; then docker rmi $(NG_NAME); fi;
	@ docker compose -f $(SRCS_PATH)docker-compose.yml up -d --pull never

re_g2: down volumes
	@ if [ $(G2_IMG) = "1" ]; then docker rmi $(G2_NAME); fi;
	@ docker compose -f $(SRCS_PATH)docker-compose.yml up -d --pull never

re_g3: down volumes
	@ if [ $(G3_IMG) = "1" ]; then docker rmi $(G3_NAME); fi;
	@ docker compose -f $(SRCS_PATH)docker-compose.yml up -d --pull never

re_ch: down volumes
	@ if [ $(CH_IMG) = "1" ]; then docker rmi $(CH_NAME); fi;
	@ docker compose -f $(SRCS_PATH)docker-compose.yml up -d --pull never

re_tk: down volumes
	@ if [ $(TK_IMG) = "1" ]; then docker rmi $(TK_NAME); fi;
	@ docker compose -f $(SRCS_PATH)docker-compose.yml up -d --pull never

re_us: down volumes
	@ if [ $(US_IMG) = "1" ]; then docker rmi $(US_NAME); fi;
	@ docker compose -f $(SRCS_PATH)docker-compose.yml up -d --pull never

clean : down
	@ echo "\n$(YELLOW)★ Cleaning Images - Volumes ★$(CEND)"

	@ if [ $(NG_IMG) = "1" ]; then docker rmi $(NG_NAME); \
	else echo "	NGINX Image already deleted"; fi;
	@ if [ $(G2_IMG) = "1" ]; then docker rmi $(G2_NAME); \
	else echo "	GAME2D Image already deleted"; fi;
	@ if [ $(G3_IMG) = "1" ]; then docker rmi $(G3_NAME); \
	else echo "	GAME3D Image already deleted"; fi;
	@ if [ $(CH_IMG) = "1" ]; then docker rmi $(CH_NAME); \
	else echo "	CHAT Image already deleted"; fi;
	@ if [ $(TK_IMG) = "1" ]; then docker rmi $(TK_NAME); \
	else echo "	TOKEN Image already deleted"; fi;
	@ if [ $(US_IMG) = "1" ]; then docker rmi $(US_NAME); \
	else echo "	USER Image already deleted"; fi;

	@ if [ $(G3_VOL) = "1" ]; then docker volume rm $(G3_NAME); \
	else echo "	game3d Volume already deleted"; fi;

	docker system prune -af
	docker volume prune -f

	@ echo "$(GREEN)★ Images cleaned - Volumes cleaned ★$(CEND)\n"

fclean : clean
	rm -rf $(VOLUMES_PATH)
	
re : fclean all

.PHONY: all volumes up down clean fclean re re_ng re_g2 re_g3 re_ch re_tk re_us
