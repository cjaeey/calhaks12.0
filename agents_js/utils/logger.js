import pino from 'pino';
import config from '../config/env.js';

const logger = pino({
  level: config.LOG_LEVEL,
  transport: config.isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});

export default logger;
