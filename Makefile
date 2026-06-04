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
PM_NAME = pokemap
PR_NAME = prom_data
GR_NAME = graf_data
VA_VOL_NAME = secret_volume

NG_IMG = $(shell docker images | grep nginx | wc -l)
G3_IMG = $(shell docker images | grep game3d | wc -l)
CH_IMG = $(shell docker images | grep chat | wc -l)
TK_IMG = $(shell docker images | grep jwtoken | wc -l)
US_IMG = $(shell docker images | grep user | wc -l)
VA_IMG = $(shell docker images | grep vault | wc -l)
PM_IMG = $(shell docker images | grep pokemap | wc -l)

VA_PS = $(shell docker ps | grep vault | wc -l)

PG_VOL = $(shell docker volume ls | grep postgres_data | wc -l)
VA_VOL = $(shell docker volume ls | grep secret_volume | wc -l)
PR_VOL = $(shell docker volume ls | grep prom | wc -l)
GR_VOL = $(shell docker volume ls | grep graf | wc -l)

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
	@ docker pull prom/prometheus
	@ docker pull grafana/grafana
	@ echo -e "$(WHITE) A self-sufficient runtime for containers$(CEND)"
	@ docker compose -f docker-compose.yml up -d --pull never
	@ echo -e "$(GREEN)★ Images Ready ★$(CEND)\n"

run_script:
	@ chmod +x ./scripts/starting_script.sh
	@ va_img=$$(docker images | grep -w vault | wc -l); \
	va_ps=$$(docker ps --filter name=vault --filter status=running -q | wc -l); \
	echo "  [run_script] vault image=$$va_img running=$$va_ps"; \
	if [ "$$va_img" = "0" ]; then \
		echo "  Building Vault from scratch..."; \
		bash -c '. ./scripts/starting_script.sh && create_network' || exit 1; \
		bash -c '. ./scripts/starting_script.sh && build_image'    || exit 1; \
		bash -c '. ./scripts/starting_script.sh && start_vault_container' || exit 1; \
		bash -c '. ./scripts/starting_script.sh && key_distrib'    || exit 1; \
	elif [ "$$va_ps" = "0" ]; then \
		echo "  Vault image exists but container stopped — restarting..."; \
		docker start $(VA_NAME) || exit 1; \
		sleep 5; \
		bash -c '. ./scripts/starting_script.sh && key_distrib' || exit 1; \
	else \
		echo "  Vault already running — redistributing tokens..."; \
		bash -c '. ./scripts/starting_script.sh && key_distrib' || exit 1; \
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

re_g3: down run_script
	@ if [ $(G3_IMG) = "1" ]; then docker rmi $(G3_NAME); fi;
	@ docker compose -f docker-compose.yml up -d --pull never

re_ch: down run_script
	@ if [ $(CH_IMG) = "1" ]; then docker rmi $(CH_NAME); fi;
	@ docker compose -f docker-compose.yml up -d --pull never

re_tk: down run_script
	@ if [ $(TK_IMG) = "1" ]; then docker rmi $(TK_NAME); fi;
	@ docker compose -f docker-compose.yml up -d --pull never

re_us: down run_script
	@ if [ $(US_IMG) = "1" ]; then docker rmi $(US_NAME); fi;
	@ docker compose -f docker-compose.yml up -d --pull never

re_pm: down run_script
	@ if [ $(PM_IMG) = "1" ]; then docker rmi $(PM_NAME); fi;
	@ docker compose -f docker-compose.yml up -d --pull never

clean: down
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

	@ if [ $(PG_VOL) = "1" ]; then docker volume rm $(PREFIX)_postgres_data; \
	else echo "	POSTGRES Volume already deleted"; fi;
	@ if [ $(PR_VOL) = "1" ]; then docker volume rm $(PREFIX)_$(PR_NAME); \
	else echo "	PROMETHEUS Volume already deleted"; fi;
	@ if [ $(GR_VOL) = "1" ]; then docker volume rm $(PREFIX)_$(GR_NAME); \
	else echo "	GRAPHANA Volume already deleted"; fi;

	@ docker system prune -af
	@ docker volume prune -f

	@ if [ $(VA_VOL) = "1" ]; then docker volume rm $(VA_VOL_NAME); \
	else echo "	vault Volume already deleted"; fi;

	@ echo -e "$(GREEN)★ Images cleaned - Volumes cleaned ★$(CEND)\n"

fclean: clean
	docker system prune -af
	docker volume prune -f

re: fclean all

piv:
	@ docker ps
	@ docker images
	@ docker volume ls

####### VPS DEPLOYMENT #######
# Usage:
#   cp .env.vps.example .env.vps   # then fill values
#   make vps                       # first run: builds + starts everything
#   make vps_cert                  # obtain Let's Encrypt certificate (once)
#   make vps_down                  # stop VPS containers

vps: run_script
	@ echo -e "\n$(YELLOW)★ Launching VPS stack (port 443, Let's Encrypt) ★$(CEND)"
	@ docker pull prom/prometheus
	@ docker pull grafana/grafana
	@ docker compose --env-file .env.vps -f docker-compose.vps.yml up -d --pull never
	@ echo -e "$(GREEN)★ VPS stack running — check https://$$DOMAIN ★$(CEND)\n"

vps_down:
	@ docker compose -f docker-compose.vps.yml down

vps_cert:
	@ echo -e "\n$(YELLOW)★ Requesting Let's Encrypt certificate ★$(CEND)"
	@ docker compose --env-file .env.vps -f docker-compose.vps.yml run --rm certbot
	@ docker compose --env-file .env.vps -f docker-compose.vps.yml restart nginx
	@ echo -e "$(GREEN)★ Certificate obtained and nginx restarted ★$(CEND)\n"

vps_renew:
	@ docker compose --env-file .env.vps -f docker-compose.vps.yml run --rm certbot renew
	@ docker compose --env-file .env.vps -f docker-compose.vps.yml restart nginx

.PHONY: all up down clean fclean re piv run_script microservices re_ng re_g3 re_ch re_tk re_us re_pm vps vps_down vps_cert vps_renew
