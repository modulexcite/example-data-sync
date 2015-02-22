var lang = require('../lang');
var debug = require('debug')('app:task:eventHandler');

function events() {
  return [
    lang.TaskCreated
  ];
}

function handleEvent(store, event) {
  if (event instanceof lang.TaskCreated) {
    debug('handle event', event.get('eventType'), JSON.stringify(event.toJS()));
    store[event.get('taskId')] = {};
  }
}

module.exports = {
  handler: handleEvent,
  events: events
};
