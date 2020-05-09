import express from 'express';
import http, { Server } from 'http';
import * as uuid from 'uuid';
import debugMod from 'debug';

const debug = debugMod('api');
const error = debugMod('err:api');

const app = express();
const port: string = process.env.PORT || '8080';

const server: Server = http.createServer(app);

// Health Endpoint
app.get('/health', (req, res) => {
  debug('Health is called');
  res.send(`I'm Working`);
});

server.listen(port, () => {
  return debug(`server is listening on ${port}`);
});
