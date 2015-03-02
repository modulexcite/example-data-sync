var Immutable = require('immutable');

var TaskCreated = Immutable.Record({
  eventId: null,
  eventType: 'task-created',
  timestamp: null,
  taskId: null,
  userId: null,
  bucketId: null,
  taskType: null,
  taskMeta: null
});

var FileUploaded = Immutable.Record({
  eventId: null,
  eventType: 'file-uploaded',
  timestamp: null,
  fileId: null,
  userId: null,
  fileMeta: null
});

var TaskFileSet = Immutable.Record({
  eventId: null,
  eventType: 'task-file-set',
  timestamp: null,
  taskId: null,
  userId: null,
  fileId: null
});

var TaskStarted = Immutable.Record({
  eventId: null,
  eventType: 'task-started',
  timestamp: null,
  taskId: null,
  userId: null,
  bucketId: null,
  taskType: null,
  taskMeta: null
});

var RawDataRejected = Immutable.Record({
  eventId: null,
  eventType: 'raw-data-rejected',
  timestamp: null,
  taskId: null,
  userId: null,
  reasonName: null,
  reasonMessage: null
});

var RawDataValidated = Immutable.Record({
  eventId: null,
  eventType: 'raw-data-validated',
  timestamp: null,
  taskId: null,
  userId: null
});

module.exports = {
  TaskCreated: TaskCreated,
  FileUploaded: FileUploaded,
  TaskFileSet: TaskFileSet,
  TaskStarted: TaskStarted,
  RawDataRejected: RawDataRejected,
  RawDataValidated: RawDataValidated
};
