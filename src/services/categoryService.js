import api from './api';

const createCategory = async (categoryData) => {
  const response = await api.post('/categories', categoryData);
  return response.data;
};

const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return response.data;
};

const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

const getCategoryStats = async () => {
  const response = await api.get('/categories/stats');
  return response.data;
};

const categoryService = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoryStats,
};

export default categoryService;
