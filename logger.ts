//  Step 1: Import the winston library, which is a popular logging library for Node.js applications. It provides a flexible and configurable way to log messages in various formats and transports (like files, console, etc.).
import winston from 'winston';

const logger = winston.createLogger({ // What is this? Logger configuration using the winston library. It sets the logging level, format, and transports (where logs are stored).
  format: winston.format.combine( 
    winston.format.timestamp(),
    winston.format.json()
  ),
  level: 'info', // The minimum level of messages that will be logged. In this case, it will log 'info' and above (like 'error').
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // This transport logs error messages to a file named 'error.log' in the 'logs' directory.
    new winston.transports.File({ filename: 'logs/combined.log' }), // This transport logs all messages (including 'info' and above) to a file named 'combined.log' in the 'logs' directory.
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

export default logger;
