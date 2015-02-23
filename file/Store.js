var Immutable = require('immutable');

function Store() {
  this._state = Immutable.Map();
}

Store.prototype.addFileMeta = function(fileId, fileMeta, cb) {
  this._state = this._state.set(fileId, fileMeta);
  cb();
};

Store.prototype.getFileMeta = function(fileId, cb) {
  cb(null, this._state.get(fileId));
};

module.exports = Store;
