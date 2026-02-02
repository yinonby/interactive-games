.PHONY: install install-dev install-prod lint pytest test run run-dev run-prod

help:
	@echo "Available commands:"
	@echo "  make install   - run install in dev mode"
	@echo "  make lint      - run ruff lint"
	@echo "  make format    - check formatting"
	@echo "  make type      - run mypy"
	@echo "  make test      - run pytest"
	@echo "  make coverage  - coverage report"
	@echo "  make all       - run everything"

install: install-dev

install-dev:
	poetry install --with dev

install-prod:
	poetry install --without dev

lint:
	poetry run ruff format src --check
	poetry run ruff check src
	poetry run mypy --strict src

pytest:
	poetry run pytest

test: install lint pytest

run: run-dev

run-dev: ENV=development
run-dev: install-dev
run-dev:
	poetry run ./src/program.py

run-prod: ENV=production
run-prod:
	poetry run ./src/program.py
