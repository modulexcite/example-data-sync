// var Immutable = require('Immutable');
// var Bus = require('./core/Bus');

// var bus = new Bus();

// var log = console.log.bind(console);

// bus.subscribe('app', log);
// bus.publish('app', Immutable.fromJS({
//   eventId: '123',
//   eventType: 'task-created',
//   payload: {
//     name: 'foo'
//   }
// }));

var Sys = require('./core/Sys');
var task = require('./task');

var sys = new Sys();

sys.addService('task', task);

// sys.start();
sys.print();
