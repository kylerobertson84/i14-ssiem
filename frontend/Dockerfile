FROM node:20.17.0

WORKDIR /frontend


COPY package*.json ./
COPY webpack.config.js ./

RUN npm ci --only=production

COPY . .

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

CMD ["npm", "start"]