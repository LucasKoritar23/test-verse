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

const nomeSuiteSchema = Joi.string()
  .min(2)
  .max(255)
  .trim()
  .required()
  .empty()
  .pattern(/^\S.*\S$/)
  .messages({
    'string.base': 'Campo nomeSuite deve ser uma string.',
    'string.min': 'Campo nomeSuite deve ter pelo menos {#limit} caracteres.',
    'string.max': 'Campo nomeSuite não deve ter mais de {#limit} caracteres.',
    'any.required': 'Campo nomeSuite é obrigatório.',
    'string.empty': 'Campo nomeSuite não pode ser vazio ou consistir apenas de espaços em branco.',
    'string.pattern.base': 'Campo nomeSuite não pode ser vazio ou consistir apenas de espaços em branco.',
  });

const statusUltimaExecSchema = Joi.string()
.allow(null)
.valid('running', 'success', 'failed', 'blocked', 'new')
.messages({
  'string.base': 'Campo statusUltimaExec deve ser uma string.',
  'any.only': 'Campo statusUltimaExec deve ter um valor válido. {#valids}.',
});

const statusAtual = Joi.string()
.valid('running', 'success', 'failed', 'blocked', 'new')
.messages({
  'string.base': 'Campo statusAtual deve ser uma string.',
  'any.only': 'Campo statusAtual deve ter um valor válido. {#valids}.'
});

const id = Joi.number().integer().required().messages({
  'any.required': 'Parâmetro id é obrigatório.',
  'number.base': 'Parâmetro id deve ser um número inteiro.',
  'number.integer': 'Parâmetro id deve ser um número inteiro.',
});

const schema = Joi.object({
  nomeSuite: nomeSuiteSchema,
  statusUltimaExec: statusUltimaExecSchema,
  statusAtual: statusAtual,
});

const schemaId = Joi.object({
  id: id,
});

// Função para obter todas as suites
const getAllSuites = async () => {
  try {
    const query = 'SELECT * FROM suites';
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    throw new Error('Erro ao obter as suites: ' + error);
  }
};

// Função para verificar se já existem suites com o mesmo nome
const getAlreadyExistsSuites = async (nameSuite) => {
  try {
    const query = 'SELECT count(*) FROM suites WHERE nome_suite = $1';
    const { rows } = await pool.query(query, [nameSuite]);
    return rows[0]['count'];
  } catch (error) {
    throw new Error('Erro ao obter as suites: ' + error);
  }
};

// Função para obter uma suite por ID
const getSuiteById = async (idSuite) => {
  try {
    const query = 'SELECT * FROM suites WHERE id_suite = $1';
    const { rows } = await pool.query(query, [idSuite]);
    return rows[0];
  } catch (error) {
    throw new Error('Erro ao obter a suite: ' + error);
  }
};

// Função para criar uma nova suite
const createSuite = async (nomeSuite, statusUltimaExec, statusAtual) => {
  try {
    const query =
      'INSERT INTO suites (nome_suite, status_ultima_exec, status_atual, data_criacao, data_edicao) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *';
    const { rows } = await pool.query(query, [nomeSuite, statusUltimaExec, statusAtual]);
    return rows[0];
  } catch (error) {
    throw new Error('Erro ao criar a suite: ' + error);
  }
};

// Função para atualizar uma suite existente
const updateSuite = async (idSuite, nomeSuite, statusUltimaExec, statusAtual) => {
  try {
    const query =
      'UPDATE suites SET nome_suite = $1, status_ultima_exec = $2, status_atual = $3, data_edicao = CURRENT_TIMESTAMP WHERE id_suite = $4 RETURNING *';
    const { rows } = await pool.query(query, [nomeSuite, statusUltimaExec, statusAtual, idSuite]);
    return rows[0];
  } catch (error) {
    throw new Error('Erro ao atualizar a suite: ' + error);
  }
};

// Função para excluir uma suite
const deleteSuite = async (idSuite) => {
  try {
    const query = 'DELETE FROM suites WHERE id_suite = $1 RETURNING *';
    const { rows } = await pool.query(query, [idSuite]);
    return rows[0];
  } catch (error) {
    throw new Error('Erro ao excluir a suite: ' + error);
  }
};

module.exports = {
  getAllSuites,
  getSuiteById,
  createSuite,
  updateSuite,
  deleteSuite,
  getAlreadyExistsSuites,
  schema,
  schemaId
};
