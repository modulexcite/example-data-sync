var React = require('react');
var Immutable = require('immutable');
var api = require('../api');

var InfoMapping = {
  'file-rev-pos': function(task) {
    var meta = task.get('meta');
    return Immutable.Map({
      name: 'Data file for Rev POS',
      description: meta.get('posName') + ' (' + meta.get('posId') + ')'
    });
  }
};

var StatusMapping = {
  pending: {
    text: 'Pending',
    color: 'orange'
  },
  running: {
    text: 'Running...',
    color: 'blue'
  },
  failed: {
    text: 'Failed',
    color: 'red'
  },
  completed: {
    text: 'Completed',
    color: 'green'
  }
};

var TaskHistory = React.createClass({
  getInitialState: function() {
    return {
      history: Immutable.List()
    };
  },

  componentWillMount: function() {
    this.handleRefresh();
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return !Immutable.is(this.state.history, nextState.history);
  },

  render: function() {
    var taskNodes = this.state.history.map(this.renderTask).toJS();

    return (
      <div>
        <h1>Sync task history</h1>
        <p><button onClick={this.handleRefresh}>Refresh</button></p>
        {taskNodes}
      </div>
    );
  },

  renderTask: function(task) {
    var info = InfoMapping[task.get('type')];
    if (!info) {
      return <p>Unknown task</p>;
    } else {
      info = info(task);
    }

    var status = StatusMapping[task.get('status')];

    return (
      <div key={task.get('taskId')}>
        <div><strong>{info.get('name')}</strong></div>
        <div>
          <span>Status: </span>
          <strong style={{color: status.color}}>{status.text}</strong>
        </div>
        {this.renderTaskErrorMessage(task)}
        <div>{info.get('description')}</div>
        <div>
          {'Last updated on: ' + task.get('history').first().get('timestamp')}
        </div>
        <div>{'Task ID: ' + task.get('taskId')}</div>
        {this.renderTaskFile(task)}
        <br/>
      </div>
    );
  },

  renderTaskErrorMessage: function(task) {
    var message = task.get('reasonMessage');
    if (!message) {
      return null;
    }

    return (
      <div>
        {'Error message: '}
        <span style={{color: 'red'}}>{message}</span>
      </div>
    );
  },

  renderTaskFile: function(task) {
    var fileId = task.getIn(['meta', 'fileId']);
    if (!fileId) {
      return null;
    }
    var href = 'http://localhost:3000/file/' + fileId;
    return (
      <div>
        <a href={href} target="_blank">Download raw data file</a>
      </div>
    );
  },

  handleRefresh: function(e) {
    if (e) {
      e.preventDefault();
    }
    var self = this;
    api.getTaskHistory(function(err, history) {
      if (err) {
        return;
      }
      self.setState({history: history});
    });
  }
});

module.exports = TaskHistory;