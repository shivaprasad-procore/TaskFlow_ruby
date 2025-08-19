import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import TaskDetailPage from './pages/TaskDetailPage';
import About from './pages/About';
import './App.css';
import ActivityFeed from './components/ActivityFeed';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/task/:id" element={<TaskDetailPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/comments/:id" element={<ActivityFeed />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
