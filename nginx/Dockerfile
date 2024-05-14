FROM nginx:1.25.5 

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d

EXPOSE 3050

CMD ["nginx", "-g", "daemon off;"]

