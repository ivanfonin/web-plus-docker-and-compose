# Докеризация приложения

Докеризация приложения КупиПодариДай, которое включает в себя React-приложение в качестве фронтенда (исходники в папке `frontend`) и API на Nest.js в качестве бэкенда (исходники в папке `backend`). 

IP: `51.250.20.122`  
Фронтенд: [ivanfonin.nomorepartiesco.ru](https://ivanfonin.nomorepartiesco.ru/)  
Бэкенд: [api.ivanfonin.nomorepartiesco.ru](https://api.ivanfonin.nomorepartiesco.ru/)  

## Перед сборкой

**Внимание!** В конфигурационных файлах необходимо указать адрес фронтенда и бэкенда:
- В файлах .env и env.dev.example необходимо установить значение переменной `FRONTEND_URL`
- Создать файл `frontend/.env` и в нем установить значение переменной `REACT_APP_BACKEND_URL`

Для разработки `FRONTEND_URL=http://localhost:8081` и `REACT_APP_BACKEND_URL=http://localhost:4000`.

## Сборка приложения для разработки

В репозитории находится файл `.env.dev.example`, который используется Docker Compose для развертывания версии приложения для разработки. Также необходимо указать значение `REACT_APP_BACKEND_URL` в `frontend/.env`. Команда для сборки и запуска:

`docker compose --file docker-compose.dev.yml up -d`

## Сборка приложения для продакшена

В репозитории находится файл `.env.example`, который показывает пример для настройки продакшн-приложения, необходимо переименовать данный файл в `.env` и указать значения переменных для продакшн-версии. Также необходимо указать значение `REACT_APP_BACKEND_URL` в `frontend/.env`.   Команда для сборки и запуска:

`docker compose --file docker-compose.yml up -d`
