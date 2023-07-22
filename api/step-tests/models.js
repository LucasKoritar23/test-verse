const { DateValidateUtils } = require("../utils/dateValidateUtils");
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

const nomeStepSchema = Joi.string()
    .min(2)
    .max(255)
    .trim()
    .required()
    .empty()
    .pattern(/^\S.*\S$/)
    .messages({
        'string.base': 'Campo nomeStep deve ser uma string.',
        'string.min': 'Campo nomeStep deve ter pelo menos {#limit} caracteres.',
        'string.max': 'Campo nomeStep não deve ter mais de {#limit} caracteres.',
        'any.required': 'Campo nomeStep é obrigatório.',
        'string.empty': 'Campo nomeStep não pode ser vazio ou consistir apenas de espaços em branco.',
        'string.pattern.base': 'Campo nomeStep não pode ser vazio ou consistir apenas de espaços em branco.',
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

const statusAtualSchema = Joi.string()
    .valid('running', 'success', 'failed', 'blocked', 'new')
    .messages({
        'string.base': 'Campo statusAtual deve ser uma string.',
        'any.only': 'Campo statusAtual deve ter um valor válido. {#valids}.'
    });

const name = Joi.string()
    .min(2)
    .max(255)
    .trim()
    .required()
    .empty()
    .pattern(/^\S.*\S$/)
    .messages({
        'string.base': 'Campo nomeStep deve ser uma string.',
        'string.min': 'Campo nomeStep deve ter pelo menos {#limit} caracteres.',
        'string.max': 'Campo nomeStep não deve ter mais de {#limit} caracteres.',
        'any.required': 'Campo nomeStep é obrigatório.',
        'string.empty': 'Campo nomeStep não pode ser vazio ou consistir apenas de espaços em branco.',
        'string.pattern.base': 'Campo nomeStep não pode ser vazio ou consistir apenas de espaços em branco.',
    });

const id = Joi.number().integer().required().messages({
    'any.required': 'Parâmetro id é obrigatório.',
    'number.base': 'Parâmetro id deve ser um número inteiro.',
    'number.integer': 'Parâmetro id deve ser um número inteiro.',
});

const schemaId = Joi.object({
    id: id,
});

const schemaName = Joi.object({
    name: name,
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

const idTestCaseSchema = Joi.number().integer()
    .positive()
    .strict()
    .required()
    .messages({
        'any.required': 'Campo idTestCase é obrigatório.',
        'number.base': 'Campo idTestCase deve ser um número inteiro.',
        'number.integer': 'Campo idTestCase deve ser um número inteiro.',
        'number.negative': 'Campo idTestCase seve ser maior que zero.',
        'number.strict': 'O campo idTestCase ser um número inteiro positivo.'
    });

const testStepCaseSchema = Joi.object({
    nomeStep: nomeStepSchema,
    ultimaExec: ultimaExecSchema,
    statusUltimaExec: statusUltimaExecSchema,
    idSuite: idSuiteSchema,
    idTestCase: idTestCaseSchema,
    statusAtual: statusAtualSchema,
    nomeExecutor: nomeExecutorSchema,
});

// Função para obter todos os steps
const getAllStepTests = async () => {
    try {
        const query = 'SELECT * FROM test_step';
        const { rows } = await pool.query(query);
        return rows;
    } catch (error) {
        throw new Error('Erro ao obter os steps: ' + error);
    }
};

// Função para obter um steps por ID
const getTestStepById = async (idStep) => {
    try {
        const query = 'SELECT * FROM test_step WHERE id_test_step = $1';
        const { rows } = await pool.query(query, [idStep]);
        return rows[0];
    } catch (error) {
        throw new Error('Erro ao obter o step: ' + error);
    }
};

// Função para obter os steps pelo id do caso de teste
const getTestStepByTestId = async (idTestCase) => {
    try {
        const query = 'SELECT * FROM test_step WHERE id_test_case = $1';
        const { rows } = await pool.query(query, [idTestCase]);
        return rows;
    } catch (error) {
        throw new Error('Erro ao obter o step: ' + error);
    }
};

// Função para obter o step pelo nome
const getTestStepByName = async (nameStep) => {
    try {
        const query = 'SELECT * FROM test_step WHERE nome_step = $1';
        const { rows } = await pool.query(query, [nameStep]);
        return rows[0];
    } catch (error) {
        throw new Error('Erro ao obter o step: ' + error);
    }
};

// Função para criar um step
const createTestStep = async (testStep) => {
    try {
        const query = `
      INSERT INTO test_step
        (nome_step, ultima_exec, status_ultima_exec, id_suite, id_test_case, status_atual, nome_executor, data_criacao, data_edicao)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, null)
      RETURNING *;
    `;
        const values = [
            testStep.nomeStep,
            testStep.ultimaExec,
            testStep.statusUltimaExec,
            testStep.idSuite,
            testStep.idTestCase,
            testStep.statusAtual,
            testStep.nomeExecutor,
        ];
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        throw new Error('Erro ao criar step: ' + error);
    }
};

// Função para editar um step
const updateTestStep = async (id, testStep) => {
    try {
        const query =
            'UPDATE test_step SET nome_step = $1, ultima_exec = $2, status_ultima_exec = $3, id_suite = $4, id_test_case = $5, status_atual = $6, nome_executor = $7, data_edicao = CURRENT_TIMESTAMP WHERE id_test_step = $8 RETURNING *';
        const values = [
            testStep.nomeStep,
            testStep.ultimaExec,
            testStep.statusUltimaExec,
            testStep.idSuite,
            testStep.idTestCase,
            testStep.statusAtual,
            testStep.nomeExecutor,
            id,
        ];
        const { rows } = await pool.query(query, values);
        if (rows.length > 0) {
            return rows[0];
        } else {
            throw new Error('step não encontrado.');
        }
    } catch (error) {
        throw new Error('Erro ao atualizar o step: ' + error);
    }
};

// Função para deletar um step
const deleteTestStep = async (id) => {
    try {
        const query = 'DELETE FROM test_step WHERE id_test_step = $1';
        const { rowCount } = await pool.query(query, [id]);
        if (rowCount === 0) {
            throw new Error('Step não encontrado.');
        }
    } catch (error) {
        throw new Error('Erro ao excluir o step: ' + error);
    }
};

module.exports = {
    getAllStepTests,
    getTestStepById,
    getTestStepByName,
    getTestStepByTestId,
    createTestStep,
    updateTestStep,
    deleteTestStep,
    testStepCaseSchema,
    schemaId,
    schemaName
};


