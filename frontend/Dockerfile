FROM node:20.17.0

WORKDIR /frontend


COPY package*.json ./
COPY webpack.config.js ./

RUN npm ci --only=production

COPY . .

RUN npm run build

CMD ["npm", "start"]