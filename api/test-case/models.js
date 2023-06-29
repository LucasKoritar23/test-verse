const { Pool } = require('pg');
const Joi = require('joi');
require('dotenv').config();

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Schema de validação para o modelo TestCase
const testCaseSchema = Joi.object({
  id_teste: Joi.number().integer().required(),
  nome_teste: Joi.string().max(255).required(),
  ultima_exec: Joi.date().allow(null),
  status_ultima_exec: Joi.string().max(25).allow(null),
  id_suite: Joi.number().integer().required(),
  status_atual: Joi.string().max(25).allow(null),
  zip_evidencia: Joi.string().allow(null),
  nome_executor: Joi.string().max(255).allow(null)
});

// Obter todos os casos de teste do banco de dados
async function getAllTestCases() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM teste_case');
    return result.rows;
  } finally {
    client.release();
  }
}

// Obter um caso de teste pelo ID do banco de dados
async function getTestCaseById(id) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM teste_case WHERE id_teste = $1', [id]);
    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      throw new Error('Caso de teste não encontrado.');
    }
  } finally {
    client.release();
  }
}

// Criar um novo caso de teste no banco de dados
async function createTestCase(testCase) {
  const client = await pool.connect();
  try {
    const query = 'INSERT INTO teste_case (nome_teste, ultima_exec, status_ultima_exec, id_suite, status_atual, zip_evidencia, nome_executor) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [
      testCase.nome_teste,
      testCase.ultima_exec,
      testCase.status_ultima_exec,
      testCase.id_suite,
      testCase.status_atual,
      testCase.zip_evidencia,
      testCase.nome_executor
    ];
    const result = await client.query(query, values);
  } catch (error) {
    console.log(error);
    throw new Error('Erro ao criar o caso de teste: ' + error);
  } finally {
    client.release();
  }
}

// Atualizar um caso de teste no banco de dados
async function updateTestCase(id, testCase) {
  const client = await pool.connect();
  try {
    const query = 'UPDATE teste_case SET nome_teste = $1, ultima_exec = $2, status_ultima_exec = $3, id_suite = $4, status_atual = $5, zip_evidencia = $6, nome_executor = $7 WHERE id_teste = $8 RETURNING *';
    const values = [
      testCase.nome_teste,
      testCase.ultima_exec,
      testCase.status_ultima_exec,
      testCase.id_suite,
      testCase.status_atual,
      testCase.zip_evidencia,
      testCase.nome_executor,
      id
    ];
    const result = await client.query(query, values);
    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      throw new Error('Caso de teste não encontrado.');
    }
  } finally {
    client.release();
  }
}

// Excluir um caso de teste do banco de dados
async function deleteTestCase(id) {
  const client = await pool.connect();
  try {
    const query = 'DELETE FROM teste_case WHERE id_teste = $1';
    const result = await client.query(query, [id]);
    if (result.rowCount === 0) {
      throw new Error('Caso de teste não encontrado.');
    }
  } finally {
    client.release();
  }
}

module.exports = {
  getAllTestCases,
  getTestCaseById,
  createTestCase,
  updateTestCase,
  deleteTestCase,
  testCaseSchema
};
