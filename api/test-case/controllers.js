const models = require('./models');

// Obter todos os casos de teste
async function getAllTestCases(req, res) {
  try {
    const testCases = await models.getAllTestCases();
    res.json(testCases);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os casos de teste.' });
  }
}

// Obter um caso de teste pelo ID
async function getTestCaseById(req, res) {
  const { id } = req.params;
  try {
    const testCase = await models.getTestCaseById(id);
    res.json(testCase);
  } catch (error) {
    res.status(404).json({ error: 'Caso de teste não encontrado.' });
  }
}

// Criar um novo caso de teste
async function createTestCase(req, res) {
  try {
    const testCase = await models.createTestCase(req.body);
    res.status(201).json(testCase);
  } catch (error) {
    console.error('Erro ao criar o caso de teste.', error);
    res.status(500).json({ error: 'Erro ao criar o caso de teste.' });
  }
}

// Atualizar um caso de teste
async function updateTestCase(req, res) {
  const { id } = req.params;

  try {
    const testCase = await models.updateTestCase(id, req.body);
    res.json(testCase);
  } catch (error) {
    res.status(404).json({ error: 'Caso de teste não encontrado.' });
  }
}

// Excluir um caso de teste
async function deleteTestCase(req, res) {
  const { id } = req.params;
  try {
    await models.deleteTestCase(id);
    res.json({ message: 'Caso de teste excluído com sucesso.' });
  } catch (error) {
    res.status(404).json({ error: 'Caso de teste não encontrado.' });
  }
}

module.exports = {
  getAllTestCases,
  getTestCaseById,
  createTestCase,
  updateTestCase,
  deleteTestCase
};
