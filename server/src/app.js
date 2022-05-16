const express = require('express');

const app = express();
app.use(express.json());

// Routes
const planetsRouter = require('./routes/planets/planets.router');
app.use(planetsRouter);

module.exports = app;