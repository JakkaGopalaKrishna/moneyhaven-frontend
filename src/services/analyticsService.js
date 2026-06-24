import api from './api';

const getOverview = async () => {
  const response = await api.get('/analytics/overview');
  return response.data;
};

const getSpending = async () => {
  const response = await api.get('/analytics/spending');
  return response.data;
};

const getIncome = async () => {
  const response = await api.get('/analytics/income');
  return response.data;
};

const getBudgets = async () => {
  const response = await api.get('/analytics/budgets');
  return response.data;
};

const getGoals = async () => {
  const response = await api.get('/analytics/goals');
  return response.data;
};

const getHealth = async () => {
  const response = await api.get('/analytics/health');
  return response.data;
};

const getInsights = async () => {
  const response = await api.get('/analytics/insights');
  return response.data;
};

const getForecast = async () => {
  const response = await api.get('/analytics/forecast');
  return response.data;
};

const analyticsService = {
  getOverview,
  getSpending,
  getIncome,
  getBudgets,
  getGoals,
  getHealth,
  getInsights,
  getForecast,
};

export default analyticsService;
