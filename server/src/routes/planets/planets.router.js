const express = require('express');
const planetsRouter = express.Router();

const {
    httpGetAllPlanets
} = require('./planets.controller');


// Define routes.
planetsRouter.get('/planets', httpGetAllPlanets);

module.exports = planetsRouter;