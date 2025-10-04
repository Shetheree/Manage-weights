const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  reps: {
    type: Number,
    default: 1,
    min: 1
  },
  notes: {
    type: String,
    trim: true
  }
});

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  unit: {
    type: String,
    default: 'kg',
    enum: ['kg', 'lbs']
  },
  sets: [setSchema],
  exerciseNotes: {
    type: String,
    trim: true
  }
});

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  exercises: [exerciseSchema],
  notes: {
    type: String,
    trim: true
  },
  workoutType: {
    type: String,
    default: 'General',
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient querying by user and date
workoutSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Workout', workoutSchema); 