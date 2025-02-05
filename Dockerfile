FROM node:lts as build
WORKDIR /usr/local/app

COPY ./src /usr/local/app/src
COPY ./public /usr/local/app/public
COPY ./package.json /usr/local/app
COPY ./package-lock.json /usr/local/app
COPY ./tsconfig.json /usr/local/app
COPY ./tsconfig.app.json /usr/local/app
COPY ./tsconfig.spec.json /usr/local/app
COPY ./angular.json /usr/local/app


RUN npm install
RUN npm run build

FROM nginx:stable
COPY --from=build /usr/local/app/dist/dockerizalo-ui/browser /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
EXPOSE 80