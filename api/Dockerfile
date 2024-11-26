FROM node:16.20.2

WORKDIR /api

COPY package.json .

RUN npm install

COPY . .

CMD ["npm","run","dev"]

EXPOSE 8080