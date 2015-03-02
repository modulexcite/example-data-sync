var Store = require('./Store');

module.exports = function(sys) {
  sys.useStore(new Store());
  sys.handleEvents('app', require('./eventHandler'));
  sys.handleHttp('GET', '/', require('./getHistory'));
};
