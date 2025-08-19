import React, { useState, useEffect } from 'react';
import APIService from '../services/api';
import './CreateTaskModal.css';

const STATUS_OPTIONS = ['Initiated', 'In Progress', 'Completed'];
const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];

const CreateTaskModal = ({ isOpen, onClose, onSave }) => {
  const [newTask, setNewTask] = useState({});

  // Function to get the next available task number
  const getNextTaskNumber = async () => {
    try {
      const response = await APIService.getAllTasks();
      if (response.success && response.data.length > 0) {
        // Extract numbers from existing task numbers and find the highest
        const existingNumbers = response.data
          .map(task => {
            const match = task.number.match(/TASK-(\d+)/);
            return match ? parseInt(match[1]) : 0;
          })
          .filter(num => num > 0);
        
        const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
        return maxNumber + 1;
      }
      return 1; // Start from 1 if no tasks exist
    } catch (error) {
      console.error('Error getting next task number:', error);
      return 1;
    }
  };

  useEffect(() => {
    if (isOpen) {
      getNextTaskNumber().then(nextNum => {
        setNewTask({
          title: '',
          description: '',
          assignee: '',
          status: STATUS_OPTIONS[0],
          priority: PRIORITY_OPTIONS[1],
          number: `TASK-${nextNum.toString().padStart(3, '0')}`,
          due_date: ''
        });
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.number) {
      alert('Task Number and Title are required.');
      return;
    }
    onSave(newTask);
  };

  const getBadgeClassName = (base, value) => {
    if (!value) return `${base}-badge`;
    return `${base}-badge ${base}-${value.toLowerCase().replace(' ', '-')}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content centered">
        <div className="modal-header">
          <h3>Create Task</h3>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="create-task-number">Number *</label>
              <input id="create-task-number" type="text" name="number" value={newTask.number} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label htmlFor="create-task-title">Title *</label>
              <input id="create-task-title" type="text" name="title" value={newTask.title} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label htmlFor="create-task-status">Status</label>
              <div className="custom-select-wrapper">
                <span className={getBadgeClassName('status', newTask.status)}>
                  {newTask.status}
                </span>
                <select
                  id="create-task-status"
                  name="status"
                  value={newTask.status}
                  onChange={handleChange}
                >
                  {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="create-task-priority">Priority</label>
              <div className="custom-select-wrapper">
                <span className={getBadgeClassName('priority', newTask.priority)}>
                  {newTask.priority}
                </span>
                <select
                  id="create-task-priority"
                  name="priority"
                  value={newTask.priority}
                  onChange={handleChange}
                >
                  {PRIORITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="create-task-assignee">Assignee</label>
              <input 
                id="create-task-assignee" 
                type="text" 
                name="assignee" 
                value={newTask.assignee} 
                onChange={handleChange}
                placeholder="Enter assignee name"
              />
            </div>
            <div className="form-field">
              <label htmlFor="create-task-due-date">Due Date</label>
              <input id="create-task-due-date" type="date" name="due_date" value={newTask.due_date} onChange={handleChange} />
            </div>
            <div className="form-field full-width">
              <label htmlFor="create-task-description">Description</label>
              <textarea id="create-task-description" name="description" value={newTask.description} onChange={handleChange}></textarea>
            </div>
          </div>
        </form>
        <div className="modal-footer">
          <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          <button type="button" onClick={handleSubmit} className="submit-task-btn">Save</button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
