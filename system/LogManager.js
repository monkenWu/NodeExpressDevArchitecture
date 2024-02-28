const winston = require('winston');
const path = require('path');
const fs = require('fs');
const { log } = require('console');

class LogManager {
    static INFO = 'info';
    static ERROR = 'error';
    static WARN = 'warn';
    static DEBUG = 'debug';

    static loggers = {};

    static getLogger(logName, level = 'info') {
        if (!LogManager.loggers[logName]) {
            const logDirectory = path.join(__dirname, '../writable', 'log');
            fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory, { recursive: true });
            const logFilename = path.join(logDirectory, `${logName}.log`);
            const logger = winston.createLogger({
                level: level,
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.printf(info => `${info.timestamp} - ${info.level.toUpperCase()} - ${info.message}`)
                ),
                transports: [
                    new winston.transports.File({
                        filename: logFilename,
                        datePattern: 'YYYY-MM-DD',
                        maxSize: '20m',
                        maxFiles: '14d'
                    })
                ]
            });

            LogManager.loggers[logName] = logger;
        }

        return LogManager.loggers[logName];
    }

    static writeErrorLog(msg) {
        const errorLogger = LogManager.getLogger('app_error', LogManager.ERROR);
        errorLogger.error(msg);
    }
}

module.exports = LogManager;
