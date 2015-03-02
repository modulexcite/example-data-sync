var React = require('react');
// Suppress ESLint "no-unused-vars" warning
window.React = React;
var Router = require('react-router');
var Route = Router.Route;
var Redirect = Router.Redirect;
var NotFoundRoute = Router.NotFoundRoute;

module.exports = [
  <Route path="/app" handler={require('./components/App.jsx')}>
    <Route name="tasks" handler={require('./components/TaskHistory.jsx')}/>
    <Route name="task-new" path="task/new" handler={require('./components/NewTask.jsx')}/>
    <Redirect from="/app" to="task-new" />
  </Route>,
  <NotFoundRoute name="not-found" handler={require('./components/NotFound.jsx')}/>
];
