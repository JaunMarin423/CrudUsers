// Core Node.js modules
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Third-party modules
import { format, transports, addColors, createLogger } from 'winston';
const { combine, timestamp, printf, colorize, align, json } = format;

// Definir niveles de log personalizados
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Definir colores para los niveles de log
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Add colors to winston
addColors(colors);

// Formato para la consola
const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  align(),
  printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
);

// Formato para archivos
const fileFormat = combine(
  timestamp(),
  json(),
  printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta,
    });
  })
);

// Create logger instance
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'crud-users-api' },
  transports: [
    // Write logs to console
    new transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error',
    }),
    // Write combined logs to file
    new transports.File({
      filename: path.join(__dirname, '../../logs/combined.log'),
    }),
  ],
});

// In production, also write logs to files
if (process.env.NODE_ENV !== 'production') {
  // Write logs to console
  logger.add(
    new transports.Console({
      format: consoleFormat,
    })
  );

  // Handle uncaught exceptions
  logger.exceptions.handle(
    new transports.Console({
      format: consoleFormat,
    }),
    new transports.File({
      filename: path.join(__dirname, '../../logs/exceptions.log'),
      format: fileFormat,
    })
  );
}

export default logger;
