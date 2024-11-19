FROM nginx:alpine

COPY ./conf/nginx.conf /etc/nginx/conf.d/default.conf

VOLUME /usr/share/nginx/html

VOLUME /etc/nginx/conf.d/default.conf

WORKDIR /app

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

