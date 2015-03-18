var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var Immutable = require('immutable');

var NEWLINE = '\n';

function Persistence(options) {
  options = options || {};
  this._filename = options.filename;
  this._inMemoryOnly = Boolean(options.inMemoryOnly);
}

Persistence.prototype.load = function(cb) {
  if (this._inMemoryOnly) {
    return cb();
  }

  this._ensurePathExists(this._filename, cb);
};

Persistence.prototype.read = function(cb) {
  if (this._inMemoryOnly) {
    return cb(null, Immutable.List());
  }

  fs.readFile(this._filename, {encoding: 'utf8'}, function(err, data) {
    if (err) {
      return cb(err);
    }
    if (!(data && data.length)) {
      return cb(null, Immutable.List());
    }
    data = data.split(NEWLINE);
    // Remove last empty string item
    var lastItem = data[data.length - 1];
    if (!lastItem.length) {
      data.pop();
    }
    data = data.map(function(datum) {
      return JSON.parse(datum);
    });
    data = Immutable.fromJS(data);
    cb(null, data);
  });
};

Persistence.prototype.append = function(item, cb) {
  if (this._inMemoryOnly) {
    return cb();
  }

  var datum = JSON.stringify(item) + NEWLINE;
  fs.appendFile(this._filename, datum, {encoding: 'utf8'}, cb);
};

Persistence.prototype._ensureDirectoryExists = function(directory, cb) {
  mkdirp(directory, cb);
};

Persistence.prototype._ensureFileExists = function(file, cb) {
  fs.exists(file, function(exists) {
    if (exists) {
      return cb();
    }
    fs.writeFile(file, '', {encoding: 'utf8'}, cb);
  });
};

Persistence.prototype._ensurePathExists = function(filename, cb) {
  var self = this;
  this._ensureDirectoryExists(path.dirname(filename), function(err) {
    if (err) {
      return cb(err);
    }
    self._ensureFileExists(filename, cb);
  });
};

module.exports = Persistence;
