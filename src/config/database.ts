import mongoose from 'mongoose';
import { config } from 'dotenv';
import logger from '../utils/logger.js';

// Cargar variables de entorno
config();

/**
 * Establece la conexión a la base de datos MongoDB
 */
export const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    const mongoUri = process.env.MONGODB_URI;
    console.log(
      'MongoDB URI:',
      mongoUri ? mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : 'Not found'
    );

    logger.info('Attempting to connect to MongoDB...', {
      uri: mongoUri ? mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : 'Not found',
    });

    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose
      .connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000, // 5 seconds timeout
        socketTimeoutMS: 45000, // 45 seconds timeout
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err);
        throw err;
      });

    logger.info(`MongoDB Connected: ${conn.connection.host}`, {
      dbName: conn.connection.name,
      dbStatus: conn.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to connect to MongoDB:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: (error as { code?: string }).code,
        reason: (error as { reason?: string }).reason,
        error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      });
    } else {
      logger.error('Unknown error connecting to MongoDB:', { error });
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
