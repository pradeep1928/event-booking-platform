import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorMiddleware } from './common/middlware/error.middleware.js';

import routes from './routes/index.js';

const app = express();

app.use(helmet());

app.use(cors());

app.use(compression());

app.use(express.json());

app.use(errorMiddleware);

app.use('/api/v1', routes);


export default app;