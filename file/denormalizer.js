var lang = require('../lang');
var debug = require('debug')('app:file:denormalizer');

function handler(store) {
  return function handler(event, cb) {
    cb = cb || function noop() {};
    if (event instanceof lang.FileUploaded) {
      debug('handle ' + event.get('eventType') + ' ' + event.get('eventId'));
      store.addFileMeta(event.get('fileId'), event.get('fileMeta'), cb);
    } else {
      cb();
    }
  };
}

module.exports = {
  handler: handler
};
