var debug = require('debug')('app:task:postTaskFile');

function postTaskFile(pub, store) {
  return function(req, res) {
    var taskId = req.params.taskId;
    debug('POST /task/:taskId/file ' + taskId);

    store.getTask(taskId, function(err, task) {
      if (err) {
        res.status(500).end();
        return;
      }
      if (!task) {
        res.status(404).send({
          error: {
            name: 'TaskDoesNotExist',
            message: 'No task found for given task id'
          }
        });
        return;
      }
      if (task.getIn(['meta', 'fileId'])) {
        res.status(409).send({
          error: {
            name: 'TaskAlreadyHasFile',
            message: 'Cannot change task file once it has been set'
          }
        });
        return;
      }

      var fileId = req.body.fileId;
      store.setTaskFile(taskId, fileId, function(err, task) {
        if (err) {
          res.status(500).end();
          return;
        }
        res.send(task.toJS());
      });
    });
  };
}

module.exports = {
  handler: postTaskFile
};
