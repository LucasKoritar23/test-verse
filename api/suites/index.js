const express = require('express');
const routes = require('./routes');
const swagger = require('./swagger');

const app = express();
const port = 3001; // Porta do microserviço suites

app.use(express.json());
app.use('/suites', routes);

swagger(app);

app.listen(port, () => {
  console.log(`Microserviço suites em execução em http://localhost:${port}`);
});
