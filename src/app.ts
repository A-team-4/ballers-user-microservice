import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { URL_NOT_FOUND } from './constants/error-messages';

const app: express.Application = express();
app.use(bodyParser.json()); // To parse JSON bodies

//404 not found
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: URL_NOT_FOUND });
});

export default app;
