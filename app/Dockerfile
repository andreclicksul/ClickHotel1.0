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

# Server
#FROM nginx:alpine 
#COPY --from=build /app/build ./usr/share/nginx/html

#RUN chmod +x /usr/share/nginx/html

#EXPOSE 8080

#CMD ["nginx", "-g", "daemon off;"]
