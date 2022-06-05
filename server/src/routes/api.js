const express = require('express');

// Routes
const planetsRouter = require('./planets/planets.router'); // Planets
const launchesRouter = require('./launches/launches.router'); // Launches

const api = express.Router();

// Routes
api.use('/planets', planetsRouter);
api.use('/launches', launchesRouter);

module.exports = api;