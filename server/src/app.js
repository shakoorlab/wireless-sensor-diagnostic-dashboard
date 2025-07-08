// Express app instance

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
// import sensorsRouter from './routes/sensors.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// ────────────────────────── middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' })); // adjust for prod
app.use(morgan('dev'));

// ────────────────────────── routes
// app.get("/api/health", (req, res) => res.json({ status: "ok" }));
// app.use("/api/sensors", sensorsRouter);

// ────────────────────────── error handler
app.use(errorHandler);

export default app;
