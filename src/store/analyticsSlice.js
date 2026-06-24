import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyticsService from '../services/analyticsService';

const initialState = {
  overview: null,
  spending: null,
  income: null,
  budgets: null,
  goals: null,
  health: null,
  insights: null,
  forecast: null,
  loading: false,
  error: null,
};

export const fetchAllAnalytics = createAsyncThunk(
  'analytics/fetchAll',
  async (_, thunkAPI) => {
    try {
      // Execute all fetches in parallel for efficiency
      const [
        overview,
        spending,
        income,
        budgets,
        goals,
        health,
        insights,
        forecast
      ] = await Promise.all([
        analyticsService.getOverview(),
        analyticsService.getSpending(),
        analyticsService.getIncome(),
        analyticsService.getBudgets(),
        analyticsService.getGoals(),
        analyticsService.getHealth(),
        analyticsService.getInsights(),
        analyticsService.getForecast()
      ]);

      return {
        overview: overview.data,
        spending: spending.data,
        income: income.data,
        budgets: budgets.data,
        goals: goals.data,
        health: health.data,
        insights: insights.data,
        forecast: forecast.data,
      };
    } catch (error) {
      const message = (error.response?.data?.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalyticsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload.overview;
        state.spending = action.payload.spending;
        state.income = action.payload.income;
        state.budgets = action.payload.budgets;
        state.goals = action.payload.goals;
        state.health = action.payload.health;
        state.insights = action.payload.insights;
        state.forecast = action.payload.forecast;
      })
      .addCase(fetchAllAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAnalyticsError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
