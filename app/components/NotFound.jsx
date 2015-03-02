var React = require('react');
var Link = require('react-router').Link;

var NotFound = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Not found</h1>
        <p><Link to="/app">Back to home</Link></p>
      </div>
    );
  }
});

module.exports = NotFound;
