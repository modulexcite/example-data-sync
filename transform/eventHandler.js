var lang = require('../lang');
var debug = require('debug')('app:transform:eventHandler');

function events() {
  return [
    lang.TaskStarted
  ];
}

function handler(pub, store) {
  return function(event) {
    if (event instanceof lang.TaskStarted) {
      debug('handle ' + event.get('eventType') + ' ' + JSON.stringify(event.toJS()));
    }
  };
}

module.exports = {
  handler: handler,
  events: events
};
