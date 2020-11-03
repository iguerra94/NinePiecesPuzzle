const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

app.use(express.static('static'));

// viewed at http://localhost:3000
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname + '/static/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
});