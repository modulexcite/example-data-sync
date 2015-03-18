var EventEmitter = require('events').EventEmitter;
var path = require('path');
var timestamp = require('./timestamp');
var Persistence = require('./Persistence');
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
  debug('publish ' + channel + '/' + event.get('eventType') + ' ' + JSON.stringify(event));
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
