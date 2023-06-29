// routes/test_caseRoutes.js
const express = require('express');
const router = express.Router();

const { getAllTestCases, getTestCaseById, createTestCase, updateTestCase, deleteTestCase } = require('./controllers');

/**
 * @swagger
 * tags:
 *   name: Test Case API
 *   description: API endpoints para gerenciamento de casos de teste
 */

/**
 * @swagger
 * /test-cases:
 *   get:
 *     tags: 
 *       - Test Case API
 *     summary: Obter todos os casos de teste
 *     description: Retorna uma lista de todos os casos de teste.
 *     responses:
 *       200:
 *         description: Sucesso
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id_teste:
 *                 type: integer
 *               nome_teste:
 *                 type: string
 *               ultima_exec:
 *                 type: string
 *                 format: date
 *               status_ultima_exec:
 *                 type: string
 *               id_suite:
 *                 type: integer
 *               status_atual:
 *                 type: string
 *               zip_evidencia:
 *                 type: string
 *               nome_executor:
 *                 type: string
 *
 *   post:
 *     tags: 
 *       - Test Case API
 *     summary: Criar um novo caso de teste
 *     description: Cria um novo caso de teste com os dados fornecidos.
 *     parameters:
 *       - in: body
 *         name: testCase
 *         description: Objeto do caso de teste a ser criado
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             nome_teste:
 *               type: string
 *             ultima_exec:
 *               type: string
 *               format: date
 *             status_ultima_exec:
 *               type: string
 *             id_suite:
 *               type: integer
 *             status_atual:
 *               type: string
 *             zip_evidencia:
 *               type: string
 *             nome_executor:
 *               type: string
 *     responses:
 *       201:
 *         description: Caso de teste criado com sucesso
 *         schema:
 *           type: object
 *           properties:
 *             id_teste:
 *               type: integer
 *             nome_teste:
 *               type: string
 *             ultima_exec:
 *               type: string
 *               format: date
 *             status_ultima_exec:
 *               type: string
 *             id_suite:
 *               type: integer
 *             status_atual:
 *               type: string
 *             zip_evidencia:
 *               type: string
 *             nome_executor:
 *               type: string
 */

/**
 * @swagger
 * /test-cases/{id}:
 *   get:
 *     tags: 
 *       - Test Case API
 *     summary: Obter um caso de teste pelo ID
 *     description: Retorna um caso de teste com base no ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID do caso de teste a ser obtido
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Sucesso
 *         schema:
 *           type: object
 *           properties:
 *             id_teste:
 *               type: integer
 *             nome_teste:
 *               type: string
 *             ultima_exec:
 *               type: string
 *               format: date
 *             status_ultima_exec:
 *               type: string
 *             id_suite:
 *               type: integer
 *             status_atual:
 *               type: string
 *             zip_evidencia:
 *               type: string
 *             nome_executor:
 *               type: string
 *
 *   put:
 *     summary: Atualizar um caso de teste
 *     tags: 
 *       - Test Case API
 *     description: Atualiza um caso de teste existente com os dados fornecidos.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID do caso de teste a ser atualizado
 *         required: true
 *         type: integer
 *       - in: body
 *         name: updatedTestCase
 *         description: Objeto do caso de teste atualizado
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             nome_teste:
 *               type: string
 *             ultima_exec:
 *               type: string
 *               format: date
 *             status_ultima_exec:
 *               type: string
 *             id_suite:
 *               type: integer
 *             status_atual:
 *               type: string
 *             zip_evidencia:
 *               type: string
 *             nome_executor:
 *               type: string
 *     responses:
 *       200:
 *         description: Caso de teste atualizado com sucesso
 *         schema:
 *           type: object
 *           properties:
 *             id_teste:
 *               type: integer
 *             nome_teste:
 *               type: string
 *             ultima_exec:
 *               type: string
 *               format: date
 *             status_ultima_exec:
 *               type: string
 *             id_suite:
 *               type: integer
 *             status_atual:
 *               type: string
 *             zip_evidencia:
 *               type: string
 *             nome_executor:
 *               type: string
 *
 *   delete:
 *     tags: 
 *       - Test Case API
 *     summary: Excluir um caso de teste
 *     description: Exclui um caso de teste existente com base no ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID do caso de teste a ser excluído
 *         required: true
 *         type: integer
 *     responses:
 *       204:
 *         description: Caso de teste excluído com sucesso
 */

router.get('/', getAllTestCases);
router.get('/:id', getTestCaseById);
router.post('/', createTestCase);
router.put('/:id', updateTestCase);
router.delete('/:id', deleteTestCase);

module.exports = router;
