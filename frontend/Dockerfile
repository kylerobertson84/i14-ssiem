FROM node:20.17.0 as build

WORKDIR /frontend

COPY package*.json ./
COPY webpack.config.js ./
RUN npm install 
#install dependencies
#copy source code into container
COPY . .

RUN npm run build

#Testing the application
FROM build as test

WORKDIR /frontend
COPY --from=build /frontend .
CMD ["npm", "test"]


#production
FROM node:20.17.0

WORKDIR /frontend

COPY --from=build /frontend .

CMD ["npm", "start"]