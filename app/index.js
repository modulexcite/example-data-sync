var fs = require('fs');
var path = require('path');
var express = require('express');

var html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

module.exports = function(sys) {
  sys.useMiddleware('/public', express.static(
    path.join(__dirname, '..', 'build')
  ));
  sys.handleHttp('GET', '*', {
    handler: function() {
      return function(req, res) { res.send(html); };
    }
  });
};
