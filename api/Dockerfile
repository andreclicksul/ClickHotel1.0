FROM node:latest as build
WORKDIR /api
ENV PATH /api/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm ci --silent
COPY . ./
RUN npm run build

FROM node:latest
WORKDIR /api

COPY --from=build /api/node_modules ./node_modules
COPY --from=build /api/package*.json ./
COPY --from=build /api/build ./
COPY --from=build /api/prisma/schema.prisma ./prisma/
COPY --from=build /api/prisma/migrations/ ./prisma/
COPY --from=build /api/entrypoint.sh /usr/local/bin

RUN chmod +x /usr/local/bin/entrypoint.sh

RUN npm config set update-notifier false

ENTRYPOINT [ "entrypoint.sh" ]

#RUN npx prisma migrate dev

CMD ["npm", "start"] 

EXPOSE 6000
