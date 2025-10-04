import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { format } from 'date-fns';
import { 
  FaPlus, 
  FaDumbbell, 
  FaCalendar, 
  FaSignOutAlt, 
  FaTrash,
  FaEdit
} from 'react-icons/fa';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Refresh data when navigating back to this component
  useEffect(() => {
    fetchWorkouts();
  }, [location.pathname]);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/workouts');
      setWorkouts(response.data);
    } catch (error) {
      setError('Failed to load workouts');
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await axios.delete(`http://localhost:5000/api/workouts/${workoutId}`);
        setWorkouts(workouts.filter(workout => workout._id !== workoutId));
      } catch (error) {
        setError('Failed to delete workout');
        console.error('Error deleting workout:', error);
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading your workouts...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <h1>Welcome back, {user?.username}!</h1>
            <p>Track your progress and stay motivated</p>
          </div>
          <div className="header-actions">
            <Link to="/weekly-view" className="weekly-view-btn">
              <FaCalendar /> Weekly View
            </Link>
            <Link to="/add-workout" className="add-workout-btn">
              <FaPlus /> Add Workout
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {error && <div className="error-message">{error}</div>}
        
        {workouts.length === 0 ? (
          <div className="empty-state">
            <FaDumbbell className="empty-icon" />
            <h2>No workouts yet</h2>
            <p>Start your fitness journey by adding your first workout!</p>
            <Link to="/add-workout" className="cta-button">
              <FaPlus /> Add Your First Workout
            </Link>
          </div>
        ) : (
          <div className="workouts-grid">
            {workouts.map((workout) => (
              <div key={workout._id} className="workout-card">
                <div className="workout-header">
                  <div className="workout-date">
                    <FaCalendar />
                    <span>{format(new Date(workout.date), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="workout-actions">
                                         <button 
                       className="action-btn edit-btn"
                       title="Edit workout"
                       onClick={() => navigate(`/edit-workout/${workout._id}`)}
                     >
                       <FaEdit />
                     </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteWorkout(workout._id)}
                      title="Delete workout"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="workout-type">
                  {workout.workoutType}
                </div>

                <div className="exercises-list">
                  {workout.exercises.map((exercise, index) => (
                    <div key={index} className="exercise-item">
                      <div className="exercise-name">
                        <FaDumbbell />
                        <span>{exercise.name}</span>
                      </div>
                      <div className="exercise-sets">
                        {exercise.sets && exercise.sets.map((set, setIndex) => (
                          <div key={setIndex} className="set-display">
                            <span className="set-number">Set {setIndex + 1}:</span>
                            <span className="weight">
                              {set.weight} {exercise.unit}
                            </span>
                            <span className="reps">
                              × {set.reps} reps
                            </span>
                            {set.notes && (
                              <span className="set-notes">({set.notes})</span>
                            )}
                          </div>
                        ))}
                      </div>
                      {exercise.exerciseNotes && (
                        <div className="exercise-notes">
                          {exercise.exerciseNotes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {workout.notes && (
                  <div className="workout-notes">
                    <strong>Notes:</strong> {workout.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard; 