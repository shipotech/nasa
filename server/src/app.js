const express = require('express');
const path = require("path");
const cors = require('cors');
const morgan = require("morgan");

const app = express();

// Routes
// Planets
const planetsRouter = require('./routes/planets/planets.router');

// Launches
const launchesRouter = require('./routes/launches/launches.router');

// Middlewares
// CORS has an object with a list of whitelisted origins
app.use(cors({
    origin: 'http://localhost:3000'
}));

// Logging
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public'))); // serve static files built from Client

// Routes
app.use(planetsRouter);
app.use(launchesRouter);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;