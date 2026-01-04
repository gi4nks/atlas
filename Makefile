.PHONY: install dev build start lint docker-up docker-down docker-build clean add-app help

# Default app name for the add-app target
APP_NAME ?= my-new-app

help:
	@echo "Atlas Management Commands:"
	@echo "  make install      - Install npm dependencies"
	@echo "  make dev          - Start development server"
	@echo "  make build        - Build for production"
	@echo "  make start        - Start production server"
	@echo "  make lint         - Run ESLint"
	@echo "  make docker-up    - Start Atlas using Docker Compose"
	@echo "  make docker-down  - Stop Atlas Docker containers"
	@echo "  make docker-build - Rebuild Atlas Docker image"
	@echo "  make clean        - Remove .next and node_modules"
	@echo "  make add-app APP_NAME=name - Create a new app YAML from template"
	@echo "  make scan APP_NAME=name    - Auto-scan folder and generate YAML"
	@echo "  make smart-scan APP_NAME=name - Smart-scan using Gemini AI"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

lint:
	npm run lint

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-build:
	docker-compose build

clean:
	rm -rf .next node_modules

add-app:
	@if [ -f ../apps/$(APP_NAME).yml ]; then \
		echo "Error: ../apps/$(APP_NAME).yml already exists."; \
		exit 1; \
	fi
	cp ../templates/app.template.yml ../apps/$(APP_NAME).yml
	@echo "Created ../apps/$(APP_NAME).yml. Happy cataloging!"

scan:
	npm run scan $(APP_NAME)

smart-scan:
	npm run smart-scan $(APP_NAME)
