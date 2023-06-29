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

const testCaseSchema = Joi.object({
  id_teste: Joi.number().integer().required(),
  nome_teste: Joi.string().max(255).required(),
  ultima_exec: Joi.date().allow(null),
  status_ultima_exec: Joi.string().max(25).allow(null),
  id_suite: Joi.number().integer().required(),
  status_atual: Joi.string().max(25).allow(null),
  zip_evidencia: Joi.string().allow(null),
  nome_executor: Joi.string().max(255).allow(null),
});

const getAllTestCases = async () => {
  try {
    const query = 'SELECT * FROM teste_case';
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    throw new Error('Erro ao obter os casos de teste: ' + error);
  }
};

const getTestCaseById = async (id) => {
  try {
    const query = 'SELECT * FROM teste_case WHERE id_teste = $1';
    const { rows } = await pool.query(query, [id]);
    if (rows.length > 0) {
      return rows[0];
    } else {
      throw new Error('Caso de teste não encontrado.');
    }
  } catch (error) {
    throw new Error('Erro ao obter o caso de teste: ' + error);
  }
};

const createTestCase = async (testCase) => {
  try {
    const query =
      'INSERT INTO teste_case (nome_teste, ultima_exec, status_ultima_exec, id_suite, status_atual, zip_evidencia, nome_executor) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [
      testCase.nome_teste,
      testCase.ultima_exec,
      testCase.status_ultima_exec,
      testCase.id_suite,
      testCase.status_atual,
      testCase.zip_evidencia,
      testCase.nome_executor,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    throw new Error('Erro ao criar o caso de teste: ' + error);
  }
};

const updateTestCase = async (id, testCase) => {
  try {
    const query =
      'UPDATE teste_case SET nome_teste = $1, ultima_exec = $2, status_ultima_exec = $3, id_suite = $4, status_atual = $5, zip_evidencia = $6, nome_executor = $7 WHERE id_teste = $8 RETURNING *';
    const values = [
      testCase.nome_teste,
      testCase.ultima_exec,
      testCase.status_ultima_exec,
      testCase.id_suite,
      testCase.status_atual,
      testCase.zip_evidencia,
      testCase.nome_executor,
      id,
    ];
    const { rows } = await pool.query(query, values);
    if (rows.length > 0) {
      return rows[0];
    } else {
      throw new Error('Caso de teste não encontrado.');
    }
  } catch (error) {
    throw new Error('Erro ao atualizar o caso de teste: ' + error);
  }
};

const deleteTestCase = async (id) => {
  try {
    const query = 'DELETE FROM teste_case WHERE id_teste = $1';
    const { rowCount } = await pool.query(query, [id]);
    if (rowCount === 0) {
      throw new Error('Caso de teste não encontrado.');
    }
  } catch (error) {
    throw new Error('Erro ao excluir o caso de teste: ' + error);
  }
};

module.exports = {
  getAllTestCases,
  getTestCaseById,
  createTestCase,
  updateTestCase,
  deleteTestCase,
  testCaseSchema,
};
