import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import transactionService from '../services/transactionService';

const initialState = {
  transactions: [],
  stats: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  loading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (params, thunkAPI) => {
    try {
      return await transactionService.getTransactions(params);
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createNewTransaction = createAsyncThunk(
  'transactions/create',
  async (transactionData, thunkAPI) => {
    try {
      return await transactionService.createTransaction(transactionData);
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateExistingTransaction = createAsyncThunk(
  'transactions/update',
  async ({ id, data }, thunkAPI) => {
    try {
      return await transactionService.updateTransaction(id, data);
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeTransaction = createAsyncThunk(
  'transactions/delete',
  async (id, thunkAPI) => {
    try {
      await transactionService.deleteTransaction(id);
      return id;
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransactionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.data;
        state.pagination = {
          current: action.payload.page,
          pageSize: 10, // Assuming static limit for now or from params
          total: action.payload.total,
        };
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createNewTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewTransaction.fulfilled, (state, action) => {
        state.loading = false;
        // Don't append manually to avoid pagination mismatch, usually we re-fetch, but appending is okay if we are on page 1
      })
      .addCase(createNewTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateExistingTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateExistingTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.transactions.findIndex(t => t._id === action.payload.data._id);
        if (index !== -1) {
          state.transactions[index] = action.payload.data;
        }
      })
      .addCase(updateExistingTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(removeTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.filter(t => t._id !== action.payload);
      })
      .addCase(removeTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTransactionError } = transactionSlice.actions;
export default transactionSlice.reducer;
