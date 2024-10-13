import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { URL_NOT_FOUND } from './constants/error-messages';

dotenv.config();
const PORT = process.env.PORT || 3000;

const app: express.Application = express();
app.use(bodyParser.json()); // To parse JSON bodies

//404 not found
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: URL_NOT_FOUND });
});

const server = app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});

export default server;
