var lang = require('../lang');
var debug = require('debug')('app:transform:eventHandler');
var Api = require('../lib/Api');

var api = new Api({host: 'http://localhost:3000'});

function eventsIn() {
  return [
    lang.TaskStarted
  ];
}

function eventsOut() {
  return [
    lang.RawDataRejected,
    lang.RawDataValidated
  ];
}

var transforms = {
  'file-rev-pos': require('./fileRevPos')(api)
};

function handler(options) {
  var blob = options.blob;

  return function(pub, store) {
    return function(event) {
      var transform;
      if (event instanceof lang.TaskStarted) {
        debug('handle ' + event.get('eventType') + ' ' + event.get('eventId'));
        transform = transforms[event.get('taskType')];
      }

      if (transform) {
        var taskMeta = event.get('taskMeta');
        // TODO: Beware traveller, thou art entering callback hell
        transform.getData(taskMeta, function(err, rawData) {
          if (err) {
            debug('ERROR' + err);
            return;
          }
          transform.validate(rawData, function(err, result) {
            if (err) {
              debug('ERROR' + err);
              return;
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

            transform.parse(rawData, function(err, parsedData) {
              if (err) {
                debug('ERROR' + err);
                return;
              }

              // HACK: Bus using EventEmitter but not guaranteeing order
              // of events ("parsed" is received before "validated" by history)
              setTimeout(function() {
                pub('app', new lang.RawDataParsed({
                  eventId: lang.newEventId(),
                  taskId: event.get('taskId'),
                  recordCount: parsedData.count()
                }));
              }, 0);

              transform.identify(taskMeta, parsedData, function(err, identifiedData) {
                if (err) {
                  debug('ERROR' + err);
                  return;
                }

                setTimeout(function() {
                  pub('app', new lang.DataRecordsIdentified({
                    eventId: lang.newEventId(),
                    taskId: event.get('taskId')
                  }));
                }, 0);

                transform.translate(taskMeta, identifiedData, function(err, translatedData) {
                  if (err) {
                    debug('ERROR' + err);
                    return;
                  }

                  setTimeout(function() {
                    pub('app', new lang.DataRecordsTranslated({
                      eventId: lang.newEventId(),
                      taskId: event.get('taskId')
                    }));
                  }, 0);

                  var blobId = lang.newBlobId();
                  blob.write(blobId, translatedData, function(err) {
                    if (err) {
                      debug('ERROR' + err);
                      return;
                    }

                    setTimeout(function() {
                      pub('app', new lang.TransformCompleted({
                        eventId: lang.newEventId(),
                        taskId: event.get('taskId'),
                        blobId: blobId
                      }));
                    }, 0);
                  });
                });
              });
            });
          });
        });
      }
    };
  };
}

module.exports = function(options) {
  return {
    handler: handler(options),
    eventsIn: eventsIn,
    eventsOut: eventsOut
  };
};
