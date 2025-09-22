const port = 9527;

const chalk = require('chalk');
const connect = require('connect');
const serveStatic = require('serve-static');
const app = connect();

app.use(
  serveStatic('./dist', {
    index: ['index.html', '/'],
    open:true,
    setHeaders(res) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      res.setHeader('Pragma', 'no-cache')
      res.setHeader('Expires', '0')
      res.setHeader('Surrogate-Control', 'no-store')
    }
  })
);

app.listen(port, function() {
  console.log(chalk.green(`> Preview at  http://localhost:${port}`));
});
