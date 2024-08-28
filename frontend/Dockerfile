FROM node:14

WORKDIR /frontend

COPY package*.json ./
COPY webpack.config.js ./

RUN npm install



COPY . .

CMD ["npm", "start"]