FROM node as build
RUN mkdir /app
WORKDIR /app
COPY . .

RUN npm install
RUN npm install -g @angular/cli

ENV NODE_OPTIONS=--openssl-legacy-provider
RUN ng build --prod

FROM nginx:latest

COPY --from=build /app/dist/smartiphr/ /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
