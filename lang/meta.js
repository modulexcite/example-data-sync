var Immutable = require('immutable');

exports.FileMeta = Immutable.Record({
  name: null,
  encoding: null,
  mimetype: null,
  extension: null,
  size: null
});
