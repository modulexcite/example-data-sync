var Store = require('./Store');

module.exports = function(sys) {
  sys.useStore(new Store());
  sys.handleHttp('POST', '/', require('./postTask'));
  sys.handleHttp('GET', '/:taskId', require('./getTask'));
  sys.handleHttp('POST', '/:taskId/file', require('./postTaskFile'));
  sys.handleHttp('POST', '/:taskId/start', require('./postTaskStart'));
};
