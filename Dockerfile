# TODO: изменить на start:prod, разобраться в чем проблема билда

FROM node:16.20-alpine3.16

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN mkdir ./microfrontend-externals

EXPOSE 5050

CMD ["yarn", "start:dev"]