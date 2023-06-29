const express = require('express');
const router = express.Router();

const { getAllSuites, getSuiteById, createSuite, updateSuite, deleteSuite } = require('./controllers');

/**
 * @swagger
 * tags:
 *   name: Suites API
 *   description: API endpoints para gerenciamento de suites
 */

/**
 * @swagger
 * /suites:
 *   get:
 *     tags: 
 *       - Suites API
 *     summary: Obtém todas as suites.
 *     responses:
 *       200:
 *         description: Array contendo todas as suites.
 *       500:
 *         description: Erro ao obter as suites.
 */
router.get('/', getAllSuites);

/**
 * @swagger
 * /suites/{id}:
 *   get:
*     tags: 
 *       - Suites API
 *     summary: Obtém uma suite por ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da suite.
 *     responses:
 *       200:
 *         description: Objeto contendo a suite encontrada.
 *       404:
 *         description: Suite não encontrada.
 *       500:
 *         description: Erro ao obter a suite.
 */
router.get('/:id', getSuiteById);

/**
 * @swagger
 * /suites:
 *   post:
 *     tags: 
 *       - Suites API
 *     summary: Cria uma nova suite.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeSuite:
 *                 type: string
 *               statusUltimaExec:
 *                 type: string
 *               statusAtual:
 *                 type: string
 *     responses:
 *       201:
 *         description: Objeto contendo a suite criada.
 *       400:
 *         description: Dados inválidos fornecidos.
 *       500:
 *         description: Erro ao criar a suite.
 */
router.post('/', createSuite);

/**
 * @swagger
 * /suites/{id}:
 *   put:
 *     tags: 
 *       - Suites API
 *     summary: Atualiza uma suite existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da suite.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeSuite:
 *                 type: string
 *               statusUltimaExec:
 *                 type: string
 *               statusAtual:
 *                 type: string
 *     responses:
 *       200:
 *         description: Objeto contendo a suite atualizada.
 *       400:
 *         description: Dados inválidos fornecidos.
 *       404:
 *         description: Suite não encontrada.
 *       500:
 *         description: Erro ao atualizar a suite.
 */
router.put('/:id', updateSuite);

/**
 * @swagger
 * /suites/{id}:
 *   delete:
 *     tags: 
 *       - Suites API
 *     summary: Exclui uma suite existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da suite.
 *     responses:
 *       200:
 *         description: Objeto contendo a suite excluída.
 *       404:
 *         description: Suite não encontrada.
 *       500:
 *         description: Erro ao excluir a suite.
 */
router.delete('/:id', deleteSuite);

module.exports = router;