var lang = require('../lang');
var debug = require('debug')('app:file:postFile');

function events() {
  return [
    lang.FileCreated
  ];
}

function postFile(pub, req, res) {
  var file = req.files['file'];
  debug('POST /file ' + JSON.stringify(file));
  var fileId = file.name.replace('.' + file.extension, '');
  var fileMeta = {
    name: file.originalname,
    encoding: file.encoding,
    mimetype: file.mimetype,
    extension: file.extension,
    size: file.size
  };

  pub('app', new lang.FileUploaded({
    eventId: lang.newEventId(),
    fileId: fileId,
    fileMeta: fileMeta
  }));

  var redirect = req.query.redirect;
  if (redirect) {
    redirect = redirect + '?fileId=' + fileId;
    res.redirect(303, redirect);
  } else {
    res.send('Upload complete');
  }
}

module.exports = {
  events: events,
  handler: postFile
};
