var React = require('react');
var Api = require('../lib/Api');

var api = new Api({host: 'http://localhost:3000'});

var NewSyncTask = React.createClass({
  render: function() {
    return (
      <div>
        <h1>New sync task</h1>
        <form>
          <p>
            {'Type: '}
            <select ref="type" value="file-rev-pos">
              <option value="file-rev-pos">File (Rev POS)</option>
            </select>
          </p>
          <p>POS Id: <input ref="posId" defaultValue="1234" /></p>
          <p>POS Name: <input ref="posName" defaultValue="Rev POS System Model B" /></p>
          <p><button type="submit" onClick={this.handleSubmit}>Create</button></p>
        </form>
      </div>
    );
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var task = {
      type: this.refs.type.getDOMNode().value,
      meta: {
        posId: this.refs.posId.getDOMNode().value,
        posName: this.refs.posName.getDOMNode().value
      }
    };
    api.createTask(task, function(err, task) {
      if (err) {
        console.log(err);
        return;
      }
      console.log('created task', task);
    });
  }
});

var App = React.createClass({
  render: function() {
    return <NewSyncTask />;
  }
});

React.render(<App/>, document.body);
