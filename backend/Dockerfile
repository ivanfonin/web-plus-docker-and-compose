FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . . 
RUN npm run build
RUN rm -rf ./src

FROM node:16-alpine AS production
WORKDIR /app
COPY --from=build /app/package*.json ./
RUN npm i --omit=dev
COPY --from=build /app/dist ./dist/

CMD [ "node", "dist/main" ]