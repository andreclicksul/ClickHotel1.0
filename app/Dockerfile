FROM node:18-alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm ci 

COPY . .
RUN npm run build

RUN mkdir -p /var/www/html

RUN mv dist/* /var/www/html

VOLUME /var/www/html

WORKDIR /






