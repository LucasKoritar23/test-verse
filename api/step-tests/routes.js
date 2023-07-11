const express = require('express');
const router = express.Router();

const { getAllStepTests, getTestStepById, getTestStepByTestId, getTestStepByName, createTestStep, updateTestStep, deleteTestStep } = require('./controllers');

/**
 * @swagger
 * tags:
 *   name: Steps API
 *   description: API endpoints para gerenciamento de steps
*/

/**
 * @swagger
 * /test-steps:
 *   get:
 *     tags: 
 *       - Steps API
 *     summary: Obtém todas as suites.
 *     responses:
 *       200:
 *         description: Array contendo todas as suites.
 *       500:
 *         description: Erro ao obter as suites.
*/
router.get('/', getAllStepTests);

/**
 * @swagger
 * /test-steps/id/{id}:
 *   get:
 *     tags: 
 *       - Steps API
 *     summary: Obtém um step por ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do step.
 *     responses:
 *       200:
 *         description: Objeto contendo o step encontrado.
 *       404:
 *         description: Step não encontrado.
 *       500:
 *         description: Erro ao obter o step.
*/
router.get('/id/:id', getTestStepById);

/**
 * @swagger
 * /test-steps/name/{name}:
 *   get:
 *     tags: 
 *       - Steps API
 *     summary: Obtém um step por nome.
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do step.
 *     responses:
 *       200:
 *         description: Objeto contendo o step encontrado.
 *       404:
 *         description: Step não encontrado.
 *       500:
 *         description: Erro ao obter o step.
 */
router.get('/name/:name', getTestStepByName);

/**
 * @swagger
 * /test-steps/test/{id}:
 *   get:
 *     tags: 
 *       - Steps API
 *     summary: Obtém um step pelo id do caso de teste.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Nome do step.
 *     responses:
 *       200:
 *         description: Objeto contendo o step encontrado.
 *       404:
 *         description: Step não encontrado.
 *       500:
 *         description: Erro ao obter o step.
 */
router.get('/test/:id', getTestStepByTestId);

/**
 * @swagger
 * /test-steps:
 *   post:
 *     tags: 
 *       - Steps API
 *     summary: Cria um novo step.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeStep:
 *                 type: string
 *               ultimaExec:
 *                 type: string
 *               statusUltimaExec:
 *                 type: string
 *                 enum: [running, success, failed, blocked, new]
 *               idSuite:
 *                 type: integer
 *               idTestCase:
 *                 type: integer
 *               statusAtual:
 *                 type: string
 *                 enum: [running, success, failed, blocked, new]
 *               nomeExecutor:
 *                 type: string
 *     responses:
 *       201:
 *         description: Objeto contendo o step criado.
 *       400:
 *         description: Dados inválidos fornecidos.
 *       500:
 *         description: Erro ao criar o step.
 */
router.post('/', createTestStep);

/**
 * @swagger
 * /test-steps/{id}:
 *   put:
 *     tags: 
 *       - Steps API
 *     summary: Edita um step.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeStep:
 *                 type: string
 *               ultimaExec:
 *                 type: string
 *               statusUltimaExec:
 *                 type: string
 *                 enum: [running, success, failed, blocked, new]
 *               idSuite:
 *                 type: integer
 *               idTestCase:
 *                 type: integer
 *               statusAtual:
 *                 type: string
 *                 enum: [running, success, failed, blocked, new]
 *               nomeExecutor:
 *                 type: string
 *     responses:
 *       201:
 *         description: Objeto contendo o step editado.
 *       400:
 *         description: Dados inválidos fornecidos.
 *       500:
 *         description: Erro ao editar o step.
 */
router.put('/:id', updateTestStep);

/**
 * @swagger
 * /test-steps/{id}:
 *   delete:
 *     tags: 
 *       - Steps API
 *     summary: Exclui um step existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do step.
 *     responses:
 *       200:
 *         description: Objeto contendo o step excluído.
 *       404:
 *         description: Step não encontrado.
 *       500:
 *         description: Erro ao excluir o step.
 */
router.delete('/:id', deleteTestStep);

module.exports = router;
