const { Client } = require('pg');
const fs = require('fs');

// Configurações de conexão com o banco de dados
const dbConfig = {
    user: "$DB_USER",
    host: "$DB_HOST",
    database: "$DB_DATABASE",
    password: "$DB_PASSWORD",
    port: "$DB_PORT",
};


console.log(dbConfig);
// Ler o conteúdo do arquivo SQL
const scriptContent = fs.readFileSync('/var/jenkins_home/workspace/pipeline-test-verse/db/suite.sql', 'utf8');

// Função para executar o script SQL
async function executeScript() {
  const client = new Client(dbConfig);

  try {
    await client.connect();

    // Executar o script SQL
    await client.query(scriptContent);

    console.log('Script de banco de dados executado com sucesso!');
  } catch (error) {
    console.error('Erro ao executar o script de banco de dados:', error);
  } finally {
    await client.end();
  }
}

executeScript();
