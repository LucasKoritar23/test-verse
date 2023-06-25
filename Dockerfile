FROM node:18

WORKDIR /test-verse
COPY . /test-verse

RUN npm install
RUN npm install -g nodemon

EXPOSE 3001

RUN chmod 777 /test-verse

# Execute o script de banco de dados
RUN node '/db/applyScripts.js'

# Inicializa a aplicação
CMD ["npm", "run", "suites"]