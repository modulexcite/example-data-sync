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

module.exports = Store;
