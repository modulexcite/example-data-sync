var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var Navbar = require('./Navbar.jsx');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <Navbar />
        <RouteHandler />
      </div>
    );
  }
});

module.exports = App;
