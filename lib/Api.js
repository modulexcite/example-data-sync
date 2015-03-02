var Immutable = require('immutable');
var superagent = require('superagent');
var debug = require('debug')('app:Api');

function Api(options) {
  options = options || {};

  this._host = options.host;
}

Api.prototype._parseResponse = function(res) {
  var result = res && res.body;
  if (!result) {
    return null;
  }
  return Immutable.fromJS(result);
};

Api.prototype._handleError = function(err, cb) {
  debug('ERROR: ' + err);
  cb(err);
};

Api.prototype._handleResponse = function(res, cb) {
  var result = this._parseResponse(res);
  if (!result) {
    return cb();
  }

  var err = result.get('error');
  if (err) {
    return this._handleError(err, cb);
  }

  cb(null, result);
};

Api.prototype.createTask = function(task, cb) {
  var self = this;
  superagent
    .post(this._host + '/task')
    .accept('json')
    .send(task.toJS())
    .end(function(err, res) {
      if (err) {
        return self._handleError(err, cb);
      }
      self._handleResponse(res, cb);
    });
};

Api.prototype.getTask = function(taskId, cb) {
  var self = this;
  superagent
    .get(this._host + '/task/' + taskId)
    .accept('json')
    .end(function(err, res) {
      if (err) {
        return self._handleError(err, cb);
      }
      self._handleResponse(res, cb);
    });
};

Api.prototype.getFileMeta = function(fileId, cb) {
  var self = this;
  superagent
    .get(this._host + '/file/' + fileId + '/meta')
    .accept('json')
    .end(function(err, res) {
      if (err) {
        return self._handleError(err, cb);
      }
      self._handleResponse(res, cb);
    });
};

Api.prototype.setTaskFile = function(taskId, fileId, cb) {
  var self = this;
  superagent
    .post(this._host + '/task/' + taskId + '/file')
    .accept('json')
    .send({fileId: fileId})
    .end(function(err, res) {
      if (err) {
        return self._handleError(err, cb);
      }
      self._handleResponse(res, cb);
    });
};

Api.prototype.startTask = function(taskId, cb) {
  var self = this;
  superagent
    .post(this._host + '/task/' + taskId + '/start')
    .accept('json')
    .end(function(err, res) {
      if (err) {
        return self._handleError(err, cb);
      }
      self._handleResponse(res, cb);
    });
};

module.exports = Api;
