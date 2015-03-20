var Blob = require('./Blob');

module.exports = function(options) {
  var blob = new Blob(options);
  options = {blob: blob};

  return function(sys) {
    sys.handleEvents('app', require('./eventHandler')(options));
    sys.handleHttp('GET', '/blob/:blobId', require('./getBlob')(options));
  };
};
