#!/usr/bin/env node
import 'dotenv/config';
import connectDB from '../config/db.js';
import Sensor from '../models/Sensor.js';
import SensorReading from '../models/SensorReading.js';
import { getSensorList } from '../services/phenodeAPI.js';
import { fileURLToPath } from 'url';

export default async function ingestOnce() {
  const sensorsArr = await getSensorList();
  if (!Array.isArray(sensorsArr)) throw new Error(`getSensorList() did not return array; got: ${typeof sensorsArr}`);

  console.log(`[Ingest] Fetched ${sensorsArr.length} sensors`);

  await Promise.all(
    sensorsArr.map(async ({ sensorId, label, data }) => {
      const { latitude, longitude, _time, ...metrics } = data || {};
      const lastMeasurement = _time ? new Date(_time) : null;

      /* 1. upsert static Sensor document (string id) */
      const sensorFields = { label, lastMeasurement };
      if (latitude != null && longitude != null && !isNaN(latitude) && !isNaN(longitude)) {
        sensorFields.location = { type: 'Point', coordinates: [longitude, latitude] };
      }

      await Sensor.findOneAndUpdate({ sensorId }, { $set: sensorFields }, { upsert: true, new: false, setDefaultsOnInsert: true });

      /* 2. insert time-series reading (insert-only) */
      if (!lastMeasurement) return;

      const ts = lastMeasurement;
      const exists = await SensorReading.exists({ sensorId, ts });
      if (exists) return; // already stored

      await SensorReading.insertOne({
        sensorId,
        ts,
        ...metrics // rssi, snr, lux, etc.
      });
    })
  );

  console.log('[Ingest] ✅  Finished');
}

/* self-invoke when run directly */
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  (async () => {
    try {
      await connectDB();
      console.log('[ingest.js] Connected to MongoDB');
      await ingestOnce();
      console.log('✅  ingest.js run complete; exiting.');
      process.exit(0);
    } catch (err) {
      console.error('❌  ingest.js run failed:', err);
      process.exit(1);
    }
  })();
}
