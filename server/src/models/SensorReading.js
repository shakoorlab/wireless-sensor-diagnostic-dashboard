import mongoose from 'mongoose';

const readingSchema = new mongoose.Schema(
  {
    sensorId: { type: String, index: true },
    ts: Date, // new Date(data._time)

    // flat copy of the API’s data payload; we keep strict:false so new keys slip in
    data: {
      accX: Number,
      accY: Number,
      accZ: Number,
      altitude: Number,
      calibratedCountsVwc_1: Number,
      calibratedCountsVwc_2: Number,
      electricalConductivity_1: Number,
      electricalConductivity_2: Number,
      gasResistanceBme: Number,
      humidityBme: Number,
      lux: Number,
      mVbat: Number,
      mVsolar: Number,
      pressureBme: Number,
      rssi: Number,
      snr: Number,
      temperatureBme: Number,
      temperatureTeros12_1: Number,
      temperatureTeros12_2: Number,
      vwcCount_1: Number,
      vwcCount_2: Number
      /* …err* flags etc… */
    }
  },
  {
    versionKey: false,
    strict: false, // accept unknown keys
    collection: 'sensorreadings' // matches existing TS collection
  }
);

readingSchema.index({ sensorId: 1, ts: -1 });
// MongoDB’s time-series engine keeps its own (sensorId, ts) index.
export default mongoose.model('SensorReading', readingSchema);
