FROM node:18

WORKDIR /test-verse
COPY . .

RUN npm install
RUN npm install -g nodemon

EXPOSE 3001

RUN chmod 777 /test-verse

# Inicializa a aplicação
CMD ["npm", "run", "suites"]