var lang = require('../lang');
var denormalizer = require('./denormalizer');
var debug = require('debug')('app:task:postTaskFile');

function eventsOut() {
  return [
    lang.TaskFileSet
  ];
}

function postTaskFile(pub, store) {
  var denormalize = denormalizer.handler(store);

  return function(req, res) {
    var taskId = req.params.taskId;
    debug('POST /task/:taskId/file ' + taskId);

    store.getTask(taskId, function(err, task) {
      if (err) {
        res.status(500).end();
        return;
      }
      if (!task) {
        res.status(404).send({
          error: {
            name: 'TaskDoesNotExist',
            message: 'No task found for given task id'
          }
        });
        return;
      }

      var fileId = req.body.fileId;
      var existingFileId = task.getIn(['meta', 'fileId']);
      if (existingFileId && existingFileId !== fileId) {
        res.status(409).send({
          error: {
            name: 'TaskAlreadyHasFile',
            message: 'Cannot change task file once it has been set'
          }
        });
        return;
      }

      var taskFileSet = new lang.TaskFileSet({
        eventId: lang.newEventId(),
        taskId: taskId,
        fileId: fileId
      });

      denormalize(taskFileSet, function(err, task) {
        if (err) {
          res.status(500).end();
          return;
        }

        pub('app', taskFileSet);

        res.send(task);
      });
    });
  };
}

module.exports = {
  handler: postTaskFile,
  eventsOut: eventsOut
};
