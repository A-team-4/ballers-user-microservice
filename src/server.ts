import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction} from 'express';
import bodyParser from 'body-parser';

dotenv.config();
const PORT = process.env.PORT || 3000;


const app: express.Application = express();
app.use(bodyParser.json());  // To parse JSON bodies



//404 not found
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: "URL not found" });
});

const server = app.listen(PORT, () => {console.log(`Listening on PORT: ${PORT}`)});



export default server;