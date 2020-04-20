import express, { Request, Response, Application, NextFunction  } from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import nunjucks from 'nunjucks';
import apicache from 'apicache';
import compression from 'compression';
import errorHandler from 'errorhandler';

import events from './routes/events';
import clearCache from './routes/cache';

const app: Application = express();
const cache = apicache.middleware;

const env: string = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env === 'development';

app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'nunjucks');
nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(req.url);
  
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return next();
});

app.use(cache('1 day', (req: Request) => (
  req.method === 'GET' && !req.headers.authorization
)));

app.use('/events', events);
app.use('/cache', clearCache);

/// error handler
if (app.get('env') === 'development') { app.use(errorHandler()); }

app.set('port', process.env.PORT || 3040);
app.set('ipaddress', process.env.IP_ADDRESS || '0.0.0.0');

export default app.listen(app.get('port'), app.get('ipaddress'), () => {
  // tslint:disable-next-line:no-console
  console.log(
    `Express server listening on port ${app.get('ipaddress')}:${app.get('port')}`,
  );
});
