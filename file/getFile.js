var path = require('path');
var debug = require('debug')('app:file:getFile');

function getFile(options) {
  var dirname = options.dirname;

  return function(pub, store) {
    return function(req, res) {
      var fileId = req.params.fileId;
      debug('GET /file/:fileId ' + fileId);

      store.getFileMeta(fileId, function(err, fileMeta) {
        if (err) {
          res.status(500).end();
          return;
        }
        if (!fileMeta) {
          res.status(404).send({
            error: {
              name: 'FileDoesNotExist',
              message: 'No file found for given file id'
            }
          });
          return;
        }

        var filename = fileId + '.' + fileMeta.get('extension');
        filename = path.join(dirname, filename);
        res.sendFile(filename, function(err) {
          if (err) {
            debug('ERROR sending file ' + err.toString());
            res.status(err.status).send({
              error: {
                name: 'ErrorSendingFile',
                message: 'An unexpected error occured sending file'
              }
            });
          }
        });
      });
    };
  };
}

module.exports = function(options) {
  return {
    handler: getFile(options)
  };
};
