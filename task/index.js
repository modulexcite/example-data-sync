var Store = require('./Store');

module.exports = function(sys) {
  sys.useStore(new Store());
  sys.handleHttp('POST', '/', require('./postTask'));
  sys.handleHttp('GET', '/:taskId', require('./getTask'));
  sys.handleEvents('app', require('./eventHandler'));
};
