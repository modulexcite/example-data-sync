module.exports = function(sys) {
  sys.useStore(require('./Store'));
  sys.denormalize('app', require('./denormalizer'));
  sys.handleHttp('GET', '/', require('./getHistory'));
};
