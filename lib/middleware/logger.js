'use strict';

const koaLogger = require('koa-logger');
const { createLogger, format, transports } = require('winston');

/**
 * Creates and assigns a Winston logger instance to an app and returns
 */
module.exports = function (app, silent, logfile) {
  if (logfile === true) {
    var loggerfile = new transports.File({
          level: 'debug',
        json: false,
        format: format.combine(
		format.splat(),
                format.simple(),
        ),
            // Create the log directory if it does not exist
          filename: 'tmp/logs/console_logs.txt',
	  });
  } else {
    var loggerfile = new transports.Console({
    });
  };
  const logger = createLogger({
    transports: [
      new transports.Console({
        level: 'debug',
        json: false,
        format: format.combine(
          format.colorize(),
          format.splat(),
          format.simple(),
        ),
        silent,
      }),
      loggerfile,
    ],
    exitOnError: false,
  });
  logger.emitErrs = true;
  app.logger = app.context.logger = logger;

  return koaLogger((message, args) => {
    if (args.length === 6) {
      // only log responses
      logger.info(message.slice(6));
    }
  });
};
