// Core Node.js modules
import path from 'path';

// Third-party modules
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express, { Request, Response, NextFunction, json, urlencoded } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import xss from 'xss-clean';

// Local modules
import { connectDB } from './config/database.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import logger from './utils/logger.js';
import { validate } from './middlewares/validateRequest.js';

// Get current directory
const __dirname = path.resolve();

// Load environment variables
const envPath = process.env.NODE_ENV === 'test' ? '../.env.test' : '../.env';
config({ path: path.join(__dirname, envPath) });

// Verify required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0 && process.env.NODE_ENV !== 'test') {
  console.error('Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

// Create Express app
const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(json({ limit: '10kb' }));
app.use(urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Compression middleware
app.use(compression());

// Import health routes
import healthRoutes from './routes/health.routes.js';

// Health check route
app.use('/api', healthRoutes);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Handle 404 - Must be after all other routes
app.use(notFound);

// Error handling middleware - Must be after all other middleware and routes
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err as any, req, res, next);
});

// Start server
const PORT = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    // Start the server
    const server = app.listen(PORT, () => {
      // Log server start information
      logger.info('Server started', {
        port: PORT,
        env: process.env.NODE_ENV || 'development',
        url: `http://localhost:${PORT}${process.env.API_PREFIX || '/api/v1'}`,
      });
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err: Error) => {
      logger.error('UNHANDLED REJECTION! 💥 Shutting down...', {
        error: {
          name: err.name,
          message: err.message,
          stack: err.stack,
        },
      });

      // Close server gracefully
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err: Error) => {
      logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', {
        error: {
          name: err.name,
          message: err.message,
          stack: err.stack,
        },
      });

      // Close server gracefully
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle termination signals
    process.on('SIGTERM', () => {
      logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
      server.close(() => {
        logger.info('💤 Process terminated');
        process.exit(0);
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Failed to start server: ${error.message}`, {
        name: error.name,
        stack: error.stack,
      });
    } else {
      logger.error('Unknown error occurred during server startup');
    }
    process.exit(1);
  }
}

// Start the application
startServer().catch((error) => {
  logger.error('Failed to start server:', {
    name: error instanceof Error ? error.name : 'Unknown',
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined
  });
  process.exit(1);
});
