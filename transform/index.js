module.exports = function(sys) {
  sys.handleEvents('app', require('./eventHandler'));
};
