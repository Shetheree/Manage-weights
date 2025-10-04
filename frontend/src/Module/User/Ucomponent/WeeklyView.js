import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { 
  FaPlus, 
  FaDumbbell, 
  FaCalendar, 
  FaSignOutAlt, 
  FaTrash,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
  FaArrowLeft
} from 'react-icons/fa';
import axios from 'axios';
import './WeeklyView.css';

const WeeklyView = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeeklyWorkouts();
  }, [currentWeek]);

  // Refresh data when navigating back to this component
  useEffect(() => {
    fetchWeeklyWorkouts();
  }, [location.pathname]);

  const fetchWeeklyWorkouts = async () => {
    try {
      const startDate = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday start
      const endDate = endOfWeek(currentWeek, { weekStartsOn: 1 }); // Sunday end
      
      console.log('Fetching workouts for week:', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        currentWeek: currentWeek.toISOString(),
        user: user,
        token: localStorage.getItem('token')
      });
      
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/workouts/range?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
      console.log('Fetched workouts:', response.data);
      setWorkouts(response.data);
    } catch (error) {
      setError('Failed to load weekly workouts');
      console.error('Error fetching weekly workouts:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        await axios.delete(`${apiUrl}/api/workouts/${workoutId}`);
        fetchWeeklyWorkouts(); // Refresh the data
      } catch (error) {
        setError('Failed to delete workout');
        console.error('Error deleting workout:', error);
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  const nextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const prevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const getWorkoutForDay = (date) => {
    const workout = workouts.find(workout => {
      const workoutDate = new Date(workout.date);
      const isMatch = isSameDay(workoutDate, date);
      console.log('Checking workout date match:', {
        workoutDate: workoutDate.toISOString(),
        dayDate: date.toISOString(),
        isMatch,
        workoutId: workout._id
      });
      return isMatch;
    });
    return workout;
  };

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentWeek, { weekStartsOn: 1 }),
    end: endOfWeek(currentWeek, { weekStartsOn: 1 })
  });

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  if (loading) {
    return (
      <div className="weekly-view-container">
        <div className="loading">Loading your weekly workouts...</div>
      </div>
    );
  }

  return (
    <div className="weekly-view-container">
      <header className="weekly-header">
        <div className="header-content">
          <div className="user-info">
            <h1>Weekly Progress - {user?.username}</h1>
            <p>Track your 6-day gym routine</p>
          </div>
          <div className="header-actions">
            <Link to="/dashboard" className="dashboard-btn">
              <FaArrowLeft /> Dashboard
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

      <div className="week-navigation">
        <button onClick={prevWeek} className="nav-btn">
          <FaChevronLeft /> Previous Week
        </button>
        <h2>
          {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM dd')} - {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM dd, yyyy')}
        </h2>
        <button onClick={nextWeek} className="nav-btn">
          Next Week <FaChevronRight />
        </button>
      </div>

      <main className="weekly-main">
        {error && <div className="error-message">{error}</div>}
        
        
        <div className="weekly-grid">
          {weekDays.map((day, index) => {
            const workout = getWorkoutForDay(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div key={index} className={`day-card ${isToday ? 'today' : ''} ${workout ? 'has-workout' : 'no-workout'}`}>
                <div className="day-header">
                  <h3 className="day-name">{dayNames[index]}</h3>
                  <div className="day-date">
                    <FaCalendar />
                    <span>{format(day, 'MMM dd')}</span>
                  </div>
                  {isToday && <div className="today-badge">Today</div>}
                </div>

                {workout ? (
                  <div className="workout-content">
                    <div className="workout-type">
                      {workout.workoutType}
                    </div>
                    
                    <div className="exercises-summary">
                      {workout.exercises.slice(0, 3).map((exercise, exIndex) => (
                        <div key={exIndex} className="exercise-summary">
                          <div className="exercise-name">
                            <FaDumbbell />
                            <span>{exercise.name}</span>
                          </div>
                          <div className="exercise-details">
                            <span className="sets-count">{exercise.sets?.length || 0} sets</span>
                            {exercise.sets && exercise.sets.length > 0 && (
                              <span className="weight-range">
                                {Math.min(...exercise.sets.map(s => s.weight))}-{Math.max(...exercise.sets.map(s => s.weight))} {exercise.unit}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      {workout.exercises.length > 3 && (
                        <div className="more-exercises">
                          +{workout.exercises.length - 3} more exercises
                        </div>
                      )}
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
                ) : (
                  <div className="no-workout">
                    <FaDumbbell className="no-workout-icon" />
                    <p>No workout</p>
                    <Link to="/add-workout" className="add-workout-link">
                      <FaPlus /> Add Workout
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="weekly-stats">
          <div className="stats-card">
            <h3>Weekly Summary</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{workouts.length}</span>
                <span className="stat-label">Workouts</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {workouts.reduce((total, workout) => total + workout.exercises.length, 0)}
                </span>
                <span className="stat-label">Total Exercises</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {workouts.length > 0 ? Math.round((workouts.length / 6) * 100) : 0}%
                </span>
                <span className="stat-label">Goal Progress</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeeklyView; 