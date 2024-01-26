FROM node:latest
WORKDIR /api

COPY package*.json ./

RUN npm install
COPY . .
EXPOSE 3001

RUN npx prisma generate
CMD [ "npm", "run", "dev" ]