var Immutable = require('immutable');

function Store() {
  this._state = Immutable.Map();
}

Store.prototype.addTask = function(task, cb) {
  this._state = this._state.set(task.get('taskId'), task);
  cb();
};

Store.prototype.getTask = function(taskId, cb) {
  cb(null, this._state.get(taskId));
};

Store.prototype.setTaskFile = function(taskId, fileId, cb) {
  var task = this._state.get(taskId);
  if (!task) {
    return cb();
  }
  task = task.setIn(['meta', 'fileId'], fileId);
  this._state = this._state.set(task.get('taskId'), task);
  cb(null, task);
};

Store.prototype.setTaskAsStarted = function(taskId, cb) {
  var task = this._state.get(taskId);
  if (!task) {
    return cb();
  }
  task = task.set('started', true);
  this._state = this._state.set(task.get('taskId'), task);
  cb(null, task);
};

module.exports = Store;
