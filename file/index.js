require('node-jsx').install({extension: '.jsx'});
var Store = require('./Store');

module.exports = function(sys) {
  sys.useStore(new Store());
  sys.handleHttp('GET', '/', require('./home.jsx'));
  sys.useMiddleware(require('./uploadMiddleware'));
  sys.handleHttp('POST', '/', require('./postFile'));
  sys.handleHttp('GET', '/:fileId/meta', require('./getFileMeta'));
  sys.handleHttp('GET', '/:fileId', require('./getFile'));
};
