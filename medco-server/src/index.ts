import * as express from 'express';
import { Request, Response } from 'express';
import * as http from 'http';
import { Server } from 'http';
import debugMod from 'debug';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as helmet from 'helmet';
import routes from './Routes/routes';
import { logger } from './Utils/logger';
import { config } from '../config';

const debug = debugMod('api');
// const error = debugMod('err:api');

const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
const port: number = config.port;

const server: Server = http.createServer(app);

// Health Endpoint
app.get('/health', (req: Request, res: Response) => {
  debug('Health is called');
  res.send(`I'm Working`);
});

// app.post('/signup', );(req: Request, res: Response) => {
//   const user: IUser = req.body.user;
//   debug('user', user);
//   const validationError = isSignUpFormValid(user);
//   if (validationError) {
//     return res.send(validationError);
//   } else {
//     res.send({ user: user.username });
//   }
// });

app.use('/', routes);

server.listen(config.port, () => {
  logger.info(`server listening on port: ${config.port}`);
  return debug(`server is listening on ${port}`);
});
