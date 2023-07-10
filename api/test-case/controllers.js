const { PaginationUtils } = require('../utils/paginationUtils');
const models = require('./models');

// Controlador para obter todos os casos de teste
const getAllTestCases = async (req, res) => {
  try {
    const pageSize = 50;
    const currentPage = req.query.page ? parseInt(req.query.page) : 1;
    const testCases = await models.getAllTestCases();
    const paginationUtils = new PaginationUtils();
    const response = await paginationUtils.pagination(currentPage, pageSize, testCases);
    res.json(response);
  } catch (error) {
    console.error('Erro ao buscar os casos de teste:', error);
    res.status(500).json({ error: 'Erro ao buscar os casos de teste.' });
  }
};

// Controlador para obter um caso de teste pelo ID
const getTestCaseById = async (req, res) => {
  const { id } = req.params;
  const { error: validationId } = models.schemaId.validate({ id });
  if (validationId) {
    return res.status(400).json({ error: validationId.details[0].message });
  }

  try {
    const testCase = await models.getTestCaseById(id);
    res.json(testCase);
  } catch (error) {
    console.error('Caso de teste não encontrado:', error);
    res.status(404).json({ error: 'Caso de teste não encontrado.' });
  }
};

// Controlador para criar um novo caso de teste
const createTestCase = async (req, res) => {
  const { error } = models.testCaseSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const testCase = await models.createTestCase(req.body);
    res.status(201).json(testCase);
  } catch (error) {
    console.error('Erro ao criar o caso de teste:', error);
    res.status(500).json({ error: 'Erro ao criar o caso de teste.' });
  }
};

// Controlador para atualizar um caso de teste
const updateTestCase = async (req, res) => {
  const { id } = req.params;
  const { error: validationId } = models.schemaId.validate({ id });
  if (validationId) {
    return res.status(400).json({ error: validationId.details[0].message });
  }

  const { error } = models.testCaseSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const testCase = await models.updateTestCase(id, req.body);
    res.json(testCase);
  } catch (error) {
    console.error('Caso de teste não encontrado:', error);
    res.status(404).json({ error: 'Caso de teste não encontrado.' });
  }
};

// Controlador para excluir um caso de teste
const deleteTestCase = async (req, res) => {
  const { id } = req.params;
  const { error: validationId } = models.schemaId.validate({ id });
  if (validationId) {
    return res.status(400).json({ error: validationId.details[0].message });
  }

  try {
    await models.deleteTestCase(id);
    res.json({ message: 'Caso de teste excluído com sucesso.' });
  } catch (error) {
    console.error('Caso de teste não encontrado:', error);
    res.status(404).json({ error: 'Caso de teste não encontrado.' });
  }
};

module.exports = {
  getAllTestCases,
  getTestCaseById,
  createTestCase,
  updateTestCase,
  deleteTestCase
};