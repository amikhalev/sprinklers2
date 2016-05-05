import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpack from 'webpack';

export default app => {
  let webpackConfig = require('../../webpack.dev.config');
  var compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, webpackConfig.webpackDevMiddleware));
  app.use(webpackHotMiddleware(compiler));
}