// Express app instance
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';

// error handling
import metricsRoutes from './routes/selectedFieldMetrics.js';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// ---- attach a request ID to every request (for log correlation)
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || uuidv4();
  res.setHeader('X-Request-Id', req.id);
  next();
});

// ---- morgan logs include request id
morgan.token('id', (req) => req.id);

const allowed = [
  'http://localhost:5173', // Vite dev
  'http://localhost:3000', // alt local
  'https://shakoorsensors.cloud', // Netlify prod
  'https://www.shakoorsensors.cloud',
  'https://api.shakoorsensors.cloud'
];

// ────────────────────────── middleware
app.use(express.json());
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // curl/postman
      cb(null, allowed.includes(origin));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    credentials: false
  })
);
app.use(morgan(':id :method :url :status :response-time ms - :res[content-length]'));

// ────────────────────────── routes
app.get('/health', (_req, res) => res.status(200).send('OK'));
app.use('/api/metrics', metricsRoutes);

// (optional) quick manual test for the error handler
// app.get('/__error-test', (_req, _res) => { throw new Error('Boom'); });

// ────────────────────────── 404 and error handlers (MUST be last)
app.use(notFound);
app.use(errorHandler);

export default app;
