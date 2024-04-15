FROM node:alpine3.18

RUN addgroup app && adduser -S -G app app

USER app

WORKDIR /app

COPY --chown=app:node . .

#COPY . .

RUN rm -rf node_modules

RUN npm i --force

RUN npm run build

USER root

RUN mkdir -p /var/www/html

RUN mv dist/* /var/www/html

VOLUME /var/www/html

WORKDIR /

RUN rm -rf /app