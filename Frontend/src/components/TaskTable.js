import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import APIService from '../services/api';
import CreateTaskModal from './CreateTaskModal';
import EditTaskModal from './EditTaskModal';
import './TaskTable.css';

const TaskTable = ({ statusFilter }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await APIService.getAllTasks();
      if (response.success) {
        setAllTasks(response.data);
        setTotalTasks(response.total);
      } else {
        setError('Failed to fetch tasks from the server.');
      }
    } catch (err) {
      setError('An error occurred while fetching tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter tasks based on status and search term
  const applyFilters = useCallback(() => {
    let filtered = allTasks;

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.assignee && task.assignee.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredTasks(filtered);
  }, [allTasks, statusFilter, searchTerm]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleCreateTask = async (newTaskData) => {
    const payload = { ...newTaskData, due_date: newTaskData.due_date || null };
    const response = await APIService.createTask(payload);
    console.log("response", payload);
    if (response.success) {
      setAllTasks(prev => [...prev, response.data]);
        console.log("response.data", response.data);

      setIsCreateModalVisible(false);
    } else {
      
      alert(`Failed to create task: ${response.error}`);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsEditModalVisible(true);
  };

  const handleView = (task) => {
    navigate(`/task/${task.id}`);
  };

  const handleUpdateTask = async (updatedTaskData) => {
    const payload = { ...updatedTaskData, due_date: updatedTaskData.due_date || null };
    const response = await APIService.updateTask(payload.id, payload);
    if (response.success) {
      setIsEditModalVisible(false);
      setEditingTask(null);
      fetchTasks();
    } else {
      alert(`Failed to update task: ${response.error}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setLoading(true);
    const response = await APIService.deleteTask(id);
    if (response.success) {
      setAllTasks(prev => prev.filter(task => task.id !== id));
      setLoading(false);
    } else {
      setError('Failed to delete task.');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (error) {
    return (
      <div className="task-table-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchTasks} className="retry-button">Retry</button>
        </div>
      </div>
    );
  }

  const clearFilter = () => {
    navigate('/tasks');
  };

  const getStatusDisplayName = (status) => {
    if (!status) return null;
    return status;
  };

  return (
    <div className="task-table-container">
      <div className="table-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-button">🔍</button>
        </div>
        <div className="button-row">
          <button className="primary-button" onClick={() => setIsCreateModalVisible(true)}>➕ New Task</button>
          {/* <button className="secondary-button">🎯 Apply Filters</button> */}
        </div>
      </div>

      {/* Status Filter Display */}
      {statusFilter && (
        <div className="filter-bar">
          <div className="active-filter">
            <span className="filter-label">Filtering by status:</span>
            <span className="filter-value">{getStatusDisplayName(statusFilter)}</span>
            <button className="clear-filter-btn" onClick={clearFilter}>
              ✕ Clear Filter
            </button>
          </div>
          <div className="filter-results">
            Showing {filteredTasks.length} of {allTasks.length} tasks
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-container"><div className="loading-spinner"></div><p>Loading tasks...</p></div>
      ) : (
        <>
          <table className="task-table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>#</th>
                <th>Title <span className="sort-arrow">↕</span></th>
                <th>Description</th>
                <th>Assignee(s)</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Priority</th>
                <th className="actions-column">Actions</th> {/* ✅ NEW column */}
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td><input type="checkbox" /></td>
                  <td>{task.number}</td>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.assignee || 'None'}</td>
                  <td>{formatDate(task.due_date)}</td>
                  <td>
                    <span className={`status-badge ${task.status?.toLowerCase().replace(' ', '-')}`}>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <span className={`priority-badge priority-${task.priority?.toLowerCase()}`}>
                      {task.priority || 'None'}
                    </span>
                  </td>
                  <td> {/* ✅ NEW actions cell */}
                    <div className="action-buttons">
                      <button className="action-btn edit-btn" onClick={() => handleEdit(task)}>Edit</button>
                      <button className="action-btn view-btn" onClick={() => handleView(task)}>View</button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(task.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="table-footer">
            <span>{filteredTasks.length} of {allTasks.length}</span>
            <div className="pagination">
              <span>Page:</span>
              <select value={currentPage} onChange={(e) => setCurrentPage(parseInt(e.target.value))}>
                <option value={1}>1</option>
              </select>
              <button disabled={currentPage === 1}>‹</button>
              <button disabled={currentPage === 1}>›</button>
            </div>
          </div>
        </>
      )}

      <CreateTaskModal
        isOpen={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSave={handleCreateTask}
      />

      {isEditModalVisible && (
        <EditTaskModal
          task={editingTask}
          onSave={handleUpdateTask}
          onClose={() => setIsEditModalVisible(false)}
        />
      )}
    </div>
  );
};

export default TaskTable;
