import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

// Import from files
import { errorHandler } from './common/middlware/error.middleware.js';
import { notFoundHandler } from './common/middlware/not-found.middleware.js';
import { requestIdMiddleware } from './common/middlware/request-id.middleware.js';
import { loggerMiddleware } from './common/middlware/logger.middleware.js';

import routes from './routes/index.js';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());

app.use(cors());

app.use(compression());

app.use(express.json());

app.use(cookieParser());

// API routes
app.use('/api/v1', routes);

app.use(requestIdMiddleware);
app.use(loggerMiddleware);

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Error handler (must be after all routes and middlewares)
app.use(errorHandler);


export default app;