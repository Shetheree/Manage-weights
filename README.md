# Weights Tracker - Workout Progress Tracker

A modern web application to track your workout progress with weights, built with React.js, Express.js, Node.js, and MongoDB.

## Features

- 🔐 User authentication (register/login)
- 💪 Add workouts with multiple exercises
- 📊 Track weights, sets, and reps for each exercise
- 📅 View workout history with most recent workouts on top
- 🎯 Progress tracking week by week
- 📱 Responsive design for mobile and desktop
- 🎨 Modern, beautiful UI with smooth animations

## Tech Stack

### Frontend
- React.js 19
- React Router for navigation
- Axios for API calls
- React Icons for beautiful icons
- Date-fns for date formatting
- Modern CSS with gradients and animations

### Backend
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd WeightsTracker
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/weights-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

### 1. Registration/Login
- Visit `http://localhost:3000`
- Register a new account or login with existing credentials
- You'll be redirected to the dashboard after successful authentication

### 2. Adding Workouts
- Click "Add Workout" button on the dashboard
- Fill in workout details:
  - Workout type (e.g., "Chest Day", "Leg Day")
  - Exercise name (e.g., "Bench Press", "Squats")
  - Weight (in kg or lbs)
  - Number of sets and reps
  - Optional notes
- Add multiple exercises to a single workout
- Click "Save Workout" to store your workout

### 3. Viewing Progress
- Your workouts are displayed as cards on the dashboard
- Most recent workouts appear at the top
- Each card shows:
  - Date of the workout
  - Workout type
  - All exercises with weights, sets, and reps
  - Optional notes
- Delete workouts using the trash icon

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Workouts
- `GET /api/workouts` - Get all workouts for user
- `POST /api/workouts` - Add new workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout
- `GET /api/workouts/stats` - Get workout statistics

## Project Structure

```
WeightsTracker/
├── backend/
│   ├── controller/
│   ├── Middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Workout.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── workouts.js
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── Module/
│   │   │   └── User/
│   │   │       └── Ucomponent/
│   │   │           ├── Login.js
│   │   │           ├── Register.js
│   │   │           ├── Dashboard.js
│   │   │           ├── AddWorkout.js
│   │   │           ├── Auth.css
│   │   │           ├── Dashboard.css
│   │   │           └── AddWorkout.css
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
└── README.md
```

## Features in Detail

### Workout Tracking
- Add multiple exercises per workout
- Track weight, sets, and reps for each exercise
- Support for both kg and lbs
- Add notes for exercises and workouts
- Automatic date tracking

### User Experience
- Clean, modern interface with gradient backgrounds
- Responsive design that works on all devices
- Smooth animations and hover effects
- Intuitive navigation
- Real-time form validation

### Data Management
- Secure user authentication with JWT
- Password hashing with bcrypt
- MongoDB for reliable data storage
- RESTful API design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on the repository.

---

**Happy lifting! 💪** 