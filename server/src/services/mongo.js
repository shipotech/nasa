require('dotenv').config()

const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL;

// Event emitter for MongoDB connection (once to trigger only once)
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Event emitter for MongoDB connection (show errors)
mongoose.connection.on('error', err => {
  console.log('MongoDB connection error:', err);
});

async function mongoConnect() {
  // Connect to MongoDB (v6+ will use the best possible options by default)
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect
}