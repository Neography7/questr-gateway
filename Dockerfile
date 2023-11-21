FROM node:16-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

RUN npm run proto:all

COPY . .

EXPOSE 5000

CMD ["npm", "run", "start:dev"]