FROM node:14

WORKDIR /frontend

COPY package*.json ./
COPY webpack.config.js ./

RUN npm install

RUN npm install @mui/material @emotion/react @emotion/styled

COPY . .

CMD ["npm", "start"]