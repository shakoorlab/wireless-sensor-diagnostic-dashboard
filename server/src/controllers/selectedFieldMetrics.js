// src/controllers/metrics.js
import Sensor from '../models/Sensor.js';
import SensorReading from '../models/SensorReading.js';
import { startOfHour, subHours } from 'date-fns';

/* ---- 1. Pie‑chart summary ------------------------------------------- */
// export async function getReportingSummary(req, res, next) {
//   const oneHourAgo = subHours(startOfHour(new Date()), 1);
//   const [total, reporting] = await Promise.all([
//     Sensor.estimatedDocumentCount(),
//     Sensor.countDocuments({ lastMeasurement: { $gte: oneHourAgo } })
//   ]);
//   res.json({ total, reporting, notReporting: total - reporting });
// }

/* ---- 2. Inactive list (2h+, 4h+) ------------------------------------ */
// export async function getInactiveSensors(req, res, next) {
//   const twoHoursAgo = subHours(startOfHour(new Date()), 2);
//   const rows = await Sensor.find({ lastMeasurement: { $lt: twoHoursAgo } })
//     .select('externalSensorId label lastMeasurement')
//     .lean();

//   const result = rows.map((s) => {
//     const hrs = Math.floor((Date.now() - new Date(s.lastMeasurement || 0)) / 36e5); // ms → h
//     return {
//       id: s.externalSensorId,
//       label: s.label,
//       hoursAgo: hrs,
//       severity: hrs >= 4 ? 'error' : 'warning'
//     };
//   });

//   res.json(result);
// }

/* ---- 3. Hourly status table ----------------------------------------- */
export async function getHourlyStatus(req, res, next) {
  // default last 23 hours (midnight view)
  const hours = Math.min(parseInt(req.query.hours || '23', 10), 47);
  const from = subHours(startOfHour(new Date()), hours);
  const sensors = await Sensor.find().select('externalSensorId label').lean();

  // fetch all readings in one shot
  const readings = await SensorReading.find({ ts: { $gte: from } })
    .select('sensorId ts')
    .lean();

  // bucket readings by sensorId+hour
  const statusMap = new Map(); // key -> Set(hourIdx)
  readings.forEach((r) => {
    const hourIdx = Math.floor((r.ts - from) / 36e5); // 0..hours
    const key = r.sensorId.toString();
    if (!statusMap.has(key)) statusMap.set(key, new Set());
    statusMap.get(key).add(hourIdx);
  });

  // build table rows
  const rows = sensors.map((s) => {
    const row = { name: s.label };
    for (let i = 0; i <= hours; i++) {
      const col = `h${i.toString().padStart(2, '0')}`;
      if (i > (Date.now() - from) / 36e5) {
        row[col] = 'Pending';
      } else if (statusMap.get(s._id.toString())?.has(i)) {
        row[col] = 'Reported';
      } else {
        row[col] = 'No Data';
      }
    }
    return row;
  });

  res.json(rows);
}
