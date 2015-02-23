require('node-jsx').install({extension: '.jsx'});

module.exports = function(sys) {
  sys.handleHttp('GET', '/', require('./home.jsx'));
};
