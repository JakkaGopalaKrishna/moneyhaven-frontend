import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import goalService from '../services/goalService';

const initialState = {
  goals: [],
  progressData: [],
  stats: null,
  insights: null,
  currentGoalDetails: null, // used for drawer
  loading: false,
  error: null,
};

export const fetchGoals = createAsyncThunk(
  'goals/fetchAll',
  async (params, thunkAPI) => {
    try {
      return await goalService.getGoals(params);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchGoalById = createAsyncThunk(
  'goals/fetchById',
  async (id, thunkAPI) => {
    try {
      return await goalService.getGoalById(id);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchGoalProgress = createAsyncThunk(
  'goals/fetchProgress',
  async (params, thunkAPI) => {
    try {
      return await goalService.getGoalProgress(params);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchGoalStats = createAsyncThunk(
  'goals/fetchStats',
  async (params, thunkAPI) => {
    try {
      return await goalService.getGoalStats(params);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchGoalInsights = createAsyncThunk(
  'goals/fetchInsights',
  async (params, thunkAPI) => {
    try {
      return await goalService.getGoalInsights(params);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createNewGoal = createAsyncThunk(
  'goals/create',
  async (goalData, thunkAPI) => {
    try {
      return await goalService.createGoal(goalData);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateExistingGoal = createAsyncThunk(
  'goals/update',
  async ({ id, data }, thunkAPI) => {
    try {
      return await goalService.updateGoal(id, data);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeGoal = createAsyncThunk(
  'goals/delete',
  async (id, thunkAPI) => {
    try {
      await goalService.deleteGoal(id);
      return id;
    } catch (error) {
      const message = (error.response?.data?.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addSavingsToGoal = createAsyncThunk(
  'goals/addSavings',
  async ({ id, data }, thunkAPI) => {
    try {
      return await goalService.addSavings(id, data);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    clearGoalError: (state) => {
      state.error = null;
    },
    clearCurrentGoalDetails: (state) => {
      state.currentGoalDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Goals
      .addCase(fetchGoals.pending, (state) => { state.loading = true; })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload.data;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Goal By Id (details and contributions)
      .addCase(fetchGoalById.pending, (state) => { state.loading = true; })
      .addCase(fetchGoalById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGoalDetails = action.payload.data;
      })
      .addCase(fetchGoalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Progress
      .addCase(fetchGoalProgress.pending, (state) => { state.loading = true; })
      .addCase(fetchGoalProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.progressData = action.payload.data;
      })
      .addCase(fetchGoalProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Stats
      .addCase(fetchGoalStats.pending, (state) => { state.loading = true; })
      .addCase(fetchGoalStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchGoalStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Insights
      .addCase(fetchGoalInsights.pending, (state) => { state.loading = true; })
      .addCase(fetchGoalInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.insights = action.payload.data;
      })
      .addCase(fetchGoalInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Goal
      .addCase(createNewGoal.pending, (state) => { state.loading = true; })
      .addCase(createNewGoal.fulfilled, (state) => { state.loading = false; })
      .addCase(createNewGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Goal
      .addCase(updateExistingGoal.pending, (state) => { state.loading = true; })
      .addCase(updateExistingGoal.fulfilled, (state) => { state.loading = false; })
      .addCase(updateExistingGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Goal
      .addCase(removeGoal.pending, (state) => { state.loading = true; })
      .addCase(removeGoal.fulfilled, (state) => { state.loading = false; })
      .addCase(removeGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Savings
      .addCase(addSavingsToGoal.pending, (state) => { state.loading = true; })
      .addCase(addSavingsToGoal.fulfilled, (state) => { state.loading = false; })
      .addCase(addSavingsToGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearGoalError, clearCurrentGoalDetails } = goalSlice.actions;
export default goalSlice.reducer;
