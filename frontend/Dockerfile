FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . . 
RUN npm run build
RUN rm -rf ./src
RUN rm -rf ./node_modules

FROM nginx:1.23.1-alpine AS production
WORKDIR /app
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/build ./build/
COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d/
EXPOSE 80

CMD [ "npm", "run", "start" ]