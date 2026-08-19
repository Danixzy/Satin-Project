const express = require('express');
const pool = require('../db');

const router = express.Router();

function asyncHandler(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

function validarCampos(body) {
  const { nome, numero, colecao } = body;
  if (!nome || !nome.trim() || !numero || !numero.trim() || !colecao || !colecao.trim()) {
    return 'nome, numero e colecao sao obrigatorios';
  }
  return null;
}

router.get('/', asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, nome, numero, colecao, imagem_url, created_at FROM cartas ORDER BY created_at DESC'
  );
  res.json(rows);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, nome, numero, colecao, imagem_url, created_at FROM cartas WHERE id = $1',
    [req.params.id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ error: 'carta nao encontrada' });
  }
  res.json(rows[0]);
}));

router.post('/', asyncHandler(async (req, res) => {
  const erro = validarCampos(req.body);
  if (erro) {
    return res.status(400).json({ error: erro });
  }
  const { nome, numero, colecao, imagem_url } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO cartas (nome, numero, colecao, imagem_url) VALUES ($1, $2, $3, $4) RETURNING id, nome, numero, colecao, imagem_url, created_at',
    [nome, numero, colecao, imagem_url || null]
  );
  res.status(201).json(rows[0]);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const erro = validarCampos(req.body);
  if (erro) {
    return res.status(400).json({ error: erro });
  }
  const { nome, numero, colecao, imagem_url } = req.body;
  const { rows } = await pool.query(
    'UPDATE cartas SET nome = $1, numero = $2, colecao = $3, imagem_url = $4 WHERE id = $5 RETURNING id, nome, numero, colecao, imagem_url, created_at',
    [nome, numero, colecao, imagem_url || null, req.params.id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ error: 'carta nao encontrada' });
  }
  res.json(rows[0]);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const { rowCount } = await pool.query('DELETE FROM cartas WHERE id = $1', [req.params.id]);
  if (rowCount === 0) {
    return res.status(404).json({ error: 'carta nao encontrada' });
  }
  res.status(204).send();
}));

module.exports = router;
