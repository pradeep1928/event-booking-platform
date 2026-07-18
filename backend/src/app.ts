import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorMiddleware } from './common/middlware/error.middleware.js';
import { notFoundMiddleware } from './common/middlware/not-found.middleware.js';
import { requestIdMiddleware } from './common/middlware/request-id.middleware.js';
import { loggerMiddleware } from './common/middlware/logger.middleware.js';

import routes from './routes/index.js';

const app = express();

app.use(helmet());

app.use(cors());

app.use(compression());

app.use(express.json());


app.use('/api/v1', routes);

app.use(requestIdMiddleware);

app.use(loggerMiddleware);
app.use(notFoundMiddleware);
app.use(errorMiddleware);


export default app;