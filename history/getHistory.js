var debug = require('debug')('app:history:getHistory');

function getHistory(pub, store) {
  return function(req, res) {
    debug('GET /history');

    store.getAllHistory(function(err, history) {
      if (err) {
        res.status(500).end();
        return;
      }

      res.send(history.toJS());
    });
  };
}

module.exports = {
  handler: getHistory
};
