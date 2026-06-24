import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

const initialState = {
  notifications: [],
  unreadCount: 0,
  preferences: null,
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (filter, thunkAPI) => {
    try {
      const response = await api.get('/notifications', { params: { filter } });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data.count;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markRead',
  async (id, thunkAPI) => {
    try {
      const response = await api.patch(`/notifications/${id}/read`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllRead',
  async (_, thunkAPI) => {
    try {
      await api.patch('/notifications/read-all');
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const archiveNotification = createAsyncThunk(
  'notifications/archive',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/notifications/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchPreferences = createAsyncThunk(
  'notifications/fetchPreferences',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/notifications/preferences');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updatePreferences = createAsyncThunk(
  'notifications/updatePreferences',
  async (data, thunkAPI) => {
    try {
      const response = await api.put('/notifications/preferences', data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.loading = true; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })

      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n._id === action.payload._id);
        if (index !== -1) {
          state.notifications[index].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => n.isRead = true);
        state.unreadCount = 0;
      })

      .addCase(archiveNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(n => n._id !== action.payload);
      })

      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.preferences = action.payload;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferences = action.payload;
      });
  },
});

export default notificationSlice.reducer;
