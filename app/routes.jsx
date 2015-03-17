var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Redirect = Router.Redirect;
var NotFoundRoute = Router.NotFoundRoute;

// Wrap in function to temporarily fix ESLint warning
// https://github.com/yannickcr/eslint-plugin-react/issues/19
module.exports = (function() {
  return [
    <Route path="/app" handler={require('./components/App.jsx')}>
      <Route name="tasks" handler={require('./components/TaskHistory.jsx')}/>
      <Route name="task-new" path="task/new" handler={require('./components/NewTask.jsx')}/>
      <Redirect from="/app" to="task-new" />
    </Route>,
    <NotFoundRoute name="not-found" handler={require('./components/NotFound.jsx')}/>
  ];
})();
