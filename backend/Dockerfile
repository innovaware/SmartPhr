FROM node:14

WORKDIR /app
COPY package*.json ./

ENV VERSION 1.1
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "node", "main.js" ]