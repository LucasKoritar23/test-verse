const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function applyScript() {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    const client = await pool.connect();

    try {
      const scriptPath = path.join(__dirname, 'suite.sql');
      const script = fs.readFileSync(scriptPath, 'utf8');

      await client.query(script);
      console.log('Script executado com sucesso!');
    } catch (error) {
      console.error('Erro ao executar o script:', error);
    } finally {
      client.release(); // Libera o cliente de volta para o pool
    }
  } catch (error) {
    console.error('Erro ao obter cliente do pool:', error);
  } finally {
    pool.end(); // Encerra todas as conexões no pool
  }
}

// Chame a função applyScript após o deploy ou onde fizer sentido no seu código
applyScript();
