var Immutable = require('immutable');

var TaskCreated = Immutable.Record({
  eventId: null,
  eventType: 'task-created',
  timestamp: null,
  taskId: null,
  userId: null,
  bucketId: null
});

module.exports = {
  TaskCreated: TaskCreated
};
