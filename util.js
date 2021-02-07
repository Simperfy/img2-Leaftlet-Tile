module.exports = {
  loggerConfig: (shouldLog = false) => (...msg) => shouldLog && console.log(msg.join('')),
};
