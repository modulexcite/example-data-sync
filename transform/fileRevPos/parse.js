var Immutable = require('immutable');

module.exports = function parse(data, cb) {
  data = data.split('\n');
  // Remove last empty string item
  var lastItem = data[data.length - 1];
  if (!lastItem.length) {
    data.pop();
  }
  // Split rows
  data = data.map(function(row) { return row.split(','); });
  // Get header field names
  var header = data.shift();
  // Convert rows to objects
  data = data.map(function(row) {
    return header.reduce(function(acc, field, index) {
      var value = row[index];
      if (!value.length) {
        value = null;
      }
      if (field === 'payment') {
        value = parseFloat(value);
      }
      acc[field] = value;
      return acc;
    }, {});
  });
  data = Immutable.fromJS(data);
  return cb(null, data);
};
