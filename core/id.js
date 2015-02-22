var uuid = require('uuid');

function newId() {
  return uuid();
}

module.exports = {
  newId: newId
};
