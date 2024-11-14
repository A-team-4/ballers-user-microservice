import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { URL_NOT_FOUND } from './constants/contants';
import { countryRoute } from './routes/country-routes';
import { stateRoute } from './routes/state-routes';
import { positionTypeRoute } from './routes/position-types';

const app: express.Application = express();
app.use(bodyParser.json()); // To parse JSON bodies
app.use('/api', countryRoute());
app.use('/api', stateRoute());
app.use('/api', positionTypeRoute());

//404 not found
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: URL_NOT_FOUND });
});

export default app;
