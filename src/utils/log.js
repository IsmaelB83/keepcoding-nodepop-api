// Import node modules
const SimpleNodeLogger = require('simple-node-logger');
const Moment = require ('moment');

// Create the logger with the specified configuration
options = {
    logFilePath:`./log/error.${Moment().format("YYYYMMDD")}.log`,
    timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
},
log = SimpleNodeLogger.createSimpleLogger(options);
// This sets the log level to warn and suppresses debug and info messages.
log.setLevel('info');

// Export the logger
module.exports = log;