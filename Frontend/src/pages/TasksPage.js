import React from 'react';
import { useLocation } from 'react-router-dom';
import TaskTable from '../components/TaskTable';

const TasksPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const statusFilter = queryParams.get('status');

  return (
    <div className="tasks-page">
      <TaskTable statusFilter={statusFilter} />
    </div>
  );
};

export default TasksPage;
