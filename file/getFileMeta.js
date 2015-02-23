var debug = require('debug')('app:file:getFileMeta');

function getFileMeta(pub, store) {
  return function(req, res) {
    var fileId = req.params.fileId;
    debug('GET /file/:fileId/meta ' + fileId);

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

      res.send(fileMeta.toJS());
    });
  };
}

module.exports = {
  handler: getFileMeta
};
