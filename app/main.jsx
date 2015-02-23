var React = require('react');

var App = React.createClass({
  render: function() {
    return <p>Hello world!</p>;
  }
});

React.render(<App/>, document.body);
