var Sys = require('./core/Sys');

var sys = new Sys();

sys.addService('task', require('./task'));
sys.addService('file', require('./file'));
sys.addService('app', require('./app'));

sys.redirect('/', '/app');

var command = process.argv[process.argv.length - 1];
if (command === 'print') {
  sys.print();
} else {
  sys.start();
}
