// src/controllers/metrics.js
import Sensor from '../models/Sensor.js';
import SensorReading from '../models/SensorReading.js';
import { startOfDay, addHours, differenceInHours } from 'date-fns';
import { tz } from '@date-fns/tz';

// -----------------------------|| SELECTED FIELD METRICS CONTROLLER ||------------------------------ //

// ------------------------------ Hourly Status ------------------------------ //
// This controller fetches the hourly status of all sensor heads over the past N hours (default 23 to cover today).
// It returns a table with sensorId, name, and columns h00..h23.
// Each cell contains either "Reported", "Pending", or "No Data"
// The frontend polls this endpoint every hour to keep the data fresh.
export async function getHourlyStatus(req, res, next) {
  try {
    const TZ = req.query.tz || 'America/Chicago';
    const hours = 23;

    const nowUtc = new Date();

    // Local midnight (TZ) → UTC instant (Date)
    const fromUtcInstant = startOfDay(nowUtc, { in: tz(TZ) });
    const fromUtc = typeof fromUtcInstant.toDate === 'function' ? fromUtcInstant.toDate() : new Date(fromUtcInstant);

    // Current local hour & minute (robust, DST-safe)
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: TZ,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).formatToParts(nowUtc);
    const currentHourLocal = Number(parts.find((p) => p.type === 'hour')?.value ?? '0'); // 0..23
    const currentMinuteLocal = Number(parts.find((p) => p.type === 'minute')?.value ?? '0'); // 0..59

    // Mark the current hour as Pending until ingestion+buffer has elapsed.
    // Default 15 min; allow override via env or query (?pendingCutoffMin=20)
    const PENDING_CUTOFF_MIN = Number(req.query.pendingCutoffMin ?? process.env.PENDING_CUTOFF_MIN ?? 15);

    // Fetch
    const sensors = await Sensor.find().select('sensorId label').lean();
    const readings = await SensorReading.find({ ts: { $gte: fromUtc } })
      .select('sensorId ts')
      .lean();

    // Build: sensorId -> Set(hourIndex)
    const statusMap = new Map();
    for (const r of readings) {
      const idx = differenceInHours(new Date(r.ts), fromUtc);
      if (idx >= 0 && idx <= hours) {
        if (!statusMap.has(r.sensorId)) statusMap.set(r.sensorId, new Set());
        statusMap.get(r.sensorId).add(idx);
      }
    }

    // Build table rows h00..h23
    const rows = sensors.map((s) => {
      const row = { sensorId: s.sensorId, name: s.label || s.sensorId };

      for (let i = 0; i <= hours; i++) {
        const col = `h${i.toString().padStart(2, '0')}`;

        // Future hours are always Pending
        if (i > currentHourLocal) {
          row[col] = 'Pending';
          continue;
        }

        // Current hour is always Pending (we won't finalize it until next hour's job runs)
        if (i === currentHourLocal) {
          row[col] = 'Pending';
          continue;
        }

        // Previous hour stays Pending until cutoff minute (e.g., H:15) when the H:10 job + buffer
        // should have finished. After cutoff, finalize as Reported/No Data.
        if (i === currentHourLocal - 1 && currentMinuteLocal < PENDING_CUTOFF_MIN) {
          row[col] = 'Pending';
          continue;
        }

        // All earlier hours (<= H-2) — or previous hour after cutoff — finalize based on data presence
        row[col] = statusMap.get(s.sensorId)?.has(i) ? 'Reported' : 'No Data';
      }

      return row;
    });

    res.json(rows);

    // (optional debug while testing)
    // console.log({ TZ, fromUtc: fromUtc.toISOString(), currentHourLocal, currentMinuteLocal, PENDING_CUTOFF_MIN });
  } catch (err) {
    next(err);
  }
}
//
//
//
// ------------------------------ Weekly Status ------------------------------ //
// This controller fetches the weekly summary status of all sensor heads for the current week (Sun-Sat).
// It returns a table with sensorId, name, and columns d00..d06.
// Each cell contains the number of unique reporting hours for that day (0..23) or "Pending" for future days.
export async function getWeeklyStatus(req, res, next) {
  try {
    const TZ = req.query.tz || 'America/Chicago';
    const nowUtc = new Date();

    // Local midnight (today) as a real UTC Date
    const todayMidInstant = startOfDay(nowUtc, { in: tz(TZ) });
    const todayMidUtc = typeof todayMidInstant.toDate === 'function' ? todayMidInstant.toDate() : new Date(todayMidInstant);

    // Current local weekday index: 0=Sun..6=Sat
    const weekdayShort = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short' }).format(nowUtc);
    const dowIdx = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[weekdayShort] ?? 0;

    // Week start = Sunday 00:00 local (UTC instant)
    const weekStartUtc = addHours(todayMidUtc, -24 * dowIdx);
    const weekEndUtc = addHours(weekStartUtc, 7 * 24);

    // Current local day index in the week (0..6)
    const currentDayIdx = dowIdx;

    // Preload sensors
    const sensors = await Sensor.find().select('sensorId label').lean();

    // Aggregate readings into unique local hours, then counts per local day per sensor
    const TZ_NAME = TZ; // used inside $dateTrunc
    const agg = await SensorReading.aggregate([
      { $match: { ts: { $gte: weekStartUtc, $lt: weekEndUtc } } },
      {
        $project: {
          sensorId: 1,
          hourLocal: { $dateTrunc: { date: '$ts', unit: 'hour', timezone: TZ_NAME } },
          dayLocal: { $dateTrunc: { date: '$ts', unit: 'day', timezone: TZ_NAME } }
        }
      },
      // de-dupe hours (if multiple docs landed in the same hour)
      { $group: { _id: { sensorId: '$sensorId', hourLocal: '$hourLocal', dayLocal: '$dayLocal' } } },
      // count hours per day per sensor
      { $group: { _id: { sensorId: '$_id.sensorId', dayLocal: '$_id.dayLocal' }, hours: { $sum: 1 } } },
      {
        $project: {
          _id: 0,
          sensorId: '$_id.sensorId',
          dayLocal: '$_id.dayLocal',
          hours: 1
        }
      }
    ]);

    // Index counts: sensorId -> dayIdx -> hours
    const countsMap = new Map(); // sensorId -> Map(dayIdx -> hours)
    for (const { sensorId, dayLocal, hours } of agg) {
      const dayIdx = Math.floor(differenceInHours(dayLocal, weekStartUtc) / 24); // 0..6
      if (dayIdx < 0 || dayIdx > 6) continue;
      if (!countsMap.has(sensorId)) countsMap.set(sensorId, new Map());
      countsMap.get(sensorId).set(dayIdx, hours);
    }

    // Build rows: { sensorId, name, d00..d06 }
    const rows = sensors.map((s) => {
      const row = { sensorId: s.sensorId, name: s.label || s.sensorId };
      const dayCounts = countsMap.get(s.sensorId);

      for (let i = 0; i < 7; i++) {
        const key = `d${String(i).padStart(2, '0')}`;
        if (i > currentDayIdx) {
          row[key] = 'Pending'; // future day in this week
        } else {
          // number of unique reporting hours for that day (0..23)
          const c = dayCounts?.get(i) ?? 0;
          row[key] = c; // keep as number; the client will render chips/labels by thresholds
        }
      }
      return row;
    });

    res.json({
      rows,
      meta: {
        tz: TZ,
        weekStartUtc: weekStartUtc.toISOString(),
        weekEndUtc: weekEndUtc.toISOString(),
        currentDayIdx: currentDayIdx
      }
    });
  } catch (err) {
    next(err);
  }
}
