// src/utils/ensureTimeSeries.js
export async function ensureTimeSeries(connection) {
  const name = 'sensorreadings';
  const exists = await connection.db.listCollections({ name }).hasNext(); // true if the collection is already there

  if (!exists) {
    await connection.db.createCollection(name, {
      timeseries: {
        timeField: 'ts', // required
        metaField: 'sensorId', // required
        granularity: 'hours' // optional but nice-to-have
      },
      expireAfterSeconds: 60 * 60 * 24 * 180 // TTL = 180 days
    });
    console.log(`[setup] time-series collection '${name}' created`);
  }
}
