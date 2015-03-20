var debug = require('debug')('app:file:getBlob');

function getBlob(options) {
  var blob = options.blob;

  return function(pub, store) {
    return function(req, res) {
      var blobId = req.params.blobId;
      debug('GET /transform/blob/:blobId ' + blobId);

      blob.read(blobId, function(err, data) {
        if (err) {
          if (err.code === 'ENOENT') {
            res.status(404).send({
              error: {
                name: 'BlobDoesNotExist',
                message: 'No blob found for given blob id'
              }
            });
            return;
          } else {
            res.status(500).end();
            return;
          }
        }

        res.send(data);
      });
    };
  };
}

module.exports = function(options) {
  return {
    handler: getBlob(options)
  };
};
