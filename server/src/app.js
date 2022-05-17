const express = require('express');
const cors = require('cors');

const app = express();

// Routes
// Planets
const planetsRouter = require('./routes/planets/planets.router');
const planetsController = require('./routes/planets/planets.controller');

// Middlewares
// CORS has an object with a list of whitelisted origins
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(planetsRouter);

module.exports = app;