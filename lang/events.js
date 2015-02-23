var Immutable = require('immutable');

var TaskCreated = Immutable.Record({
  eventId: null,
  eventType: 'task-created',
  timestamp: null,
  taskId: null,
  userId: null,
  bucketId: null
});

var FileUploaded = Immutable.Record({
  eventId: null,
  eventType: 'file-uploaded',
  timestamp: null,
  fileId: null,
  userId: null,
  bucketId: null,
  fileMeta: null
});

module.exports = {
  TaskCreated: TaskCreated,
  FileUploaded: FileUploaded
};
