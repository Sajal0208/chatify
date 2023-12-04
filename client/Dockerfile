FROM node

WORKDIR /app

ENV BASE_URL=http://localhost:8080
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]