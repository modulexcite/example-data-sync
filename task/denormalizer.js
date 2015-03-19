var Immutable = require('immutable');
var lang = require('../lang');
var debug = require('debug')('app:task:denormalizer');

function handler(store) {
  return function handler(event, cb) {
    cb = cb || function noop() {};
    if (event instanceof lang.TaskCreated) {
      debug('handle ' + event.get('eventType') + ' ' + event.get('eventId'));
      var task = Immutable.Map({
        taskId: event.get('taskId'),
        type: event.get('taskType'),
        meta: event.get('taskMeta')
      });
      store.addTask(task, cb);
    } else if (event instanceof lang.TaskFileSet) {
      debug('handle ' + event.get('eventType') + ' ' + event.get('eventId'));
      store.setTaskFile(event.get('taskId'), event.get('fileId'), cb);
    } else if (event instanceof lang.TaskStarted) {
      debug('handle ' + event.get('eventType') + ' ' + event.get('eventId'));
      store.setTaskAsStarted(event.get('taskId'), cb);
    } else {
      cb();
    }
  };
}

module.exports = {
  handler: handler
};
