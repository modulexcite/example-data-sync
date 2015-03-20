var Immutable = require('immutable');

module.exports = function translate(meta, data, cb) {
  var posId = meta.get('posId');
  var result = data.map(function(item) {
    return Immutable.Map({
      id: item.get('id'),
      posId: posId,
      customerId: item.getIn(['record', 'customer_id']),
      datetime: item.getIn(['record', 'datetime']),
      payment: item.getIn(['record', 'payment'])
    });
  });
  cb(null, result);
};
