FROM node:alpine3.18

RUN addgroup api && adduser -S -G api api

USER api

WORKDIR /api

COPY --chown=api:node package*.json ./
# COPY package*.json .

RUN npm i --force
COPY --chown=api:node . .
# COPY . .
EXPOSE 3001

RUN npx prisma generate
CMD [ "npm", "run", "dev" ]