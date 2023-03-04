import App from '@/app';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute()]);

app.listen();

process.on('uncaughtException', function (err) {
  console.error(err);
});

process.on('SIGINT', () => {
  process.exit();
});
