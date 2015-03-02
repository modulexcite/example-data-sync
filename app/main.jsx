var React = require('react');
var Router = require('react-router');
var routes = require('./routes.jsx');

// For Chrome dev tools
window.React = React;

Router.run(routes, Router.HistoryLocation, function(Handler) {
  React.render(<Handler/>, document.body);
});
