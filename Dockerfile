FROM node:boron-alpine

COPY package.json package.json

RUN npm install

COPY index.js index.js

COPY public/ public/

COPY views/ views/

COPY controller/ controller/

COPY routes/ routes/

COPY utils/ utils/

RUN ls -la public/
RUN ls -la views/
RUN ls -la utils/
RUN ls -la routes/
RUN ls -la controller/

RUN ls -la ~

CMD ["npm","start"]

EXPOSE 3000
