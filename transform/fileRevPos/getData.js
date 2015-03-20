module.exports = function(api) {
  return function getData(taskMeta, cb) {
    api.getFile(taskMeta.get('fileId'), cb);
  };
};
