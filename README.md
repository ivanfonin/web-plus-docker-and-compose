# Докеризация приложения

Докеризация приложения КупиПодариДай, которое включает в себя React-приложение в качестве фронтенда (исходники в папке `frontend`) и API на Nest.js в качестве бэкенда (исходники в папке `backend`). 

IP: `51.250.20.122`  
Фронтенд: [ivanfonin.nomorepartiesco.ru](https://ivanfonin.nomorepartiesco.ru/)  
Бэкенд: [api.ivanfonin.nomorepartiesco.ru](https://api.ivanfonin.nomorepartiesco.ru/)  

## Сборка приложения для разработки

В репозитории находится файл `.env.dev.example`, который используется Docker Compose для развертнывания версии приложения для разработки, команда для запуска:

`docker compose --file docker-compose.dev.yml up -d`

После сборки фронтенд будет доступен по адресу `http://localhost:8081`, а бэкенд `http://localhost:4000`, в Nest.js будут корректно настроены CORS-заголовки.

## Сборка приложения для продашена

В репозитории находится файл `.env.example`, который показывает пример для настройки продашн-приложения, необходимо скопировать данный файл в `.env` и указать значения переменных для продакшена. Команда для сборки: 

`docker compose --file docker-compose.yml up -d`
