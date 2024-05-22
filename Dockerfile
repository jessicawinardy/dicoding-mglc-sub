FROM node:18.20.3
WORKDIR /usr/src/app
COPY . .
COPY .env .
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "start"]