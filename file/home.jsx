var React = require('react');
var html = require('./html.jsx');

var Home = React.createClass({
  propTypes: {
    markup: React.PropTypes.string
  },

  render: function() {
    return (
      <div>
        <form method="POST" encType="multipart/form-data">
          <input type="file" name="file" />
          <input type="submit" value="Upload" />
        </form>
      </div>
    );
  }
});

module.exports = {
  handler: function(pub, req, res) {
    res.send(html(Home));
  }
};
