const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/personas', require('./routes/personas.routes'));
app.use('/api/imagenes', require('./routes/imagenes.routes')); // si ya lo tienes

module.exports = app;
