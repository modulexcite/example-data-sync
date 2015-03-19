require('node-jsx').install({extension: '.jsx'});

module.exports = function(options) {
  return function(sys) {
    sys.useStore(require('./Store'));
    sys.handleHttp('GET', '/', require('./home.jsx'));
    sys.useMiddleware(require('./uploadMiddleware')(options));
    sys.handleHttp('POST', '/', require('./postFile'));
    sys.handleHttp('GET', '/:fileId/meta', require('./getFileMeta'));
    sys.handleHttp('GET', '/:fileId', require('./getFile')(options));
    sys.denormalize('app', require('./denormalizer'), {subscribe: false});
  };
};
