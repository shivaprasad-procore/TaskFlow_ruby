// Mock API service to simulate real API calls
const MOCK_TASKS = [
  {
    id: 1,
    title: 'Test 1',
    description: 'Test 1 Test 2',
    assignee: 'None',
    due_date: '7/21/2025',
    status: 'Initiated',
    category: 'Development'
  },
  {
    id: 2,
    title: 'Test 2',
    description: 'Test 1',
    assignee: 'Yongnan Zhou',
    due_date: '7/21/2025',
    status: 'Initiated',
    category: 'Design'
  },
  {
    id: 3,
    title: 'Test 3',
    description: 'Test 3',
    assignee: 'None',
    due_date: '7/21/2025',
    status: 'In Progress',
    category: 'Testing'
  },
  {
    id: 4,
    title: 'Database Optimization',
    description: 'Optimize database queries for better performance',
    assignee: 'John Smith',
    due_date: '7/25/2025',
    status: 'In Progress',
    category: 'Development'
  },
  {
    id: 5,
    title: 'UI Design Review',
    description: 'Review and finalize UI designs for new features',
    assignee: 'Sarah Johnson',
    due_date: '7/23/2025',
    status: 'Completed',
    category: 'Design'
  },
  {
    id: 6,
    title: 'Security Audit',
    description: 'Conduct comprehensive security audit of the application',
    assignee: 'Mike Wilson',
    due_date: '7/30/2025',
    status: 'Initiated',
    category: 'Security'
  }
];

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MockAPIService {
  static async getAllTasks() {
    await delay(500); // Simulate network delay
    return {
      success: true,
      data: MOCK_TASKS,
      total: MOCK_TASKS.length
    };
  }

  static async getTaskById(id) {
    await delay(300);
    const task = MOCK_TASKS.find(task => task.id === parseInt(id));
    if (task) {
      return { success: true, data: task };
    }
    return { success: false, error: 'Task not found' };
  }

  static async createTask(taskData) {
    await delay(400);
    const newTask = {
      id: Math.max(...MOCK_TASKS.map(t => t.id)) + 1,
      ...taskData,
      status: taskData.status || 'Initiated'
    };
    MOCK_TASKS.push(newTask);
    return { success: true, data: newTask };
  }

  static async updateTask(id, taskData) {
    await delay(400);
    const index = MOCK_TASKS.findIndex(task => task.id === parseInt(id));
    if (index !== -1) {
      MOCK_TASKS[index] = { ...MOCK_TASKS[index], ...taskData };
      return { success: true, data: MOCK_TASKS[index] };
    }
    return { success: false, error: 'Task not found' };
  }

  static async deleteTask(id) {
    await delay(300);
    const index = MOCK_TASKS.findIndex(task => task.id === parseInt(id));
    if (index !== -1) {
      const deletedTask = MOCK_TASKS.splice(index, 1)[0];
      return { success: true, data: deletedTask };
    }
    return { success: false, error: 'Task not found' };
  }

  static async searchTasks(searchTerm) {
    await delay(300);
    const filteredTasks = MOCK_TASKS.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return {
      success: true,
      data: filteredTasks,
      total: filteredTasks.length
    };
  }

  static async getTasksByStatus(status) {
    await delay(300);
    const filteredTasks = MOCK_TASKS.filter(task =>
      task.status.toLowerCase() === status.toLowerCase()
    );
    return {
      success: true,
      data: filteredTasks,
      total: filteredTasks.length
    };
  }

  static async getTasksByAssignee(assignee) {
    await delay(300);
    const filteredTasks = MOCK_TASKS.filter(task =>
      task.assignee.toLowerCase().includes(assignee.toLowerCase())
    );
    return {
      success: true,
      data: filteredTasks,
      total: filteredTasks.length
    };
  }
}

export default MockAPIService;
