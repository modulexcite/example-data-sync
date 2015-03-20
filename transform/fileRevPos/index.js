module.exports = function(api) {
  return {
    getData: require('./getData')(api),
    validate: require('./validate'),
    parse: require('./parse'),
    identify: require('./identify')
  };
};
