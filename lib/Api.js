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
    .send(task)
    .end(function(err, res) {
      if (err) {
        debug('error', err);
      }
      cb(err, res && res.body);
    });
};

module.exports = Api;
