import React, { useState, useEffect } from 'react';
import './EditTaskModal.css';

const STATUS_OPTIONS = ['Initiated', 'In Progress', 'Completed'];
const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];

const EditTaskModal = ({ task, onSave, onClose }) => {
    const [editedTask, setEditedTask] = useState(task);

    useEffect(() => {
        const formattedDate = task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '';
        setEditedTask({...task, due_date: formattedDate});
    }, [task]);

    if (!task) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedTask(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(editedTask);
    };
    
    // Helper to get the class name for the new badge spans
    const getBadgeClassName = (base, value) => {
        if (!value) return `${base}-badge`;
        return `${base}-badge ${base}-${value.toLowerCase().replace(' ', '-')}`;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Edit Task</h3>
                </div>
                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-grid">
                        <div className="form-field">
                            <label htmlFor="task-number">Number *</label>
                            <input id="task-number" type="text" name="number" value={editedTask.number} onChange={handleChange} required />
                        </div>
                        <div className="form-field">
                            <label htmlFor="task-title">Title *</label>
                            <input id="task-title" type="text" name="title" value={editedTask.title} onChange={handleChange} required />
                        </div>
                        <div className="form-field">
                            <label htmlFor="task-status">Status</label>
                            {/* This is the custom wrapper structure you requested */}
                            <div className="custom-select-wrapper">
                                <span className={getBadgeClassName('status', editedTask.status)}>
                                    {editedTask.status}
                                </span>
                                <select 
                                    id="task-status" 
                                    name="status" 
                                    value={editedTask.status} 
                                    onChange={handleChange}
                                >
                                    {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="form-field">
                            <label htmlFor="task-priority">Priority</label>
                            {/* Applying the same wrapper structure to Priority */}
                            <div className="custom-select-wrapper">
                                <span className={getBadgeClassName('priority', editedTask.priority)}>
                                    {editedTask.priority}
                                </span>
                                <select 
                                    id="task-priority" 
                                    name="priority" 
                                    value={editedTask.priority} 
                                    onChange={handleChange}
                                >
                                    {PRIORITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="form-field">
                            <label htmlFor="task-assignee">Assignee</label>
                            <input 
                                id="task-assignee" 
                                type="text" 
                                name="assignee" 
                                value={editedTask.assignee || ''} 
                                onChange={handleChange}
                                placeholder="Enter assignee name"
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="task-due-date">Due Date</label>
                            <input id="task-due-date" type="date" name="due_date" value={editedTask.due_date} onChange={handleChange} />
                        </div>
                        <div className="form-field full-width">
                            <label htmlFor="task-description">Description</label>
                            <textarea id="task-description" name="description" value={editedTask.description} onChange={handleChange}></textarea>
                        </div>
                    </div>
                </form>
                <div className="modal-footer">
                    <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                    <button type="button" onClick={handleSubmit} className="submit-task-btn">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default EditTaskModal;
