import dotenv from 'dotenv';
dotenv.config();

const CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_REQUEST_BODY: process.env.LOG_REQUEST_BODY === 'true',

  MONGO_URI: process.env.MONGO_URI || undefined,
  MONGO_MAX_RETRIES: Number(process.env.MONGO_MAX_RETRIES) || 5,
  MONGO_RETRY_DELAY_MS: Number(process.env.MONGO_RETRY_DELAY_MS) || 5000,

  PORT: Number(process.env.PORT) || 5000,
};

export default CONFIG;
