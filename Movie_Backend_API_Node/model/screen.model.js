const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  theatreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  seatCapacity: {
    type: Number,
    required: true,
    min: 1
  },
  screenType: {
    type: String,
    enum: ['STANDARD', 'IMAX', '4DX', 'DOLBY', 'PREMIUM'],
    default: 'STANDARD'
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  }
}, { timestamps: true });

screenSchema.index({ theatreId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Screen', screenSchema);
