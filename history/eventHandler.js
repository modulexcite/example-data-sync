var Immutable = require('immutable');
var lang = require('../lang');
var debug = require('debug')('app:history:eventHandler');

function eventsIn() {
  return [
    lang.TaskCreated,
    lang.TaskFileSet,
    lang.TaskStarted,
    lang.RawDataRejected,
    lang.RawDataValidated
  ];
}

function handler(pub, store) {
  return function(event) {
    var updates;
    if (event instanceof lang.TaskCreated) {
      debug('handle ' + event.get('eventType') + ' ' + JSON.stringify(event.toJS()));
      updates = Immutable.Map({
        status: 'pending',
        type: event.get('taskType'),
        userId: event.get('userId'),
        bucketId: event.get('bucketId'),
        meta: event.get('taskMeta')
      });
    } else if (event instanceof lang.TaskFileSet) {
      debug('handle ' + event.get('eventType') + ' ' + JSON.stringify(event.toJS()));
      updates = Immutable.Map({
        status: 'pending',
        meta: Immutable.Map({fileId: event.get('fileId')})
      });
    } else if (event instanceof lang.TaskStarted) {
      debug('handle ' + event.get('eventType') + ' ' + JSON.stringify(event.toJS()));
      updates = Immutable.Map({status: 'running'});
    } else if (event instanceof lang.RawDataRejected) {
      debug('handle ' + event.get('eventType') + ' ' + JSON.stringify(event.toJS()));
      updates = Immutable.Map({
        status: 'failed',
        reasonName: event.get('reasonName'),
        reasonMessage: event.get('reasonMessage')
      });
    } else if (event instanceof lang.RawDataValidated) {
      debug('handle ' + event.get('eventType') + ' ' + JSON.stringify(event.toJS()));
      updates = Immutable.Map({status: 'running'});
    }

    if (updates) {
      var taskId = taskId = event.get('taskId');
      var shortEvent = Immutable.Map({
        eventId: event.get('eventId'),
        eventType: event.get('eventType'),
        timestamp: event.get('timestamp')
      });
      store.updateTaskWithEvent(taskId, updates, shortEvent, function(err) {
        if (err) {
          debug('ERROR' + err);
          return;
        }
      });
    }
  };
}

module.exports = {
  handler: handler,
  eventsIn: eventsIn
};
