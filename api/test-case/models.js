const { Pool } = require('pg');
const Joi = require('joi');
const { DateValidateUtils } = require('../utils/dateValidateUtils');
require('dotenv').config();

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const nomeTestSchema = Joi.string()
  .min(2)
  .max(255)
  .trim()
  .required()
  .empty()
  .pattern(/^\S.*\S$/)
  .messages({
    'string.base': 'Campo nomeTeste deve ser uma string.',
    'string.min': 'Campo nomeTeste deve ter pelo menos {#limit} caracteres.',
    'string.max': 'Campo nomeTeste não deve ter mais de {#limit} caracteres.',
    'any.required': 'Campo nomeTeste é obrigatório.',
    'string.empty': 'Campo nomeTeste não pode ser vazio ou consistir apenas de espaços em branco.',
    'string.pattern.base': 'Campo nomeTeste não pode ser vazio ou consistir apenas de espaços em branco.',
  });

const ultimaExecSchema = Joi.string()
  .allow(null)
  .regex(/^\d{4}-\d{2}-\d{2}T\d{1,2}:\d{1,2}:\d{1,2}$/)
  .empty(null)
  .custom((value, helpers) => {
    const fieldName = helpers.state.path[0]
    const validationResult = new DateValidateUtils().validateDate(fieldName, value);
    if (!validationResult.valid) {
      return helpers.message(validationResult.message);
    }
  })
  .messages({
    'any.required': 'Campo ultimaExec deve estar preenchido.',
    'date.base': 'Campo ultimaExec deve ser uma data válida.',
    'date.empty': 'Campo ultimaExec não pode ser vazio ou consistir apenas de espaços em branco.',
    'string.pattern.base': 'Campo ultimaExec deve estar no formato yyyy-MM-DDTH:m:s'
  });

const statusUltimaExecSchema = Joi.string()
  .allow(null)
  .valid('running', 'success', 'failed', 'blocked', 'new')
  .messages({
    'string.base': 'Campo statusUltimaExec deve ser uma string.',
    'any.only': 'Campo statusUltimaExec deve ter um valor válido. {#valids}.',
  });

const idSuiteSchema = Joi.number().integer()
  .positive()
  .strict()
  .required()
  .messages({
    'any.required': 'Campo idSuite é obrigatório.',
    'number.base': 'Campo idSuite deve ser um número inteiro.',
    'number.integer': 'Campo idSuite deve ser um número inteiro.',
    'number.negative': 'Campo idSuite seve ser maior que zero.',
    'number.strict': 'O campo deve ser um número inteiro positivo.'
  });

const statusAtualSchema = Joi.string()
  .valid('running', 'success', 'failed', 'blocked', 'new')
  .messages({
    'string.base': 'Campo statusAtual deve ser uma string.',
    'any.only': 'Campo statusAtual deve ter um valor válido. {#valids}.'
  });

const nomeExecutorSchema = Joi.string()
  .min(2)
  .max(255)
  .trim()
  .required()
  .empty()
  .pattern(/^\S.*\S$/)
  .messages({
    'string.base': 'Campo nomeExecutor deve ser uma string.',
    'string.min': 'Campo nomeExecutor deve ter pelo menos {#limit} caracteres.',
    'string.max': 'Campo nomeExecutor não deve ter mais de {#limit} caracteres.',
    'any.required': 'Campo nomeExecutor é obrigatório.',
    'string.empty': 'Campo nomeExecutor não pode ser vazio ou consistir apenas de espaços em branco.',
    'string.pattern.base': 'Campo nomeExecutor não pode ser vazio ou consistir apenas de espaços em branco.',
  });

const zipEvidenciaSchema = Joi.string()
  .min(2)
  .max(255)
  .trim()
  .required()
  .empty()
  .pattern(/^\S.*\S$/)
  .messages({
    'string.base': 'Campo zipEvidencia deve ser uma string.',
    'string.min': 'Campo zipEvidencia deve ter pelo menos {#limit} caracteres.',
    'string.max': 'Campo zipEvidencia não deve ter mais de {#limit} caracteres.',
    'any.required': 'Campo zipEvidencia é obrigatório.',
    'string.empty': 'Campo zipEvidencia não pode ser vazio ou consistir apenas de espaços em branco.',
    'string.pattern.base': 'Campo zipEvidencia não pode ser vazio ou consistir apenas de espaços em branco.',
  });

const testCaseSchema = Joi.object({
  nomeTeste: nomeTestSchema,
  ultimaExec: ultimaExecSchema,
  statusUltimaExec: statusUltimaExecSchema,
  idSuite: idSuiteSchema,
  statusAtual: statusAtualSchema,
  zipEvidencia: zipEvidenciaSchema,
  nomeExecutor: nomeExecutorSchema,
});

const id = Joi.number().integer().required().messages({
  'any.required': 'Parâmetro id é obrigatório.',
  'number.base': 'Parâmetro id deve ser um número inteiro.',
  'number.integer': 'Parâmetro id deve ser um número inteiro.',
});

const schemaId = Joi.object({
  id: id,
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
    const query = `
    INSERT INTO teste_case
      (nome_teste, ultima_exec, status_ultima_exec, id_suite, status_atual, zip_evidencia, nome_executor, data_criacao, data_edicao)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, null)
    RETURNING *;
  `;
    const values = [
      testCase.nomeTeste,
      testCase.ultimaExec,
      testCase.statusUltimaExec,
      testCase.idSuite,
      testCase.statusAtual,
      testCase.zipEvidencia,
      testCase.nomeExecutor,
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
      'UPDATE teste_case SET nome_teste = $1, ultima_exec = $2, status_ultima_exec = $3, id_suite = $4, status_atual = $5, zip_evidencia = $6, nome_executor = $7, data_edicao = CURRENT_TIMESTAMP WHERE id_teste = $8 RETURNING *';
    const values = [
      testCase.nomeTeste,
      testCase.ultimaExec,
      testCase.statusUltimaExec,
      testCase.idSuite,
      testCase.statusAtual,
      testCase.zipEvidencia,
      testCase.nomeExecutor,
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
  schemaId
};
