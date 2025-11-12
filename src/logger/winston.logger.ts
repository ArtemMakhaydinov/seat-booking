import winston, { format, transports } from 'winston';

const colorizer = format.colorize({
  all: true,
  colors: {
    info: 'bold blue',
    warn: 'italic yellow',
    error: 'bold red',
    debug: 'green',
  },
});

const getDefaultFormat = format.combine(
  format.timestamp({
    format: 'YY-MM-DD HH:mm:ss.SSS',
  }),
  format.printf((info) => {
    const { level, timestamp, message, ...rest } = info;
    return ` ${timestamp}  [${level}]:${message}  ${JSON.stringify(rest)}`;
  }),
);

export const winstonConfig: winston.LoggerOptions = {
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(colorizer, getDefaultFormat),
    }),
    new transports.File({
      filename: `./src/logs/info.log`,
      maxsize: 1e7,
      level: 'info',
      format: format.combine(getDefaultFormat),
    }),
  ],
};
