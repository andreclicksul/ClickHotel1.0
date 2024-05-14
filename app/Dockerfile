FROM node:18-alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm ci --silent

COPY . ./
RUN npm run build

RUN mkdir -p /var/www/html

RUN mv dist/* /var/www/html

RUN rm -rf /app

VOLUME /var/www/html

WORKDIR /

# Server
# FROM nginx:stable-alpine 
# COPY --from=build /app/dist /usr/share/nginx/html
# COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

#EXPOSE 3050

#CMD ["nginx", "-g", "daemon off;"]
