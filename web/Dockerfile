FROM node:18-alpine3.15

WORKDIR /app

COPY package*.json ./

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

RUN npm install

COPY . /app

ENTRYPOINT ["/entrypoint.sh"]

CMD npm run dev