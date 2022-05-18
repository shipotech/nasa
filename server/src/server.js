const http = require('http');

const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000; // if PORT is not defined, use 8000

const server = http.createServer(app);

// Make sure to load the planets data before starting the server
async function startServer() {
  await loadPlanetsData();

  // Start the server
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
  });
}

startServer()