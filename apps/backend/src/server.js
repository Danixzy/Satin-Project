require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cartasRouter = require('./routes/cartas');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/cartas', cartasRouter);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
