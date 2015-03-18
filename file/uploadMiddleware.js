var multer = require('multer');
var lang = require('../lang');

module.exports = function(options) {
  return multer({
    dest: options.dirname,
    rename: function(fieldname, filename, req, res) {
      return lang.newFileId();
    }
  });
};
