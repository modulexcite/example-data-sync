var fs = require('fs');
var path = require('path');
var Immutable = require('immutable');
var mkdirp = require('mkdirp');

var NEWLINE = '\n';

function Blob(options) {
  options = options || {};
  this._dirname = options.dirname;
  this._ensureDirectoryExists(this._dirname);
}

Blob.prototype.write = function(blobId, data, cb) {
  data = this._newLineJsonStringify(data);
  fs.writeFile(this._getFilename(blobId), data, {encoding: 'utf8'}, cb);
};

Blob.prototype.read = function(blobId, cb) {
  var self = this;
  fs.readFile(this._getFilename(blobId), {encoding: 'utf8'},
  function(err, contents) {
    if (err) {
      return cb(err);
    }
    var data = self._newLineJsonParse(contents);
    cb(null, data);
  });
};

Blob.prototype._getFilename = function(blobId) {
  return path.join(this._dirname, blobId);
};

Blob.prototype._ensureDirectoryExists = function(directory, cb) {
  mkdirp.sync(directory);
};

Blob.prototype._newLineJsonStringify = function(data) {
  var result = data.map(function(item) {
    return JSON.stringify(item);
  });
  result = result.join(NEWLINE);
  result = result + NEWLINE;
  return result;
};

Blob.prototype._newLineJsonParse = function(str) {
  var result = str.split(NEWLINE);
  var lastItem = result[result.length - 1];
  if (!lastItem.length) {
    result.pop();
  }
  result = result.map(function(item) {
    return JSON.parse(item);
  });
  result = Immutable.fromJS(result);
  return result;
};

module.exports = Blob;
