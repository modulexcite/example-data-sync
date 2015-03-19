var Immutable = require('immutable');
var lang = require('../lang');
var denormalizer = require('./denormalizer');
var debug = require('debug')('app:task:postTask');

function eventsOut() {
  return [
    lang.TaskCreated
  ];
}

function postTask(pub, store) {
  var denormalize = denormalizer.handler(store);

  return function(req, res) {
    debug('POST /task ' + JSON.stringify(req.body));

    var taskCreated = new lang.TaskCreated({
      eventId: lang.newEventId(),
      taskId: lang.newTaskId(),
      taskType: req.body.type,
      taskMeta: Immutable.Map(req.body.meta || {})
    });

    denormalize(taskCreated, function(err, task) {
      if (err) {
        res.status(500).end();
        return;
      }

      pub('app', taskCreated);

      res.status(201).send(task);
    });
  };
}

module.exports = {
  handler: postTask,
  eventsOut: eventsOut
};
