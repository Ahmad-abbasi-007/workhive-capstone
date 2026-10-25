const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');

async function startServer() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is required');
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected');

  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}

startServer().catch((error) => {
  console.error('Server startup failed:', error);
  process.exit(1);
});