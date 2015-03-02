var Immutable = require('immutable');
var lang = require('../lang');
var debug = require('debug')('app:transform:eventHandler');
var Api = require('../lib/Api');

var api = new Api({host: 'http://localhost:3000'});

function events() {
  return [
    lang.TaskStarted
  ];
}

var transforms = {
  'file-rev-pos': {
    getData: function(taskMeta, cb) {
      api.getFile(taskMeta.get('fileId'), cb);
    },

    validate: function(data, cb) {
      if (!data) {
        cb(null, Immutable.fromJS({
          isValid: false,
          reason: {
            name: 'EmptyData',
            message: 'Raw data is empty'
          }
        }));
        return;
      }

      var hasHeader = data.match(
        /^transaction_id,datetime,customer_id,payment/
      );
      if (!hasHeader) {
        cb(null, Immutable.fromJS({
          isValid: false,
          reason: {
            name: 'NoHeaderFound',
            message: 'Expected first line to be "transaction_id,datetime,customer_id,payment"'
          }
        }));
        return;
      }

      cb(null, Immutable.Map({isValid: true}));
    }
  }
};

function handler(pub, store) {
  return function(event) {
    var transform;
    if (event instanceof lang.TaskStarted) {
      debug('handle ' + event.get('eventType') + ' ' + JSON.stringify(event.toJS()));
      transform = transforms[event.get('taskType')];
    }

    if (transform) {
      transform.getData(event.get('taskMeta'), function(err, data) {
        if (err) {
          debug('ERROR' + err);
          return;
        }
        transform.validate(data, function(err, result) {
          if (err) {
            debug('ERROR' + err);
          }

          if (!result.get('isValid')) {
            pub('app', new lang.RawDataRejected({
              eventId: lang.newEventId(),
              taskId: event.get('taskId'),
              reasonName: result.getIn(['reason', 'name']),
              reasonMessage: result.getIn(['reason', 'message'])
            }));
            return;
          }

          pub('app', new lang.RawDataValidated({
            eventId: lang.newEventId(),
            taskId: event.get('taskId')
          }));
        });
      });
    }
  };
}

module.exports = {
  handler: handler,
  events: events
};
