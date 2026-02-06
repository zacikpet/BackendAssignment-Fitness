FROM node:20

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY . .
EXPOSE 8000

CMD ["npm", "start"]
