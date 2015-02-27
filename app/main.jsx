var React = require('react');
var Immutable = require('immutable');
var queryString = require('query-string');
var Api = require('../lib/Api');

var api = new Api({host: 'http://localhost:3000'});

var NewSyncTask = React.createClass({
  getInitialState: function() {
    return {
      task: null,
      file: null
    };
  },

  componentWillMount: function() {
    var self = this;
    var qs = queryString.parse(window.location.search);

    var taskId = qs.taskId;
    if (taskId) {
      this.setState({task: Immutable.Map({taskId: taskId})});
      api.getTask(taskId, function(err, task) {
        if (err) {
          console.log(err);
          return;
        }
        self.setState({task: task});
      });
    }

    var fileId = qs.fileId;
    if (fileId) {
      this.setState({file: Immutable.Map({fileId: fileId})});
      api.getFileMeta(fileId, function(err, fileMeta) {
        if (err) {
          console.log(err);
          return;
        }
        var file = self.state.file.set('meta', fileMeta);
        self.setState({file: file});
      });
    }
  },

  render: function() {
    return (
      <div>
        <h1>New sync task</h1>
        {this.renderNewTask()}
        {this.renderUploadFile()}
      </div>
    );
  },

  renderNewTask: function() {
    var task = this.state.task;
    if (task) {
      return (
        <div>
          <p>Type: <strong>{task.get('type')}</strong></p>
          <p>POS Id: <strong>{task.getIn(['meta', 'posId'])}</strong></p>
          <p>POS Name: <strong>{task.getIn(['meta', 'posName'])}</strong></p>
          <p>Task Id: <strong>{task.get('taskId')}</strong></p>
        </div>
      );
    }

    return (
      <div>
        <form>
          <p>
            {'Type: '}
            <select ref="type" value="file-rev-pos">
              <option value="file-rev-pos">File (Rev POS)</option>
            </select>
          </p>
          <p>POS Id: <input ref="posId" defaultValue="1234" /></p>
          <p>POS Name: <input ref="posName" defaultValue="Rev POS System Model B" /></p>
          <p><button type="submit" onClick={this.handleCreateTask}>Create</button></p>
        </form>
      </div>
    );
  },

  handleCreateTask: function(e) {
    var self = this;
    e.preventDefault();
    var task = Immutable.fromJS({
      type: this.refs.type.getDOMNode().value,
      meta: {
        posId: this.refs.posId.getDOMNode().value,
        posName: this.refs.posName.getDOMNode().value
      }
    });
    api.createTask(task, function(err, task) {
      if (err) {
        console.log(err);
        return;
      }
      self.setState({task: task});
    });
  },

  renderUploadFile: function() {
    var task = this.state.task;
    if (!task) {
      return null;
    }

    var file = this.state.file;
    if (file) {
      return (
        <div>
          <p>File Id: <strong>{file.get('fileId')}</strong></p>
          <p>File Name: <strong>{file.getIn(['meta', 'name'])}</strong></p>
          <p>File size: <strong>{file.getIn(['meta', 'size'])}</strong></p>
        </div>
      );
    }

    var href = 'http://localhost:3000/file?';
    href += queryString.stringify({
      redirect: location.href + '?taskId=' + task.get('taskId')
    });
    return <p><a href={href}>Click here to upload file</a></p>;
  }
});

var App = React.createClass({
  render: function() {
    return <NewSyncTask />;
  }
});

React.render(<App/>, document.body);
