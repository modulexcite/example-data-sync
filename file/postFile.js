var lang = require('../lang');
var denormalizer = require('./denormalizer');
var debug = require('debug')('app:file:postFile');

function eventsOut() {
  return [
    lang.FileUploaded
  ];
}

function postFile(pub, store) {
  var denormalize = denormalizer.handler(store);

  return function(req, res, next) {
    var file = req.files['file'];
    if (!file) {
      next();
      return;
    }
    debug('POST /file ' + JSON.stringify(file));
    var fileId = file.name.replace('.' + file.extension, '');
    var fileMeta = new lang.FileMeta({
      name: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      extension: file.extension,
      size: file.size
    });

    var fileUploaded = new lang.FileUploaded({
      eventId: lang.newEventId(),
      fileId: fileId,
      fileMeta: fileMeta
    });

    denormalize(fileUploaded, function(err) {
      if (err) {
        res.status(500).end();
        return;
      }

      pub('app', fileUploaded);

      var redirect = req.query.redirect;
      if (redirect) {
        // Assumes redirect already has a query string
        redirect = redirect + '&fileId=' + fileId;
        res.redirect(303, redirect);
      } else {
        res.send('Upload complete. fileId = ' + fileId);
      }
    });
  };
}

module.exports = {
  handler: postFile,
  eventsOut: eventsOut
};
