import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpack from 'webpack';

let webpackConfig = require('../../webpack.dev.config');

webpackConfig.entry.unshift('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000');

export default app => {
  var compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, webpackConfig.webpackDevMiddleware));
  app.use(webpackHotMiddleware(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 100
  }));
}