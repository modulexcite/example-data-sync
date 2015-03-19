module.exports = function(sys) {
  sys.useStore(require('./Store'));
  sys.handleHttp('POST', '/', require('./postTask'));
  sys.handleHttp('GET', '/:taskId', require('./getTask'));
  sys.handleHttp('POST', '/:taskId/file', require('./postTaskFile'));
  sys.handleHttp('POST', '/:taskId/start', require('./postTaskStart'));
  sys.denormalize('app', require('./denormalizer'), {subscribe: false});
};
