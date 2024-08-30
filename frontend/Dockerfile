FROM node:20.17.0

WORKDIR /frontend

COPY package*.json ./
COPY webpack.config.js ./

RUN npm install



COPY . .

CMD ["npm", "start"]