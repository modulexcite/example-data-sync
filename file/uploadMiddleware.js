var path = require('path');
var multer = require('multer');
var lang = require('../lang');

module.exports = multer({
  dest: path.join(__dirname, '..', 'files'),
  rename: function(fieldname, filename, req, res) {
    return lang.newFileId();
  }
});
