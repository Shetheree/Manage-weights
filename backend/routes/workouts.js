const express = require('express');
const Workout = require('../models/Workout');
const auth = require('../Middleware/auth');

const router = express.Router();

// Get all workouts for a user (most recent first)
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(50); // Limit to last 50 workouts for performance
    
    res.json(workouts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single workout by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get workouts by date range
router.get('/range', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    console.log('Range query received:', { startDate, endDate, userId: req.user._id });
    
    const query = { user: req.user._id };
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      console.log('Date range:', { start: start.toISOString(), end: end.toISOString() });
      
      query.date = {
        $gte: start,
        $lte: end
      };
    }

    console.log('Final query:', JSON.stringify(query, null, 2));
    const workouts = await Workout.find(query)
      .sort({ date: -1 });
    
    console.log('Found workouts:', workouts.length);
    workouts.forEach(workout => {
      console.log(`Workout ${workout._id}: date=${workout.date.toISOString()}`);
    });
    
    res.json(workouts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new workout
router.post('/', auth, async (req, res) => {
  try {
    const { exercises, notes, workoutType, date } = req.body;

    console.log('Creating workout with date:', date);
    const workoutDate = date ? new Date(date) : new Date();
    console.log('Parsed workout date:', workoutDate.toISOString());

    const workout = new Workout({
      user: req.user._id,
      exercises,
      notes,
      workoutType,
      date: workoutDate
    });

    await workout.save();
    console.log('Workout saved with date:', workout.date.toISOString());
    res.status(201).json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update workout
router.put('/:id', auth, async (req, res) => {
  try {
    const { exercises, notes, workoutType, date } = req.body;
    
    const updateData = { exercises, notes, workoutType };
    if (date) {
      updateData.date = new Date(date);
    }
    
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete workout
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json({ message: 'Workout deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get workout statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const { exerciseName, days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const query = {
      user: req.user._id,
      date: { $gte: startDate }
    };

    if (exerciseName) {
      query['exercises.name'] = { $regex: exerciseName, $options: 'i' };
    }

    const workouts = await Workout.find(query).sort({ date: 1 });

    // Calculate progress for each exercise
    const exerciseStats = {};
    
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        const name = exercise.name.toLowerCase();
        if (!exerciseStats[name]) {
          exerciseStats[name] = [];
        }
        exerciseStats[name].push({
          date: workout.date,
          weight: exercise.weight,
          sets: exercise.sets,
          reps: exercise.reps
        });
      });
    });

    res.json(exerciseStats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 