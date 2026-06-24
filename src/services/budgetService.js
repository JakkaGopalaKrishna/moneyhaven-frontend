import api from './api';

const createBudget = async (budgetData) => {
  const response = await api.post('/budgets', budgetData);
  return response.data;
};

const getBudgets = async (params) => {
  const response = await api.get('/budgets', { params });
  return response.data;
};

const getBudgetById = async (id) => {
  const response = await api.get(`/budgets/${id}`);
  return response.data;
};

const updateBudget = async (id, budgetData) => {
  const response = await api.put(`/budgets/${id}`, budgetData);
  return response.data;
};

const deleteBudget = async (id) => {
  const response = await api.delete(`/budgets/${id}`);
  return response.data;
};

const getBudgetProgress = async (params) => {
  const response = await api.get('/budgets/progress', { params });
  return response.data;
};

const getBudgetHistory = async (params) => {
  const response = await api.get('/budgets/history', { params });
  return response.data;
};

const getBudgetStats = async (params) => {
  const response = await api.get('/budgets/stats', { params });
  return response.data;
};

const budgetService = {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  getBudgetProgress,
  getBudgetHistory,
  getBudgetStats,
};

export default budgetService;
