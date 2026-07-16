import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';

import apiRoutes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { globalLimiter } from './middleware/rateLimiter.js';

const app = express();

// --- Security & performance middleware ---
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());
app.use(mongoSanitize()); // strips $ and . operators from user input to block NoSQL injection
app.use(globalLimiter);

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/health', (_req, res) => res.status(200).json({ status: 'ok', uptime: process.uptime() }));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});
app.use('/api/v1', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
