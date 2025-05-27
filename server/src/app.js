import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import CONFIG from './config/config.js';
import errorHandler from './middlewares/error.middleware.js';

const app = express();

// ========================
// Middleware Config
// ========================

// Parse incoming JSON with size limit
app.use(express.json({ limit: '16kb' }));

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Parse cookies
app.use(cookieParser());

// Add basic security headers
app.use(helmet());

// ========================
// CORS Config
// ========================

const isProduction = CONFIG.NODE_ENV === 'production';
const allowedOrigins = isProduction ? ['https://your-app.vercel.app'] : ['http://localhost:5173'];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      if (!isProduction) {
        console.warn(`Blocked CORS request from: ${origin}`);
      }
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// ========================
// Mount Routes Here
// ========================

// ========================
// Error Handling Middleware
// ========================
app.use(errorHandler);

export default app;
