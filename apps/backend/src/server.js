require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cartasRouter = require('./routes/cartas');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/cartas', cartasRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'erro interno do servidor' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`backend rodando na porta ${port}`);
});
