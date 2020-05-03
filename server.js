require('dotenv').config();
require('./db');

import express from 'express';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use('/', (req, res) => {
  res.send('qwe');
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));