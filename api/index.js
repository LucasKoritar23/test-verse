const express = require('express');
const routesSuites = require('./suites/routes');
const routesTestCase = require('./test-case/routes');
const swagger = require('./swagger');

const app = express();
const port = 3001; // Porta do microserviço suites

app.use(express.json());

app.use('/suites', routesSuites);
app.use('/test-cases', routesTestCase);

swagger(app);

app.listen(port, () => {
  console.log(`API Testverse em execução em http://localhost:${port}`);
});
