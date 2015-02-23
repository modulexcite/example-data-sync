var React = require('react');

var Html = React.createClass({
  propTypes: {
    markup: React.PropTypes.string
  },

  render: function() {
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>File Upload | Data Sync</title>
          <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        </head>
        <body dangerouslySetInnerHTML={{__html: this.props.markup}}></body>
      </html>
    );
  }
});

module.exports = function(component) {
  return React.renderToStaticMarkup(React.createElement(Html, {
    markup: React.renderToString(React.createElement(component))
  }));
};
