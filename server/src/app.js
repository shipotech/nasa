const express = require('express');
const path = require("path");
const cors = require('cors');
const morgan = require("morgan");

const api = require('./routes/api');
const app = express();


// Middlewares
// CORS has an object with a list of whitelisted origins
app.use(cors({
    origin: 'http://localhost:3000'
}));

// Logging
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public'))); // serve static files built from Client

// Mount all routes with "v1" prefix
app.use('/v1', api);

// Add "/*" to catch all routes not defined above
app.get('/*', (req, res) => {
    // Handle all routes that don't match above in our Client code
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;