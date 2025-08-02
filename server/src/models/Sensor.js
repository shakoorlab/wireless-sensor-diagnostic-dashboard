// server/src/models/Sensor.js
import mongoose from 'mongoose';

const sensorSchema = new mongoose.Schema(
  {
    sensorId: { type: String, unique: true, required: true }, // "WS-abc…"
    label: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number] // [lng, lat]
    },
    lastMeasurement: Date
  },
  { timestamps: true }
);

sensorSchema.index({ 'location.coordinates': '2dsphere' });
export default mongoose.model('Sensor', sensorSchema);
