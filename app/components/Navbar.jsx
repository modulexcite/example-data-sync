var React = require('react');
var Link = require('react-router').Link;

var Navbar = React.createClass({
  render: function() {
    return (
      <p>
        <Link to="task-new">New sync task</Link>
        {' - '}
        <Link to="tasks">Sync task history</Link>
      </p>
    );
  }
});

module.exports = Navbar;
