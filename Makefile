containers = $(shell docker ps -aq)
images = $(shell docker images -q)
volume = $(shell docker volume ls -q)
network = $(shell docker network ls -q)


all:
	@docker compose -f ./srcs/docker-compose.yml up --build -d

build:
	@docker compose -f ./srcs/docker-compose.yml build

show:
	@docker compose -f ./srcs/docker-compose.yml up --build

clean:
	@docker compose -f ./srcs/docker-compose.yml down
	@if [ -n "$(containers)" ]; then docker rm -f $(containers); fi
	# @if [ -n "$(images)" ]; then docker rmi -f $(images); fi

fclean: clean
	@if [ -n "$(volume)" ]; then docker volume prune -f; fi
	@if [ -n "$(network)" ]; then docker network prune -f; fi
	@docker system prune -af

re: clean all

reshow: clean show

sre: fclean all