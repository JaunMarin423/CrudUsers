import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
// dotenv.config({ path: path.join(__dirname, '../../.env') });

// Carga las variables de entorno
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Environment variables with default values
const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';
const isTest = env === 'test';

// Server configuration
const server = {
  port: parseInt(process.env.PORT || '3000', 10),
  env,
  isProduction,
  isTest,
  api: {
    prefix: process.env.API_PREFIX || '/api/v1',
  },
};

// Database configuration
const db = {
  uri: isTest ? process.env.MONGODB_URI_TEST : process.env.MONGODB_URI || 'mongodb://localhost:27017/crud_users',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    // Remove this in production
    ...(!isProduction && {
      autoIndex: true,
    }),
  },
};

// JWT configuration
const jwt = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  // Ensure expire is a string that can be parsed by jsonwebtoken
  expire: process.env.JWT_EXPIRE ? String(process.env.JWT_EXPIRE) : '30d',
  cookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE || '30', 10),
};

// Rate limiting configuration
const rateLimit = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '15', 10) * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // limit each IP to 100 requests per windowMs
};

// CORS configuration
const cors = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: process.env.CORS_CREDENTIALS === 'true',
};

// Logging configuration
const logging = {
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.LOG_FORMAT || 'combined',
};

// Export configuration
export default {
  server,
  db,
  jwt,
  rateLimit,
  cors,
  logging,
};

// Export types
export type Config = {
  server: typeof server;
  db: typeof db;
  jwt: typeof jwt;
  rateLimit: typeof rateLimit;
  cors: typeof cors;
  logging: typeof logging;
};
