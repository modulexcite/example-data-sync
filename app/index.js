var fs = require('fs');
var path = require('path');

var html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

module.exports = function(sys) {
  sys.useStatic('/public', path.join(__dirname, '..', 'build'));
  sys.handleHttp('GET', '/', {
    events: function() { return []; },
    handler: function(pub, req, res) {
      res.send(html);
    }
  });
};
