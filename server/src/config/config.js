import dotenv from 'dotenv';

dotenv.config();

const CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_REQUEST_BODY: process.env.LOG_REQUEST_BODY || false,
};

export default CONFIG;
