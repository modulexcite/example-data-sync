var EventEmitter = require('events').EventEmitter;
var path = require('path');
var async = require('async');
var changeCase = require('change-case');
var timestamp = require('./timestamp');
var Persistence = require('./Persistence');
var lang = require('../lang');
var debug = require('debug')('app:bus');

function Bus(options) {
  options = options || {};
  this._dirname = options.dirname || '';
  this._inMemoryOnly = Boolean(options.inMemoryOnly);
  this._channels = {};
  this._emitter = new EventEmitter();
}

Bus.prototype.publish = function(channel, event) {
  var self = this;
  debug('publish ' + channel + '/' + event.get('eventType') + ' ' + event.get('eventId'));
  this._ensureChannel(channel, function(err) {
    if (err) {
      debug('ERROR ' + err);
      return;
    }
    if (!event.get('timestamp')) {
      event = event.set('timestamp', timestamp.now());
    }
    self._channels[channel].append(event, function(err) {
      if (err) {
        debug('ERROR ' + err);
        return;
      }
      self._emitter.emit(channel, event);
    });
  });
};

Bus.prototype.subscribe = function(channel, handler) {
  this._emitter.on(channel, handler);
};

Bus.prototype.unsubscribe = function(channel, handler) {
  this._emitter.removeListener(channel, handler);
};

Bus.prototype.replay = function(channel, handler, cb) {
  var self = this;
  this._ensureChannel(channel, function(err) {
    if (err) {
      debug('ERROR ' + err);
      return;
    }
    self._channels[channel].read(function(err, events) {
      if (err) {
        debug('ERROR ' + err);
        return;
      }

      // Convert to a domain event record
      events = events.map(function(event) {
        var eventName = changeCase.pascalCase(event.get('eventType'));
        var EventRecord = lang[eventName];
        if (EventRecord) {
          return new EventRecord(event);
        } else {
          debug('WARNING: Unrecognized event ' + event);
          return null;
        }
      });
      // Filter any non-recognized events
      events = events.filter(function(event) { return event !== null; });

      debug('replaying events for channel ' + channel + ' (' + events.count() + ' events)');
      async.mapSeries(events.toArray(), handler, cb);
    });
  });
};

Bus.prototype._ensureChannel = function(channel, cb) {
  if (this._channels[channel]) {
    return cb();
  }
  var persistence = new Persistence({
    filename: path.join(this._dirname, channel + '.log'),
    inMemoryOnly: this._inMemoryOnly
  });
  this._channels[channel] = persistence;
  persistence.load(cb);
};

module.exports = Bus;
