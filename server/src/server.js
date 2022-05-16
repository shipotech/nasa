const http = require('http');

const app = require('./app');

const PORT = process.env.PORT || 8000; // if PORT is not defined, use 8000

const server = http.createServer(app);



// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
