FROM node:16.19

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .

ENV VUE_APP_API_URL=https://ires-calendar-gqzz9.ondigitalocean.app/api
ENV VUE_APP_BRAND=Ires
ENV VUE_APP_BOOK_START_TIME=10
ENV VUE_APP_BOOK_END_TIME=21.5

RUN yarn && yarn build

EXPOSE 8080

CMD [ "yarn", "start" ]
