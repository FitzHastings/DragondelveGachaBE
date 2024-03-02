FROM node:21-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 4812
CMD ["npm", "run", "start-prod"]
