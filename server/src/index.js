// src/index.js
import 'dotenv/config'; // load .env
import http from 'http';
import mongoose from 'mongoose';
import app from './app.js';
import env from './config/env.js';
import connectDB from './config/db.js';
import { ensureTimeSeries } from './utils/ensureTimeSeries.js';
// import ingestOnce from './jobs/ingest.js';
// import cron from 'node-cron';

await connectDB();
await ensureTimeSeries(mongoose.connection);

const server = http.createServer(app);
server.listen(env.port, () => {
  console.log(`🚀  API server running on http://localhost:${env.port}`);
});

// ─── schedule hourly ingestion ────────────────────────
// run at HH:07 every hour (to give 5–10min latency buffer)
// cron.schedule('7 * * * *', async () => {
//   console.log('[Cron] Starting hourly ingestion');
//   try {
//     await ingestOnce();
//     console.log('[Cron] ✅  Ingestion complete');
//   } catch (err) {
//     console.error('[Cron] ❌  Ingestion failed:', err);
//   }
// });
