var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');
var debug = require('debug')('app:bus');

function Bus() {
  this._channels = {};
  this._emitter = new EventEmitter();
}

Bus.prototype.publish = function(channel, event) {
  debug('publish ' + channel + ' ' + JSON.stringify(event));
  this._ensureChannel(channel);
  this._channels[channel].push(event);
  this._emitter.emit(channel, event);
};

Bus.prototype.subscribe = function(channel, handler) {
  this._ensureChannel(channel);
  this._emitter.on(channel, handler);
};

Bus.prototype.unsubscribe = function(channel, handler) {
  this._ensureChannel(channel);
  this._emitter.removeListener(channel, handler);
};

Bus.prototype._ensureChannel = function(channel) {
  if (!this._channels[channel]) {
    this._createChannel(channel);
  }
};

Bus.prototype._createChannel = function(channel) {
  this._channels[channel] = Immutable.List();
};

module.exports = Bus;
