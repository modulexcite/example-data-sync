var lang = require('../lang');
var debug = require('debug')('app:file:postFile');

function events() {
  return [
    lang.FileUploaded
  ];
}

function postFile(pub, store) {
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

    store.addFileMeta(fileId, fileMeta, function(err) {
      if (err) {
        res.status(500).end();
        return;
      }
      pub('app', new lang.FileUploaded({
        eventId: lang.newEventId(),
        fileId: fileId,
        fileMeta: fileMeta
      }));

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
  events: events,
  handler: postFile
};
