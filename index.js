var Sys = require('./core/Sys');

var sys = new Sys();

sys.addService('task', require('./task'));
sys.addService('file', require('./file'));
sys.addService('app', require('./app'));

sys.start();
// sys.print();
