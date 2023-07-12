const { PaginationUtils } = require('../utils/paginationUtils');
const models = require('./models');
const { v4: uuidv4 } = require('uuid');

// Controlador para obter todos os steps
const getAllStepTests = async (req, res) => {
    try {
        const pageSize = 50;
        const currentPage = req.query.page ? parseInt(req.query.page) : 1;
        const testCases = await models.getAllStepTests();
        const paginationUtils = new PaginationUtils();
        const response = await paginationUtils.pagination(currentPage, pageSize, testCases);
        res.json(response);
    } catch (error) {
        console.error('Erro ao buscar os steps:', error);
        res.status(500).json({ uuid: uuidv4(), error: 'Erro ao buscar os os steps.' });
    }
};

// Controlador para obter um step pelo ID
const getTestStepById = async (req, res) => {
    const { id } = req.params;
    const { error: validationId } = models.schemaId.validate({ id });
    if (validationId) {
        return res.status(400).json({ uuid: uuidv4(), error: validationId.details[0].message });
    }

    try {
        const testCase = await models.getTestStepById(id);
        res.json(testCase);
    } catch (error) {
        console.error('Step não encontrado:', error);
        res.status(404).json({ uuid: uuidv4(), error: 'Step não encontrado.' });
    }
};

// Controlador para obter um step pelo nome
const getTestStepByName = async (req, res) => {
    const { name } = req.params;
    const { error: validationName } = models.schemaName.validate({ name });
    if (validationName) {
        return res.status(400).json({ uuid: uuidv4(), error: validationName.details[0].message });
    }

    try {
        const testCase = await models.getTestStepByName(name);
        res.json(testCase);
    } catch (error) {
        console.error('Step não encontrado:', error);
        res.status(404).json({ uuid: uuidv4(), error: 'Step não encontrado.' });
    }
};

// Controlador para obter os steps de um teste pelo id do teste
const getTestStepByTestId = async (req, res) => {
    const { id } = req.params;
    const { error: validationId } = models.schemaId.validate({ id });
    if (validationId) {
        return res.status(400).json({ uuid: uuidv4(), error: validationId.details[0].message });
    }

    try {
        const testCase = await models.getTestStepByTestId(id);
        res.json(testCase);
    } catch (error) {
        console.error('Step não encontrado:', error);
        res.status(404).json({ uuid: uuidv4(), error: 'Step não encontrado.' });
    }
};

// Controlador para criar um novo step
const createTestStep = async (req, res) => {
    const { error } = models.testStepCaseSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ uuid: uuidv4(), error: error.details[0].message });
    }

    try {
        const testCase = await models.createTestStep(req.body);
        res.status(201).json(testCase);
    } catch (error) {
        console.error('Erro ao criar o step:', error);
        res.status(500).json({ uuid: uuidv4(), error: 'Erro ao criar step.' });
    }
};

// Controlador para atualizar um step
const updateTestStep = async (req, res) => {
    const { id } = req.params;
    const { error: validationId } = models.schemaId.validate({ id });
    if (validationId) {
        return res.status(400).json({ uuid: uuidv4(), error: validationId.details[0].message });
    }

    const { error } = models.testStepCaseSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ uuid: uuidv4(), error: error.details[0].message });
    }

    try {
        const testCase = await models.updateTestStep(id, req.body);
        res.json(testCase);
    } catch (error) {
        console.error('Step não encontrado:', error);
        res.status(404).json({ uuid: uuidv4(), error: 'Step não encontrado.' });
    }
};

// Controlador para excluir um step
const deleteTestStep = async (req, res) => {
    const { id } = req.params;
    const { error: validationId } = models.schemaId.validate({ id });
    if (validationId) {
        return res.status(400).json({ uuid: uuidv4(), error: validationId.details[0].message });
    }

    try {
        await models.deleteTestStep(id);
        res.json({ message: 'Step excluído com sucesso.' });
    } catch (error) {
        console.error('Step não encontrado:', error);
        res.status(404).json({ uuid: uuidv4(), error: 'Step não encontrado.' });
    }
};

module.exports = {
    getAllStepTests,
    getTestStepById,
    getTestStepByTestId,
    getTestStepByName,
    createTestStep,
    updateTestStep,
    deleteTestStep
};