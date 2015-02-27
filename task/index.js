var Store = require('./Store');

module.exports = function(sys) {
  sys.useStore(new Store());
  sys.handleHttp('POST', '/', require('./postTask'));
  sys.handleEvents('app', require('./eventHandler'));
};
