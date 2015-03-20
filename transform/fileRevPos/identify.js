var crypto = require('crypto');
var Immutable = require('immutable');

function getId(posId, transactionId) {
  return crypto
    .createHash('sha1')
    .update(posId + transactionId)
    .digest('hex');
}

module.exports = function identify(meta, data, cb) {
  var posId = meta.get('posId');
  var result = data.map(function(record) {
    return Immutable.Map({
      id: getId(posId, record.get('transaction_id')),
      record: record
    });
  });
  cb(null, result);
};
