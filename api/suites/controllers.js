const models = require('./models');

// Controlador para obter todas as suites
const getAllSuites = async (req, res) => {
  try {
    const suites = await models.getAllSuites();
    res.json(suites);
  } catch (error) {
    console.error('Erro ao obter as suites:', error);
    res.status(500).json({ error: 'Erro ao obter as suites.' });
  }
};

// Controlador para obter uma suite por ID
const getSuiteById = async (req, res) => {
  const { id } = req.params;
  const { error: validationId } = models.schemaId.validate({ id });
  if (validationId) {
    return res.status(400).json({ error: validationId.details[0].message });
  }

  try {
    const suite = await models.getSuiteById(id);

    if (!suite) {
      res.status(404).json({ error: 'Suite não encontrada.' });
    } else {
      res.json(suite);
    }
  } catch (error) {
    console.error('Erro ao obter a suite:', error);
    res.status(500).json({ error: 'Erro ao obter a suite.' });
  }
};

// Controlador para criar uma nova suite
const createSuite = async (req, res) => {
  const { nomeSuite } = req.body;
  let { statusUltimaExec, statusAtual } = req.body;

  statusUltimaExec = statusUltimaExec ? statusUltimaExec : null;
  statusAtual = statusAtual ? statusAtual : 'new';

  const { error } = models.schema.validate({ nomeSuite, statusUltimaExec, statusAtual });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const already = await models.getAlreadyExistsSuites(nomeSuite);
    if (already > 0) {
      return res.status(400).json({ error: 'Já existe uma suite com o nome inserido.' });
    }
  } catch (error) {
    console.error('Erro ao criar a suite:', error);
    res.status(500).json({ error: 'Erro ao criar a suite.' });
  }

  try {
    const newSuite = await models.createSuite(nomeSuite, statusUltimaExec, statusAtual);
    res.status(201).json(newSuite);
  } catch (error) {
    console.error('Erro ao criar a suite:', error);
    res.status(500).json({ error: 'Erro ao criar a suite.' });
  }
};

// Controlador para atualizar uma suite existente
const updateSuite = async (req, res) => {
  const { id } = req.params;
  const { nomeSuite, statusUltimaExec, statusAtual } = req.body;

  const { error: validationId } = models.schemaId.validate({ id });
  if (validationId) {
    return res.status(400).json({ error: validationId.details[0].message });
  }

  const { error } = models.schema.validate({ nomeSuite, statusUltimaExec, statusAtual });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const already = await models.getAlreadyExistsSuites(nomeSuite);
    if (already > 0) {
      return res.status(400).json({ error: 'Já existe uma suite com o nome inserido.' });
    }
  } catch (error) {
    console.error('Erro ao editar a suite:', error);
    res.status(500).json({ error: 'Erro ao editar a suite.' });
  }

  try {
    const updatedSuite = await models.updateSuite(id, nomeSuite, statusUltimaExec, statusAtual);

    if (!updatedSuite) {
      res.status(404).json({ error: 'Suite não encontrada.' });
    } else {
      res.json(updatedSuite);
    }
  } catch (error) {
    console.error('Erro ao atualizar a suite:', error);
    res.status(500).json({ error: 'Erro ao atualizar a suite.' });
  }
};

// Controlador para excluir uma suite
const deleteSuite = async (req, res) => {
  const { id } = req.params;
  const { error: validationId } = models.schemaId.validate({ id });
  if (validationId) {
    return res.status(400).json({ error: validationId.details[0].message });
  }

  try {
    const deletedSuite = await models.deleteSuite(id);

    if (!deletedSuite) {
      res.status(404).json({ error: 'Suite não encontrada.' });
    } else {
      res.json({ message: 'Suite excluída com sucesso.' });
    }
  } catch (error) {
    console.error('Erro ao excluir a suite:', error);
    res.status(500).json({ error: 'Erro ao excluir a suite.' });
  }
};

module.exports = {
  getAllSuites,
  getSuiteById,
  createSuite,
  updateSuite,
  deleteSuite,
};
