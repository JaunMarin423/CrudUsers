const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');
const { IgnorePlugin } = require('webpack');

module.exports = {
  context: __dirname,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  devtool: slsw.lib.webpack.isLocal ? 'eval-cheap-module-source-map' : 'source-map',
  resolve: {
    extensions: ['.mjs', '.json', '.ts'],
    symlinks: false,
    cacheWithContext: false,
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  optimization: {
    concatenateModules: false,
    minimize: false,
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: [
          [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '.serverless'),
            path.resolve(__dirname, '.webpack'),
          ],
        ],
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      },
    ],
  },
  plugins: [
    // Copy files that don't need processing
    new CopyPlugin({
      patterns: [
        { from: '.env*', to: '.' },
        { from: 'package.json', to: '.' },
        { from: 'yarn.lock', to: '.' },
      ],
    }),
    // Ignore specific modules that cause issues with webpack
    new IgnorePlugin({
      resourceRegExp: /^pg-native$/,
    }),
  ],
  // Fix for AWS SDK
  externals: {
    // These modules are already installed on the Lambda instance
    'aws-sdk': 'aws-sdk',
    // These modules are provided by the Lambda runtime
    'awslink': 'awslink',
    'dynamodb-doc': 'dynamodb-doc',
    'imagemagick': 'imagemagick',
    'kerberos': 'kerberos',
    'mariasql': 'mariasql',
    'mongodb': 'mongodb',
    'mysql': 'mysql',
    'oracle': 'oracle',
    'pg-query-stream': 'pg-query-stream',
    'sqlite3': 'sqlite3',
    'tedious': 'tedious',
  },
  // Performance settings
  performance: {
    // Disable size warnings for entry points
    hints: false,
  },
};
