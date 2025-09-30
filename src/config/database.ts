import mongoose from 'mongoose';
import { config } from 'dotenv';
import logger from '../utils/logger.js';

// Cargar variables de entorno
config();

/**
 * Establece la conexión a la base de datos MongoDB
 */
// Maximum number of retries for database connection
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000; // 5 seconds

export const connectDB = async (retryCount = 0): Promise<void> => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    const mongoUri = process.env.MONGODB_URI;
    const maskedUri = mongoUri ? mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : 'Not found';
    
    logger.info(`Attempting to connect to MongoDB (Attempt ${retryCount + 1}/${MAX_RETRIES})`, {
      uri: maskedUri,
      nodeEnv: process.env.NODE_ENV || 'development'
    });

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds timeout
      retryWrites: true,
      w: 'majority',
    });

    logger.info('MongoDB connected successfully', {
      host: conn.connection.host,
      dbName: conn.connection.name,
      dbStatus: conn.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
  } catch (error) {
    // If we have retries left, wait and try again
    if (retryCount < MAX_RETRIES - 1) {
      const nextRetry = retryCount + 1;
      const delay = RETRY_DELAY_MS * Math.pow(2, retryCount); // Exponential backoff
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.warn(`Retrying connection in ${delay}ms... (${nextRetry + 1}/${MAX_RETRIES})`, {
        error: errorMessage,
        nextRetryIn: `${delay}ms`
      });
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      return connectDB(nextRetry);
    }
    
    // Log the final error if all retries failed
    if (error instanceof Error) {
      logger.error('Failed to connect to MongoDB after all retries:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: (error as { code?: string }).code,
        reason: (error as { reason?: string }).reason,
      });
    } else {
      logger.error('Unknown error connecting to MongoDB:', { error: String(error) });
    }
    // Don't exit here, let the calling function handle the error
    throw error;
  }
};

// Manejar eventos de conexión
mongoose.connection.on('connected', () => {
  logger.info('Conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
  logger.error(`Error de conexión a MongoDB: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Desconectado de MongoDB');
});

// Cerrar la conexión cuando la aplicación termina
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('Conexión a MongoDB cerrada por terminación de la aplicación');
  process.exit(0);
});
