var React = require('react');
var html = require('./html.jsx');

var Home = React.createClass({
  propTypes: {
    markup: React.PropTypes.string
  },

  render: function() {
    return (
      <div>
        <p>File upload</p>
      </div>
    );
  }
});

module.exports = {
  handler: function(pub, req, res) {
    res.send(html(Home));
  },
  events: function() { return []; }
};
