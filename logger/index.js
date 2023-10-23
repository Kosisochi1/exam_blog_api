const winston = require('winston');

logger = winston.createLogger({
	format: winston.format.json(),
	transports: [new winston.transports.Console()],
});
module.exports = logger;

// const winston = require('winston');

// logger = winston.createLogger({
// 	format: winston.format.json(),
// 	transports: [new winston.transports.Console()],
// });

// module.exports = logger;
