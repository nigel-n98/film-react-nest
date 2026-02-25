# Film Afisha

Веб-приложение (NestJS + PostgreSQL + React)

## Продакшен

http://film-nigel.nomorepartiessite.ru/

------------------------------------------------------------------------

## Запуск через Docker

1.  Создать файл переменных окружения:

cp .env.example .env

2.  Запустить проект:

docker compose up -d --build

Приложение: http://localhost

------------------------------------------------------------------------

## Тесты

cd backend
npm ci npm
run test

------------------------------------------------------------------------

## CI/CD

При push в main GitHub Actions собирает Docker-образы и публикует их в
ghcr.io.