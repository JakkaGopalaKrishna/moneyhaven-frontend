import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardService from '../services/dashboardService';

const initialState = {
  summary: null,
  stats: null,
  loading: false,
  error: null,
};

export const getDashboardSummaryUser = createAsyncThunk(
  'dashboard/getSummary',
  async (_, thunkAPI) => {
    try {
      return await dashboardService.getDashboardSummary();
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getDashboardStatsUser = createAsyncThunk(
  'dashboard/getStats',
  async (_, thunkAPI) => {
    try {
      return await dashboardService.getDashboardStats();
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Summary
      .addCase(getDashboardSummaryUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDashboardSummaryUser.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.summary;
      })
      .addCase(getDashboardSummaryUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Stats
      .addCase(getDashboardStatsUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDashboardStatsUser.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
      })
      .addCase(getDashboardStatsUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
