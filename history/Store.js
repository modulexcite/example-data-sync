var Immutable = require('immutable');

function Store() {
  this._state = Immutable.OrderedMap();
}

Store.prototype.updateTaskWithEvent = function(taskId, updates, event, cb) {
  this._state = this._state.update(taskId, Immutable.Map({taskId: taskId}),
  function(taskState) {
    taskState = taskState.mergeDeep(updates);
    taskState = taskState.update('history', Immutable.List(),
    function(history) {
      return history.unshift(event);
    });
    return taskState;
  });
  cb();
};

Store.prototype.getAllHistory = function(cb) {
  cb(null, this._state.toList().reverse());
};

module.exports = Store;
