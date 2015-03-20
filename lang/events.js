var Immutable = require('immutable');

exports.TaskCreated = Immutable.Record({
  eventId: null,
  eventType: 'task-created',
  timestamp: null,
  taskId: null,
  userId: null,
  bucketId: null,
  taskType: null,
  taskMeta: null
});

exports.FileUploaded = Immutable.Record({
  eventId: null,
  eventType: 'file-uploaded',
  timestamp: null,
  fileId: null,
  userId: null,
  fileMeta: null
});

exports.TaskFileSet = Immutable.Record({
  eventId: null,
  eventType: 'task-file-set',
  timestamp: null,
  taskId: null,
  userId: null,
  fileId: null
});

exports.TaskStarted = Immutable.Record({
  eventId: null,
  eventType: 'task-started',
  timestamp: null,
  taskId: null,
  userId: null,
  bucketId: null,
  taskType: null,
  taskMeta: null
});

exports.RawDataRejected = Immutable.Record({
  eventId: null,
  eventType: 'raw-data-rejected',
  timestamp: null,
  taskId: null,
  userId: null,
  reasonName: null,
  reasonMessage: null
});

exports.RawDataValidated = Immutable.Record({
  eventId: null,
  eventType: 'raw-data-validated',
  timestamp: null,
  taskId: null,
  userId: null
});

exports.RawDataParsed = Immutable.Record({
  eventId: null,
  eventType: 'raw-data-parsed',
  timestamp: null,
  taskId: null,
  userId: null,
  recordCount: null
});

exports.DataRecordsIdentified = Immutable.Record({
  eventId: null,
  eventType: 'data-records-identified',
  timestamp: null,
  taskId: null,
  userId: null
});

exports.DataRecordsTranslated = Immutable.Record({
  eventId: null,
  eventType: 'data-records-translated',
  timestamp: null,
  taskId: null,
  userId: null
});

exports.TransformCompleted = Immutable.Record({
  eventId: null,
  eventType: 'transform-completed',
  timestamp: null,
  taskId: null,
  userId: null,
  blobId: null
});
