var debug = require('debug')('app:task:getTask');

function getTask(pub, store) {
  return function(req, res) {
    var taskId = req.params.taskId;
    debug('GET /task/:taskId ' + taskId);

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

      res.send(task.toJS());
    });
  };
}

module.exports = {
  handler: getTask
};
