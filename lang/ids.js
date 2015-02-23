var id = require('../core/id');

function newEventId() {
  return id.newId();
}

function newTaskId() {
  return id.newId();
}

function newFileId() {
  return id.newId();
}

module.exports = {
  newEventId: newEventId,
  newTaskId: newTaskId,
  newFileId: newFileId
};
