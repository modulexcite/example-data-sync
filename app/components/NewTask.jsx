var React = require('react');
var Immutable = require('immutable');
var Router = require('react-router');
var queryString = require('qs');
var api = require('../api');

var NewTask = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function() {
    return {
      task: null,
      file: null
    };
  },

  componentWillMount: function() {
    var self = this;
    var query = this.getQuery();
    var taskId = query.taskId;
    var fileId = query.fileId;

    if (taskId && fileId) {
      this.setState({task: Immutable.Map({taskId: taskId})});
      api.setTaskFile(taskId, fileId, function(err, task) {
        if (err) {
          return;
        }
        self.setState({task: task});
      });
    } else if (taskId) {
      this.setState({task: Immutable.Map({taskId: taskId})});
      api.getTask(taskId, function(err, task) {
        if (err) {
          return;
        }
        self.setState({task: task});
      });
    }

    if (fileId) {
      this.setState({file: Immutable.Map({fileId: fileId})});
      api.getFileMeta(fileId, function(err, fileMeta) {
        if (err) {
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
        {this.renderCreateTask()}
        {this.renderUploadFile()}
        {this.renderStartTask()}
      </div>
    );
  },

  renderCreateTask: function() {
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
    var redirect = location.origin + this.makeHref(
      'task-new', {}, {taskId: task.get('taskId')}
    );
    href += queryString.stringify({redirect: redirect});
    return <p><a href={href}>Click here to upload file</a></p>;
  },

  renderStartTask: function() {
    var task = this.state.task;
    if (!(task && task.getIn(['meta', 'fileId']))) {
      return null;
    }
    if (task.get('started')) {
      return <p style={{color: 'green'}}>Task started</p>;
    }

    return <p><button onClick={this.handleStartTask}>Start task</button></p>;
  },

  handleStartTask: function(e) {
    var self = this;
    e.preventDefault();
    api.startTask(this.state.task.get('taskId'), function(err, task) {
      if (err) {
        return;
      }
      self.setState({task: task});
    });
  }
});

module.exports = NewTask;
