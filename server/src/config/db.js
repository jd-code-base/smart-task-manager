import mongoose from 'mongoose';
import CONFIG from './config.js';

let retries = 0;
const MAX_RETRIES = CONFIG.MONGO_MAX_RETRIES || 5;
const RETRY_DELAY_MS = CONFIG.MONGO_RETRY_DELAY_MS || 5000;

const connectDB = async () => {
  if (!CONFIG.MONGO_URI) {
    console.error('Missing MONGO_URI. Exiting...');
    process.exit(1);
  }

  try {
    const connectionInstance = await mongoose.connect(CONFIG.MONGO_URI);

    console.log(
      `MongoDB connected: "${connectionInstance.connection.name}" @ ${connectionInstance.connection.host}`
    );
  } catch (error) {
    retries++;

    console.error(`MongoDB connection error: ${error.message}`);

    if (CONFIG.NODE_ENV === 'development') {
      console.error(error);
    }

    if (retries < MAX_RETRIES) {
      console.log(`Retrying MongoDB connection (${retries}/${MAX_RETRIES})...`);
      setTimeout(connectDB, RETRY_DELAY_MS);
    } else {
      console.error('Max retries reached. Exiting application.');
      process.exit(1);
    }
  }
};

/**
 * Handle graceful shutdown of MongoDB connection.
 * @param {string} signal - The shutdown signal received.
 */
const gracefulShutdown = async (signal) => {
  try {
    console.log(`Received ${signal}, closing MongoDB connection...`);
    await mongoose.connection.close();
    console.log('MongoDB disconnected successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error during MongoDB shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

export default connectDB;
