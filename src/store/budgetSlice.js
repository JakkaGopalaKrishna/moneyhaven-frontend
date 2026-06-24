import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import budgetService from '../services/budgetService';

const initialState = {
  budgets: [],
  progressData: null,
  stats: null,
  history: [],
  loading: false,
  error: null,
};

export const fetchBudgets = createAsyncThunk(
  'budgets/fetchAll',
  async (params, thunkAPI) => {
    try {
      return await budgetService.getBudgets(params);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchBudgetProgress = createAsyncThunk(
  'budgets/fetchProgress',
  async (params, thunkAPI) => {
    try {
      return await budgetService.getBudgetProgress(params);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchBudgetStats = createAsyncThunk(
  'budgets/fetchStats',
  async (params, thunkAPI) => {
    try {
      return await budgetService.getBudgetStats(params);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchBudgetHistory = createAsyncThunk(
  'budgets/fetchHistory',
  async (params, thunkAPI) => {
    try {
      return await budgetService.getBudgetHistory(params);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createNewBudget = createAsyncThunk(
  'budgets/create',
  async (budgetData, thunkAPI) => {
    try {
      return await budgetService.createBudget(budgetData);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateExistingBudget = createAsyncThunk(
  'budgets/update',
  async ({ id, data }, thunkAPI) => {
    try {
      return await budgetService.updateBudget(id, data);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeBudget = createAsyncThunk(
  'budgets/delete',
  async (id, thunkAPI) => {
    try {
      await budgetService.deleteBudget(id);
      return id;
    } catch (error) {
      const message = (error.response?.data?.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    clearBudgetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => { state.loading = true; })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload.data;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchBudgetProgress.pending, (state) => { state.loading = true; })
      .addCase(fetchBudgetProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.progressData = action.payload.data;
      })
      .addCase(fetchBudgetProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchBudgetStats.pending, (state) => { state.loading = true; })
      .addCase(fetchBudgetStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchBudgetStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createNewBudget.pending, (state) => { state.loading = true; })
      .addCase(createNewBudget.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createNewBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateExistingBudget.pending, (state) => { state.loading = true; })
      .addCase(updateExistingBudget.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateExistingBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeBudget.pending, (state) => { state.loading = true; })
      .addCase(removeBudget.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBudgetError } = budgetSlice.actions;
export default budgetSlice.reducer;
