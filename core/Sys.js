var express = require('express');
var bodyParser = require('body-parser');
var debug = require('debug')('app:sys');
var Bus = require('./Bus');

function Sys() {
  this._server = express();
  this._bus = new Bus();
  this._services = {};
  this._routers = {};
  this._stores = {};
}

Sys.prototype.addService = function(name, service) {
  this._services[name] = service;
};

Sys.prototype.start = function() {
  var bus = this._bus;
  var pub = bus.publish.bind(bus);
  var stores = this._stores;
  var server = this._server;
  server.use(bodyParser.json());
  var router;
  for (var service in this._services) {
    router = express.Router();
    this._routers[service] = router;
    this._services[service]({
      useStore: function(store) {
        stores[service] = store;
      },
      useMiddleware: function(route, middleware) {
        if (!middleware) {
          middleware = route;
          router.use(middleware);
        } else {
          router.use(route, middleware);
        }
      },
      handleHttp: function(method, route, controller) {
        router[method.toLowerCase()](route, controller.handler(pub, stores[service]));
      },
      handleEvents: function(channel, controller) {
        if (!stores[service]) {
          debug('WARNING: Added event handler but no store for service ' + service);
        }
        bus.subscribe(channel, controller.handler(pub, stores[service]));
      }
    });
    server.use('/' + service, router);
  }
  var port = process.env.PORT || 3000;
  server.listen(port);
  debug('Listening on port ' + port);
};

Sys.prototype.redirect = function(from, to) {
  this._server.get(from, function(req, res) {
    res.redirect(to);
  });
};

Sys.prototype.print = function() {
  var i;
  var eventsConsumed;
  var httpEndpoints;
  var eventsProduced;
  for (var service in this._services) {
    eventsConsumed = [];
    httpEndpoints = [];
    eventsProduced = [];
    console.log('Service: ' + service);
    this._services[service]({
      useStore: function() {},
      useMiddleware: function() {},
      handleHttp: function(method, route, controller) {
        if (route === '/') {
          route = '';
        }
        httpEndpoints.push(method + ' /' + service + route);
        var events = controller.events ? controller.events() : [];
        for (i = 0; i < events.length; i++) {
          eventsProduced.push(events[i].prototype._defaultValues.eventType);
        }
      },
      handleEvents: function(channel, controller) {
        var events = controller.events ? controller.events() : [];
        for (i = 0; i < events.length; i++) {
          eventsConsumed.push(events[i].prototype._defaultValues.eventType);
        }
      }
    });
    console.log('  Events consumed:');
    for (i = 0; i < eventsConsumed.length; i++) {
      console.log('    - ' + eventsConsumed[i]);
    }
    console.log('  HTTP endpoints:');
    for (i = 0; i < httpEndpoints.length; i++) {
      console.log('    - ' + httpEndpoints[i]);
    }
    console.log('  Events produced:');
    for (i = 0; i < eventsProduced.length; i++) {
      console.log('    - ' + eventsProduced[i]);
    }
    console.log('');
  }
};

module.exports = Sys;
