module.exports = function(sys) {
  sys.useStore(require('./store').newStore());
  sys.handleHttp('POST', '/', require('./postTask'));
  sys.handleEvents('app', require('./eventHandler'));
};
