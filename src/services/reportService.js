import api from './api';

const getPreview = async (reportType, filters) => {
  const response = await api.get(`/reports/${reportType.toLowerCase().replace(/\s+/g, '-')}`, { params: filters });
  return response.data;
};

const getHistory = async () => {
  const response = await api.get('/reports/history');
  return response.data;
};

const exportReport = async (format, reportType, filters) => {
  // We need responseType: 'blob' to download files
  const response = await api.get(`/reports/export/${format}`, {
    params: { reportType, ...filters },
    responseType: 'blob'
  });
  return response.data;
};

const reportService = {
  getPreview,
  getHistory,
  exportReport,
};

export default reportService;
