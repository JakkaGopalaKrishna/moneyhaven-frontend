import api from './api';

const getProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

const updateProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};

const changePassword = async (passwordData) => {
  const response = await api.put('/users/change-password', passwordData);
  return response.data;
};

const uploadAvatar = async (formData) => {
  const response = await api.post('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const deleteAvatar = async () => {
  const response = await api.delete('/users/avatar');
  return response.data;
};

const profileService = {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  deleteAvatar,
};

export default profileService;
