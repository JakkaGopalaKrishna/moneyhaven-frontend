import api from './api';

const createGoal = async (goalData) => {
  const response = await api.post('/goals', goalData);
  return response.data;
};

const getGoals = async (params) => {
  const response = await api.get('/goals', { params });
  return response.data;
};

const getGoalById = async (id) => {
  const response = await api.get(`/goals/${id}`);
  return response.data;
};

const updateGoal = async (id, goalData) => {
  const response = await api.put(`/goals/${id}`, goalData);
  return response.data;
};

const deleteGoal = async (id) => {
  const response = await api.delete(`/goals/${id}`);
  return response.data;
};

const addSavings = async (id, savingsData) => {
  const response = await api.post(`/goals/${id}/contributions`, savingsData);
  return response.data;
};

const getGoalProgress = async (params) => {
  const response = await api.get('/goals/progress', { params });
  return response.data;
};

const getGoalStats = async (params) => {
  const response = await api.get('/goals/stats', { params });
  return response.data;
};

const getGoalInsights = async (params) => {
  const response = await api.get('/goals/insights', { params });
  return response.data;
};

const goalService = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  addSavings,
  getGoalProgress,
  getGoalStats,
  getGoalInsights,
};

export default goalService;
