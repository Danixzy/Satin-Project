const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('select * from cartas order by created_at desc');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar cartas' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nome, numero, colecao, imagem_url } = req.body;
    const result = await pool.query(
      'insert into cartas (nome, numero, colecao, imagem_url) values ($1, $2, $3, $4) returning *',
      [nome, numero, colecao, imagem_url || null],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar carta' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('select * from cartas where id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Carta não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar carta' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nome, numero, colecao, imagem_url } = req.body;
    const result = await pool.query(
      'update cartas set nome = $1, numero = $2, colecao = $3, imagem_url = $4 where id = $5 returning *',
      [nome, numero, colecao, imagem_url || null, req.params.id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Carta não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar carta' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('delete from cartas where id = $1 returning id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Carta não encontrada' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir carta' });
  }
});

module.exports = router;
