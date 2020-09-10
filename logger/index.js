var { createLogger, format, transports } = require('winston');
var winston = require('winston');
require('winston-daily-rotate-file');
var { combine, timestamp, printf } = format;

var myFormat = printf(({ level, message, from, timestamp }) => {
    return `${timestamp} [${from}] ${level}: ${message}`;
});

if (process.env.NODE_ENV === 'production') {
    var transport = new (winston.transports.DailyRotateFile)({
        dirname: './logs/app-winston',
        filename: 'app-errors-%DATE%.log',
        maxFiles: '9d'
    });

    var logger = createLogger({
        format: combine(
            timestamp(),
            myFormat
        ),
        transports: [
            transport
        ]
    });
} else {
    var logger = createLogger({
        format: combine(
            timestamp(),
            myFormat
        ),
        transports: [
            new transports.Console()
        ]
    });
}

module.exports = logger;