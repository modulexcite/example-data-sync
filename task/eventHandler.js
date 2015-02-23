var lang = require('../lang');
var debug = require('debug')('app:task:eventHandler');

function events() {
  return [
    lang.TaskCreated
  ];
}

function handler(pub, store) {
  return function(event) {
    if (event instanceof lang.TaskCreated) {
      debug('handle ' + event.get('eventType') + ' ' + JSON.stringify(event.toJS()));
      store[event.get('taskId')] = {};
    }
  };
}

module.exports = {
  handler: handler,
  events: events
};
