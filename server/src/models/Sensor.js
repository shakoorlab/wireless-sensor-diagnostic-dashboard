// src/models/Sensor.js  (static facts, one doc per sensor)
import mongoose from 'mongoose';

const sensorSchema = new mongoose.Schema(
  {
    externalSensorId: { type: String, unique: true, required: true },
    label: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number] // [lng, lat]
    },
    soilProbesConnected: {
      teros12_1_connected: Boolean,
      teros12_2_connected: Boolean
    },
    battery: {
      batteryVoltage: Number,
      batteryPercent: Number
    },
    lastMeasurement: Date // convenience cache
  },
  { timestamps: true }
);

sensorSchema.index({ 'location.coordinates': '2dsphere' });
export default mongoose.model('Sensor', sensorSchema);
