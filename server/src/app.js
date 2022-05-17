const express = require('express');

const app = express();
app.use(express.json());

// Routes
// Planets
const planetsRouter = require('./routes/planets/planets.router');
const planetsController = require('./routes/planets/planets.controller');
app.use(planetsRouter);

module.exports = app;