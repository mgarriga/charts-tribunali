FROM risingstack/alpine:3.3-v4.2.6-1.1.3

COPY package.json package.json

RUN npm install

COPY index.js index.js

COPY public/ public/

COPY views/ views/

RUN ls -la public/
RUN ls -la views/
RUN ls -la ~

CMD ["npm","start"]

EXPOSE 3000
