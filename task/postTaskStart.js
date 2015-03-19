var lang = require('../lang');
var denormalizer = require('./denormalizer');
var debug = require('debug')('app:task:postTaskStart');

function eventsOut() {
  return [
    lang.TaskStarted
  ];
}

function postTaskStart(pub, store) {
  var denormalize = denormalizer.handler(store);

  return function(req, res) {
    var taskId = req.params.taskId;
    debug('POST /task/:taskId/start ' + taskId);

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

      if (task.get('started')) {
        res.status(409).send({
          error: {
            name: 'TaskAlreadyStarted',
            message: 'Tasks can only be started once'
          }
        });
        return;
      }

      var isFileTask = Boolean(task.get('type').match(/^file-/));
      var hasFileSet = Boolean(task.getIn(['meta', 'fileId']));
      if (isFileTask && !hasFileSet) {
        res.status(409).send({
          error: {
            name: 'TaskFileRequired',
            message: 'Cannot start task until a file has been set'
          }
        });
        return;
      }

      var taskStarted = new lang.TaskStarted({
        eventId: lang.newEventId(),
        taskId: taskId,
        taskType: task.get('type'),
        taskMeta: task.get('meta')
      });

      denormalize(taskStarted, function(err, task) {
        if (err) {
          res.status(500).end();
          return;
        }

        pub('app', taskStarted);

        res.send(task);
      });
    });
  };
}

module.exports = {
  handler: postTaskStart,
  eventsOut: eventsOut
};
