var id = require('../core/id');

exports.newEventId = function newEventId() {
  return id.newId();
};

exports.newTaskId = function newTaskId() {
  return id.newId();
};

exports.newFileId = function newFileId() {
  return id.newId();
};
