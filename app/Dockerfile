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

WORKDIR /var/www/html


FROM nginx:1.25.5 

COPY --from=build /app/dist /www/var/html
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d

# Server
#FROM nginx:alpine 
#

#RUN chmod +x /usr/share/nginx/html

#EXPOSE 8080

#CMD ["nginx", "-g", "daemon off;"]
