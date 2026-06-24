import api from './api';

const getDashboardSummary = async () => {
  const response = await api.get('/dashboard/summary');
  return response.data;
};

const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

const dashboardService = {
  getDashboardSummary,
  getDashboardStats,
};

export default dashboardService;
