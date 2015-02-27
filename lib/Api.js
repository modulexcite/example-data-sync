var Immutable = require('immutable');
var superagent = require('superagent');
var debug = require('debug')('app:Api');

function Api(options) {
  options = options || {};

  this._host = options.host;
}

Api.prototype.createTask = function(task, cb) {
  superagent
    .post(this._host + '/task')
    .accept('json')
    .send(task.toJS())
    .end(function(err, res) {
      if (err) {
        debug('error', err);
      }
      cb(err, res && Immutable.fromJS(res.body));
    });
};

Api.prototype.getTask = function(taskId, cb) {
  superagent
    .get(this._host + '/task/' + taskId)
    .accept('json')
    .end(function(err, res) {
      if (err) {
        debug('error', err);
      }
      cb(err, res && Immutable.fromJS(res.body));
    });
};

module.exports = Api;
