const winston = require('winston');
const path = require('path');

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp, requestId, ...meta }) => {
  const reqId = requestId ? ` [${requestId}]` : '';
  const metaStr = Object.keys(meta).length && meta.stack === undefined
    ? ` ${JSON.stringify(meta)}`
    : '';
  return `${timestamp} ${level}${reqId}: ${message}${metaStr}`;
});

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
  ),
  defaultMeta: { service: 'salonshop-api' },
  transports: [],
  exitOnError: false,
});

// Console transport (always enabled)
logger.add(new winston.transports.Console({
  format: combine(
    colorize(),
    consoleFormat
  ),
}));

// File transports (production & staging)
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  const logDir = process.env.LOG_DIR || path.join(__dirname, '..', 'logs');

  // Combined log
  logger.add(new winston.transports.File({
    filename: path.join(logDir, 'combined.log'),
    maxsize: 10 * 1024 * 1024,  // 10 MB
    maxFiles: 14,
    format: combine(json()),
  }));

  // Error log
  logger.add(new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
    maxsize: 10 * 1024 * 1024,
    maxFiles: 30,
    format: combine(json()),
  }));
}

// Morgan stream for HTTP request logging
logger.stream = {
  write: (message) => logger.http(message.trim()),
};

module.exports = logger;
