import Sensor from '../models/Sensor.js';

// GET /api/sensors  → returns sensor docs **plus** a `latestReading` sub-doc
export async function listSensors(req, res, next) {
  try {
    const sensors = await Sensor.aggregate([
      {
        $lookup: {
          from: 'measurements',
          let: { sid: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$sensorId', '$$sid'] } } },
            { $sort: { ts: -1 } },
            { $limit: 1 },
            {
              $project: { _id: 0, ts: 1, soilSensors: 1, gasSensor: 1, lux: 1 }
            }
          ],
          as: 'latestReading'
        }
      },
      {
        $addFields: { latestReading: { $arrayElemAt: ['$latestReading', 0] } }
      },
      { $project: { __v: 0 } }
    ]);

    res.json(sensors);
  } catch (err) {
    next(err);
  }
}
