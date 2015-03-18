require('node-jsx').install({extension: '.jsx'});

module.exports = function(sys) {
  sys.useStore(require('./Store'));
  sys.handleHttp('GET', '/', require('./home.jsx'));
  sys.useMiddleware(require('./uploadMiddleware'));
  sys.handleHttp('POST', '/', require('./postFile'));
  sys.handleHttp('GET', '/:fileId/meta', require('./getFileMeta'));
  sys.handleHttp('GET', '/:fileId', require('./getFile'));
};
