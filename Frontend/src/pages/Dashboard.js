import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import APIService from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    initiated: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await APIService.getAllTasks();
      if (response.success) {
        const tasks = response.data;
        const newStats = {
          total: tasks.length,
          inProgress: tasks.filter(task => task.status === 'In Progress').length,
          completed: tasks.filter(task => task.status === 'Completed').length,
          initiated: tasks.filter(task => task.status === 'Initiated').length
        };
        setStats(newStats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWidth = (value) => {
    return `${(value / (stats.total || 1)) * 100}%`;
  };

  const handleStatusClick = (status) => {
    if (status === 'total') {
      navigate('/tasks');
    } else {
      navigate(`/tasks?status=${encodeURIComponent(status)}`);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to the Task Management Systems</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card clickable" onClick={() => handleStatusClick('total')}>
          <h3>Total Tasks</h3>
          <p className="stat-number">{loading ? '...' : stats.total}</p>
          <div className="progress-bar total"></div>
          <div className="click-hint">Click to view all tasks</div>
        </div>
        <div className="stat-card clickable" onClick={() => handleStatusClick('In Progress')}>
          <h3>In Progress</h3>
          <p className="stat-number">{loading ? '...' : stats.inProgress}</p>
          <div className="progress-bar inprogress" style={{ width: getWidth(stats.inProgress) }}></div>
          <div className="click-hint">Click to view in-progress tasks</div>
        </div>
        <div className="stat-card clickable" onClick={() => handleStatusClick('Completed')}>
          <h3>Completed</h3>
          <p className="stat-number">{loading ? '...' : stats.completed}</p>
          <div className="progress-bar completed" style={{ width: getWidth(stats.completed) }}></div>
          <div className="click-hint">Click to view completed tasks</div>
        </div>
        <div className="stat-card clickable" onClick={() => handleStatusClick('Initiated')}>
          <h3>Initiated</h3>
          <p className="stat-number">{loading ? '...' : stats.initiated}</p>
          <div className="progress-bar initiated" style={{ width: getWidth(stats.initiated) }}></div>
          <div className="click-hint">Click to view initiated tasks</div>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <Link to="/tasks" className="action-button">
          View All Tasks
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
