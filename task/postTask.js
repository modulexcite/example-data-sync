var Immutable = require('immutable');
var lang = require('../lang');
var debug = require('debug')('app:task:postTask');

function events() {
  return [
    lang.TaskCreated
  ];
}

function postTask(pub, store) {
  return function(req, res) {
    debug('POST /task ' + JSON.stringify(req.body));
    var taskId = lang.newTaskId();
    var task = Immutable.fromJS({
      taskId: taskId,
      type: req.body.type,
      meta: req.body.meta || {}
    });

    store.addTask(task, function(err) {
      if (err) {
        res.status(500).end();
        return;
      }

      pub('app', new lang.TaskCreated({
        eventId: lang.newEventId(),
        taskId: taskId,
        taskType: task.get('type'),
        taskMeta: task.get('meta')
      }));

      res.status(201).send(task);
    });
  };
}

module.exports = {
  handler: postTask,
  events: events
};
