var path = require('path');

var config = {
  entry: {
    app: './app/main.jsx'
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {test: /\.jsx$/, loader: 'jsx'}
    ]
  }
};

module.exports = config;
