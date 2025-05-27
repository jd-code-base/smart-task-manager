import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';
import CONFIG from './config/config.js';

const PORT = CONFIG.PORT || 5000;

/**
 * Start the server and connect to the database
 */
const startServer = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connection successful');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error.message);
    process.exit(1);
  }
};

// Handle uncaught exceptions (e.g., synchronous errors)
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  console.error(error.stack);
  process.exit(1);
});

// Handle unhandled promise rejections (e.g., async errors)
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

startServer();
