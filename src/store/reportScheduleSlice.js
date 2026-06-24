import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

const initialState = {
  schedules: [],
  health: null,
  loading: false,
  error: null,
};

export const fetchSchedules = createAsyncThunk(
  'schedules/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/schedules');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createSchedule = createAsyncThunk(
  'schedules/create',
  async (data, thunkAPI) => {
    try {
      const response = await api.post('/schedules', data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateSchedule = createAsyncThunk(
  'schedules/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put(`/schedules/${id}`, data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteSchedule = createAsyncThunk(
  'schedules/delete',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/schedules/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchScheduleHealth = createAsyncThunk(
  'schedules/health',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/schedules/health');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const reportScheduleSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedules.pending, (state) => { state.loading = true; })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createSchedule.fulfilled, (state, action) => {
        state.schedules.unshift(action.payload);
      })

      .addCase(updateSchedule.fulfilled, (state, action) => {
        const index = state.schedules.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.schedules[index] = action.payload;
        }
      })

      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.schedules = state.schedules.filter(s => s._id !== action.payload);
      })

      .addCase(fetchScheduleHealth.fulfilled, (state, action) => {
        state.health = action.payload;
      });
  },
});

export default reportScheduleSlice.reducer;
