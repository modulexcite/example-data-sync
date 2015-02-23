var lang = require('../lang');
var debug = require('debug')('app:task:postTask');

function events() {
  return [
    lang.TaskCreated
  ];
}

function postTask(pub) {
  return function(req, res) {
    debug('POST /task ' + JSON.stringify(req.body));
    pub('app', new lang.TaskCreated({
      eventId: lang.newEventId(),
      taskId: lang.newTaskId()
    }));
    res.sendStatus(200);
  };
}

module.exports = {
  handler: postTask,
  events: events
};
