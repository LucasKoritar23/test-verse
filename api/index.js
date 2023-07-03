const express = require('express');
const routesSuites = require('./suites/routes');
const routesTestCase = require('./test-case/routes');
const swagger = require('./swagger');
const prometheusApiMetrics = require('prometheus-api-metrics');

const app = express();
const port = 3001; // Porta do microserviço suites

app.use(express.json());

// Adicione o middleware do prometheus-api-metrics
app.use(prometheusApiMetrics());

// Middleware para incrementar o contador a cada request
app.use((req, res, next) => {
  next();
});

app.use('/suites', routesSuites);
app.use('/test-cases', routesTestCase);

swagger(app);

app.listen(port, () => {
  console.log(`API Testverse em execução em http://localhost:${port}`);
});
