FROM node:20-alpine

RUN apk add --no-cache python3 make g++
RUN yarn global add nodemon

WORKDIR /app/client

COPY client/package.json .
RUN yarn

COPY client .
RUN yarn run build

WORKDIR /app/server

COPY server/package.json .

RUN yarn

COPY server .

EXPOSE 4300

CMD ["yarn", "run", "dev"]
