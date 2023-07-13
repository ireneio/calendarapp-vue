FROM node:16.19

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .

ENV VUE_APP_API_URL=https://service-calendar-ires-vnn59.ondigitalocean.app/
ENV VUE_APP_BRAND=Ires
ENV VUE_APP_BOOK_START_TIME=10
ENV VUE_APP_BOOK_END_TIME=21.5
# ENV NUXT_ENV_APP_INSIGHT_KEY=

RUN npm install -g yarn && yarn && yarn build

EXPOSE 8080

CMD [ "npm", "start" ]
