// DO NOT REMOVE WITHOUT THIS DOCKER CONTAINER WILL NOT AUTOMATICALLY UPDATE THE FRONTEND
const path = require('path');

module.exports = {
  // ... other webpack configurations
  watchOptions: {
    poll: 1000, // Check for changes every second
    aggregateTimeout: 300, // Delay the rebuild after the first change
    ignored: /node_modules/,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
};