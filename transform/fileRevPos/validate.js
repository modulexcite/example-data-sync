var Immutable = require('immutable');

module.exports = function validate(data, cb) {
  if (!data) {
    cb(null, Immutable.fromJS({
      isValid: false,
      reason: {
        name: 'EmptyData',
        message: 'Raw data is empty'
      }
    }));
    return;
  }

  var hasHeader = data.match(
    /^transaction_id,datetime,customer_id,payment/
  );
  if (!hasHeader) {
    cb(null, Immutable.fromJS({
      isValid: false,
      reason: {
        name: 'NoHeaderFound',
        message: 'Expected first line to be "transaction_id,datetime,customer_id,payment"'
      }
    }));
    return;
  }

  cb(null, Immutable.Map({isValid: true}));
};
