containers = $(shell docker ps -aq)
images = $(shell docker images -q)
volume = $(shell docker volume ls -q)
network = $(shell docker network ls -q)


all:
	@docker compose -f ./docker-compose.yml up --build -d

build:
	@docker compose -f ./docker-compose.yml build

show:
	@docker compose -f ./docker-compose.yml up --build

clean:
	@if [ -n "$(containers)" ]; then docker rm -f $(containers); fi

fclean: clean
	@if [ -n "$(images)" ]; then docker rmi -f $(images); fi
	@if [ -n "$(volume)" ]; then docker volume prune -f; fi
	@if [ -n "$(network)" ]; then docker network prune -f; fi
	@docker system prune -af

stop:
	@docker compose -f ./docker-compose.yml stop

down:
	@docker compose -f ./docker-compose.yml down

logs:
	@docker compose -f ./docker-compose.yml logs -f

re: clean all

reshow: clean show

sre: fclean all