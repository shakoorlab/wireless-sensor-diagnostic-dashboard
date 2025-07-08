// src/models/SensorReading.js
import mongoose from 'mongoose';

const readingSchema = new mongoose.Schema(
  {
    sensorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sensor' },
    ts: Date,
    soilSensors: [
      {
        soilMoisture: Number,
        soilTemperature: Number,
        electricalConductivity: Number,
        vwc: Number
      }
    ],
    gasSensor: {
      temperature: Number,
      airPressure: Number,
      humidity: Number,
      gasResistance: Number,
      airQualityIndex: Number
    },
    lux: Number,
    batteryVoltage: Number,
    batteryPercent: Number
  },
  {
    versionKey: false,
    strict: false,
    collection: 'sensorreadings' // MUST match the TS collection you just created
  }
);

// No manual indexes – the TS engine already has (sensorId, ts) behind the scenes
export default mongoose.model('SensorReading', readingSchema);
