const path = require('path')

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'timestamp.js',
    path: path.resolve(__dirname, '../../../src/public/scripts/plugins'),
    library: {
      name: 'TimeStamp',
      type: 'amd'
    }
  }
}
