var Immutable = require('immutable');

var FileMeta = Immutable.Record({
  name: null,
  encoding: null,
  mimetype: null,
  extension: null,
  size: null
});

module.exports = {
  FileMeta: FileMeta
};
