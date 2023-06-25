const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Suites API',
      version: '1.0.0',
    },
  },
  apis: [`${__dirname}/routes.js`], // Caminho para o arquivo de rotas
};

const specs = swaggerJsdoc(options);

const pastaDocs = path.join(__dirname, './docs');
const caminhoArquivoSwagger = path.join(pastaDocs, 'swagger.json');

// Converter o objeto `swaggerSpec` em JSON
const swaggerJSON = JSON.stringify(specs, null, 2);
fs.writeFileSync(caminhoArquivoSwagger, swaggerJSON);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
