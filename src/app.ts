import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import path from 'path';

// Importar rutas
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

// Importar manejadores de errores
import { errorHandler, notFound } from './middlewares/errorHandler.js';

// Importar logger
import logger from './utils/logger.js';

// Cargar variables de entorno
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });

// Crear aplicación Express
const app: Application = express();

// 1) MIDDLEWARES GLOBALES

// Configuración de seguridad HTTP headers
app.use(helmet());

// Habilitar CORS
app.use(cors());

// Compresión de respuestas HTTP
app.use(compression());

// Logger de solicitudes HTTP
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Límite de solicitudes de la misma API
const limiter = rateLimit({
  max: 100, // 100 solicitudes
  windowMs: 60 * 60 * 1000, // por hora
  message: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo en una hora!',
  // @ts-ignore - Ignorar error de tipo para las opciones de rate-limit
  standardHeaders: true,
  // @ts-ignore - Ignorar error de tipo para las opciones de rate-limit
  legacyHeaders: false,
});
app.use('/api', limiter);

// Body parser, lectura de datos del body en req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitización contra NoSQL query injection
app.use(mongoSanitize());

// Data sanitización contra XSS
app.use(xss());

// Prevenir parámetros de contaminación
app.use(
  hpp({
    whitelist: ['sort', 'page', 'limit', 'fields'],
  })
);

// 2) RUTAS
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

// Rutas de autenticación
app.use(`${API_PREFIX}/auth`, authRoutes);

// Rutas de usuarios
app.use(`${API_PREFIX}/users`, userRoutes);

// Ruta de prueba
app.get(`${API_PREFIX}/health`, (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
  });
});

// Ruta no encontrada (404)
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const error = notFound(`No se pudo encontrar ${req.originalUrl} en este servidor!`, req, res, next);
  next(error);
});

// 3) MANEJADOR DE ERRORES GLOBAL
app.use(errorHandler);

// 4) INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`Servidor ejecutándose en el puerto ${PORT}...`);
  logger.info(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});

// 5) MANEJADOR DE ERRORES NO CAPTURADOS
process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION! Apagando...');
  logger.error(err.name, err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM RECIBIDO. Apagando correctamente');
  server.close(() => {
    logger.info('Proceso terminado');
  });
});

export default app;
