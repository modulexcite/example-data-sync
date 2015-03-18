var express = require('express');
var bodyParser = require('body-parser');
var debug = require('debug')('app:sys');

function Sys(options) {
  this._server = express();
  this._server.use(bodyParser.json());
  this._bus = options.bus;
  this._services = {};
  this._routers = {};
  this._dbs = {};
  this._stores = {};
}

Sys.prototype.addService = function(name, service, options) {
  options = options || {};
  this._services[name] = service;
  if (options.db) {
    this._dbs[name] = options.db;
  }
};

Sys.prototype.start = function() {
  var bus = this._bus;
  var pub = bus.publish.bind(bus);
  var dbs = this._dbs;
  var stores = this._stores;
  var server = this._server;
  var router;
  for (var service in this._services) {
    router = express.Router();
    this._routers[service] = router;
    this._services[service]({
      useStore: function(Store) {
        stores[service] = new Store(dbs[service]);
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
        var eventsOut = controller.eventsOut ? controller.eventsOut() : [];
        for (i = 0; i < eventsOut.length; i++) {
          eventsProduced.push(eventsOut[i].prototype._defaultValues.eventType);
        }
      },
      handleEvents: function(channel, controller) {
        var eventsIn = controller.eventsIn ? controller.eventsIn() : [];
        for (i = 0; i < eventsIn.length; i++) {
          eventsConsumed.push(eventsIn[i].prototype._defaultValues.eventType);
        }
        var eventsOut = controller.eventsOut ? controller.eventsOut() : [];
        for (i = 0; i < eventsOut.length; i++) {
          eventsProduced.push(eventsOut[i].prototype._defaultValues.eventType);
        }
      }
    });
    if (eventsConsumed.length) {
      console.log('  Events consumed:');
      for (i = 0; i < eventsConsumed.length; i++) {
        console.log('    - ' + eventsConsumed[i]);
      }
    }
    if (httpEndpoints.length) {
      console.log('  HTTP endpoints:');
      for (i = 0; i < httpEndpoints.length; i++) {
        console.log('    - ' + httpEndpoints[i]);
      }
    }
    if (eventsProduced.length) {
      console.log('  Events produced:');
      for (i = 0; i < eventsProduced.length; i++) {
        console.log('    - ' + eventsProduced[i]);
      }
    }
    console.log('');
  }
};

module.exports = Sys;
