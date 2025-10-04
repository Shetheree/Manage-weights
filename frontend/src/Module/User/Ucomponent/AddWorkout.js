import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { 
  FaPlus, 
  FaTrash, 
  FaDumbbell, 
  FaArrowLeft,
  FaSave
} from 'react-icons/fa';
import axios from 'axios';
import './AddWorkout.css';

const AddWorkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [workoutData, setWorkoutData] = useState({
    workoutType: 'General',
    notes: '',
    date: new Date().toISOString().split('T')[0], // Default to today's date
    exercises: [
      {
        name: '',
        unit: 'kg',
        sets: [
          {
            weight: '',
            reps: 1,
            notes: ''
          }
        ],
        exerciseNotes: ''
      }
    ]
  });

  const addExercise = () => {
    setWorkoutData({
      ...workoutData,
      exercises: [
        ...workoutData.exercises,
        {
          name: '',
          unit: 'kg',
          sets: [
            {
              weight: '',
              reps: 1,
              notes: ''
            }
          ],
          exerciseNotes: ''
        }
      ]
    });
  };

  const removeExercise = (index) => {
    if (workoutData.exercises.length > 1) {
      const newExercises = workoutData.exercises.filter((_, i) => i !== index);
      setWorkoutData({
        ...workoutData,
        exercises: newExercises
      });
    }
  };

  const updateExercise = (index, field, value) => {
    const newExercises = [...workoutData.exercises];
    newExercises[index] = {
      ...newExercises[index],
      [field]: value
    };
    setWorkoutData({
      ...workoutData,
      exercises: newExercises
    });
  };

  const addSet = (exerciseIndex) => {
    const newExercises = [...workoutData.exercises];
    newExercises[exerciseIndex].sets.push({
      weight: '',
      reps: 1,
      notes: ''
    });
    setWorkoutData({
      ...workoutData,
      exercises: newExercises
    });
  };

  const removeSet = (exerciseIndex, setIndex) => {
    const newExercises = [...workoutData.exercises];
    if (newExercises[exerciseIndex].sets.length > 1) {
      newExercises[exerciseIndex].sets.splice(setIndex, 1);
      setWorkoutData({
        ...workoutData,
        exercises: newExercises
      });
    }
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    const newExercises = [...workoutData.exercises];
    newExercises[exerciseIndex].sets[setIndex] = {
      ...newExercises[exerciseIndex].sets[setIndex],
      [field]: value
    };
    setWorkoutData({
      ...workoutData,
      exercises: newExercises
    });
  };

  const handleDateChange = (e) => {
    setWorkoutData({
      ...workoutData,
      date: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate exercises
    const validExercises = workoutData.exercises.filter(exercise => 
      exercise.name.trim() && exercise.sets.some(set => set.weight > 0)
    );

    if (validExercises.length === 0) {
      setError('Please add at least one exercise with a name and at least one set with weight');
      setLoading(false);
      return;
    }

    try {
      const workoutToSave = {
        ...workoutData,
        exercises: validExercises.map(exercise => ({
          ...exercise,
          sets: exercise.sets.map(set => ({
            ...set,
            weight: parseFloat(set.weight) || 0,
            reps: parseInt(set.reps) || 1
          }))
        }))
      };

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/api/workouts`, workoutToSave);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save workout');
      console.error('Error saving workout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-workout-container">
      <div className="add-workout-card">
        <div className="add-workout-header">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="back-btn"
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1>Add New Workout</h1>
        </div>

        <form onSubmit={handleSubmit} className="add-workout-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-section">
            <h2>Workout Details</h2>
            
            <div className="form-group">
              <label htmlFor="workoutType">Workout Type</label>
              <input
                type="text"
                id="workoutType"
                value={workoutData.workoutType}
                onChange={(e) => setWorkoutData({
                  ...workoutData,
                  workoutType: e.target.value
                })}
                placeholder="e.g., Chest Day, Leg Day, etc."
              />
            </div>

            <div className="form-group">
              <label htmlFor="workoutDate">Workout Date</label>
              <input
                type="date"
                id="workoutDate"
                value={workoutData.date}
                onChange={handleDateChange}
                max={new Date().toISOString().split('T')[0]} // Can't select future dates
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Workout Notes (Optional)</label>
              <textarea
                id="notes"
                value={workoutData.notes}
                onChange={(e) => setWorkoutData({
                  ...workoutData,
                  notes: e.target.value
                })}
                placeholder="Any additional notes about your workout..."
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h2>Exercises</h2>
              <button 
                type="button" 
                onClick={addExercise}
                className="add-exercise-btn"
              >
                <FaPlus /> Add Exercise
              </button>
            </div>

            {workoutData.exercises.map((exercise, index) => (
              <div key={index} className="exercise-form">
                <div className="exercise-header">
                  <h3>Exercise {index + 1}</h3>
                  {workoutData.exercises.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="remove-exercise-btn"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>

                <div className="exercise-fields">
                  <div className="form-group">
                    <label htmlFor={`exercise-name-${index}`}>Exercise Name</label>
                    <input
                      type="text"
                      id={`exercise-name-${index}`}
                      value={exercise.name}
                      onChange={(e) => updateExercise(index, 'name', e.target.value)}
                      placeholder="e.g., Bench Press, Squats, etc."
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor={`exercise-unit-${index}`}>Unit</label>
                    <select
                      id={`exercise-unit-${index}`}
                      value={exercise.unit}
                      onChange={(e) => updateExercise(index, 'unit', e.target.value)}
                    >
                      <option value="kg">kg</option>
                      <option value="lbs">lbs</option>
                    </select>
                  </div>

                  <div className="sets-section">
                    <div className="sets-header">
                      <h4>Sets</h4>
                      <button 
                        type="button" 
                        onClick={() => addSet(index)}
                        className="add-set-btn"
                      >
                        <FaPlus /> Add Set
                      </button>
                    </div>

                    {exercise.sets.map((set, setIndex) => (
                      <div key={setIndex} className="set-form">
                        <div className="set-header">
                          <h5>Set {setIndex + 1}</h5>
                          {exercise.sets.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSet(index, setIndex)}
                              className="remove-set-btn"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>

                        <div className="set-fields">
                          <div className="form-row">
                            <div className="form-group">
                              <label htmlFor={`set-weight-${index}-${setIndex}`}>Weight ({exercise.unit})</label>
                              <input
                                type="number"
                                id={`set-weight-${index}-${setIndex}`}
                                value={set.weight}
                                onChange={(e) => updateSet(index, setIndex, 'weight', e.target.value)}
                                placeholder="0"
                                min="0"
                                step="0.5"
                                required
                              />
                            </div>

                            <div className="form-group">
                              <label htmlFor={`set-reps-${index}-${setIndex}`}>Reps</label>
                              <input
                                type="number"
                                id={`set-reps-${index}-${setIndex}`}
                                value={set.reps}
                                onChange={(e) => updateSet(index, setIndex, 'reps', e.target.value)}
                                min="1"
                                required
                              />
                            </div>
                          </div>

                          <div className="form-group">
                            <label htmlFor={`set-notes-${index}-${setIndex}`}>Set Notes (Optional)</label>
                            <input
                              type="text"
                              id={`set-notes-${index}-${setIndex}`}
                              value={set.notes}
                              onChange={(e) => updateSet(index, setIndex, 'notes', e.target.value)}
                              placeholder="Notes for this set..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="form-group">
                    <label htmlFor={`exercise-notes-${index}`}>Exercise Notes (Optional)</label>
                    <input
                      type="text"
                      id={`exercise-notes-${index}`}
                      value={exercise.exerciseNotes}
                      onChange={(e) => updateExercise(index, 'exerciseNotes', e.target.value)}
                      placeholder="Any notes about this exercise..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="save-workout-btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : (
                <>
                  <FaSave /> Save Workout
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWorkout; 