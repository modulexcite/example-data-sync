var path = require('path');
var Bus = require('./core/Bus');
var Sys = require('./core/Sys');

var DATA_DIR = path.join(__dirname, 'data');

var bus = new Bus({
  dirname: DATA_DIR,
  inMemoryOnly: false
});

var sys = new Sys({bus: bus});

sys.addService('task', require('./task'));
sys.addService('file', require('./file')({
  dirname: path.join(DATA_DIR, 'files')
}));
sys.addService('transform', require('./transform'));
sys.addService('history', require('./history'));
sys.addService('app', require('./app'));

sys.redirect('/', '/app');

var command = process.argv[process.argv.length - 1];
if (command === 'print') {
  sys.print();
} else {
  sys.start();
}
