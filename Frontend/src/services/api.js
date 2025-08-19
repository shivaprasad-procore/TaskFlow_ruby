import axios from 'axios';

// The base URL of your Rails application
const API_BASE_URL = 'http://localhost:3000/api';

// Create an axios instance for making API requests
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Helper function for improved error handling ---
const getErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.response && error.response.statusText) {
    return error.response.statusText;
  }
  return 'An unexpected error occurred.';
};


class APIService {
  // ... existing Task methods (getAllTasks, getTaskById, etc.) ...

  /**
   * Fetches all tasks from the backend.
   */
  static async getAllTasks() {
    try {
      const response = await apiClient.get('/tasks');
      return { success: true, data: response.data, total: response.data.length };
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return { success: false, error: getErrorMessage(error) };
    }
  }

  /**
   * Fetches a single task by its ID.
   * @param {number} id The ID of the task.
   */
  static async getTaskById(id) {
    try {
      const response = await apiClient.get(`/tasks/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      return { success: false, error: getErrorMessage(error) };
    }
  }

  /**
   * Creates a new task.
   * @param {object} taskData The data for the new task.
   */
  static async createTask(taskData) {
    try {
      const payload = {
        number: taskData.number,
        title: taskData.title,
        status: taskData.status,
        priority: taskData.priority,
        assignee: taskData.assignee,
        description: taskData.description,
        description_rich_text: taskData.descriptionRichText,
        due_date: taskData.due_date,
      };

      if (payload.due_date) {
        payload.due_date = new Date(`${payload.due_date}T12:00:00`).toISOString();
      } else {
        payload.due_date = null;
      }
      
      const response = await apiClient.post('/tasks', { task: payload });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating task:', error);
      return { success: false, error: getErrorMessage(error) };
    }
  }

  /**
   * Updates an existing task.
   * @param {number} id The ID of the task to update.
   * @param {object} taskData The new data for the task.
   */
  static async updateTask(id, taskData) {
    try {
      const payload = {
        number: taskData.number,
        title: taskData.title,
        status: taskData.status,
        priority: taskData.priority,
        assignee: taskData.assignee,
        description: taskData.description,
        description_rich_text: taskData.descriptionRichText,
        due_date: taskData.due_date,
      };

      if (payload.due_date) {
        payload.due_date = new Date(`${payload.due_date}T12:00:00`).toISOString();
      } else {
        payload.due_date = null;
      }

      const response = await apiClient.put(`/tasks/${id}`, { task: payload });
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      return { success: false, error: getErrorMessage(error) };
    }
  }

  /**
   * Deletes a task by its ID (soft delete).
   * @param {number} id The ID of the task to delete.
   */
  static async deleteTask(id) {
    try {
      await apiClient.delete(`/tasks/${id}`);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      return { success: false, error: getErrorMessage(error) };
    }
  }

  /**
   * Searches for tasks based on a search term.
   */
  static async searchTasks(searchTerm) {
     try {
      const response = await apiClient.get('/tasks');
      const filteredTasks = response.data.filter(task =>
        (task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.assignee && task.assignee.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      return { success: true, data: filteredTasks, total: filteredTasks.length };
    } catch (error) {
      console.error('Error searching tasks:', error);
      return { success: false, error: getErrorMessage(error) };
    }
  }

  // --- NEW: Comment Functions ---

  /**
   * Fetches all comments for a specific task.
   * @param {number} taskId The ID of the task.
   */
  static async getCommentsForTask(taskId) {
    try {
      const response = await apiClient.get(`/tasks/${taskId}/comments`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Error fetching comments for task ${taskId}:`, error);
      return { success: false, error: getErrorMessage(error) };
    }
  }

  /**
   * Creates a new comment for a task.
   * @param {number} taskId The ID of the task.
   * @param {object} commentData The comment data (userName, comment).
   */
  static async createComment(taskId, commentData) {
    try {
      const response = await apiClient.post(`/tasks/${taskId}/comments`, { comment: commentData });
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Error creating comment for task ${taskId}:`, error);
      return { success: false, error: getErrorMessage(error) };
    }
  }
}

export default APIService;
