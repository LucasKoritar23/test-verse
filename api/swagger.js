const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Teste Verse API',
      version: '1.0.0',
    },
    tags: [
      {
        name: 'Suites API',
        description: 'API endpoints para gerenciamento de suites',
      },
      {
        name: 'Test Cases API',
        description: 'API endpoints para gerenciamento de casos de testes',
      },
      {
        name: 'Steps API',
        description: 'API endpoints para gerenciamento de steps',
      }
    ],
  },
  apis: [`${__dirname}/suites/routes.js`, `${__dirname}/test-case/routes.js`, `${__dirname}/step-tests/routes.js`], // Caminho para o arquivo de rotas
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
