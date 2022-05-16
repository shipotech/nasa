const express = require('express');
const router = express.Router();

// Define routes.
router.get('/planets', getAllPlanets);

module.exports = router;