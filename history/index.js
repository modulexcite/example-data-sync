module.exports = function(sys) {
  sys.useStore(require('./Store'));
  sys.handleEvents('app', require('./eventHandler'));
  sys.handleHttp('GET', '/', require('./getHistory'));
};
