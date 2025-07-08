// injest.js script for one-time ingestion of sensor data from Phenode API
// This script connects to the MongoDB, fetches sensor data from the Phenode API,
// and stores it in the Sensor and SensorReading collections.
// It can be run manually or scheduled via cron.
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
    sensorsArr.map(async (raw) => {
      const { externalSensorId, label, location, soilProbesConnected, battery, lastMeasurement, soilSensors, gasSensor, lux } = raw;

      /* ───── 1) upsert static “Sensor” doc ───────────────────────────── */
      const fields = {
        label,
        soilProbesConnected,
        battery,
        lastMeasurement,
        latestReadingSummary: {
          lux,
          batteryPercent: battery?.batteryPercent
        }
      };

      if (location && location.latitude != null && location.longitude != null && !isNaN(location.latitude) && !isNaN(location.longitude)) {
        fields.location = {
          type: 'Point',
          coordinates: [location.longitude, location.latitude]
        };
      }

      const sensorDoc = await Sensor.findOneAndUpdate(
        { externalSensorId },
        { $set: fields },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      /* ───── 2) append to SensorReading time-series (insert-only) ────── */
      if (!lastMeasurement) return; // nothing to store

      const ts = new Date(lastMeasurement);

      // Fast existence check; uses meta (sensorId) + time index automatically
      const exists = await SensorReading.exists({ sensorId: sensorDoc._id, ts });
      if (exists) return; // already have this hour’s row

      await SensorReading.insertOne({
        sensorId: sensorDoc._id,
        ts,
        soilSensors,
        gasSensor,
        lux,
        batteryVoltage: battery?.batteryVoltage,
        batteryPercent: battery?.batteryPercent
      });
    })
  );

  console.log('[Ingest] ✅  Finished');
}

/* ─── self-invoke when run directly ───────────────────────────────── */
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
