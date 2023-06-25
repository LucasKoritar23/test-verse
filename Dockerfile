FROM node:18

WORKDIR /test-verse
COPY . /test-verse

RUN npm install
RUN npm install -g nodemon

ENV DB_USER="${DB_USER}"
ENV DB_HOST="${DB_HOST}"
ENV DB_DATABASE="${DB_DATABASE}"
ENV DB_PASSWORD="${DB_PASSWORD}"
ENV DB_PORT="{$DB_PORT}"

EXPOSE 3001

RUN chmod 777 /test-verse

# Inicializa a aplicação
CMD ["npm", "run", "suites"]