import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryService from '../services/categoryService';

const initialState = {
  categories: [],
  stats: null,
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, thunkAPI) => {
    try {
      return await categoryService.getCategories();
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchCategoryStats = createAsyncThunk(
  'categories/fetchStats',
  async (_, thunkAPI) => {
    try {
      return await categoryService.getCategoryStats();
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createNewCategory = createAsyncThunk(
  'categories/create',
  async (categoryData, thunkAPI) => {
    try {
      return await categoryService.createCategory(categoryData);
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateExistingCategory = createAsyncThunk(
  'categories/update',
  async ({ id, data }, thunkAPI) => {
    try {
      return await categoryService.updateCategory(id, data);
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeCategory = createAsyncThunk(
  'categories/delete',
  async (id, thunkAPI) => {
    try {
      await categoryService.deleteCategory(id);
      return id;
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCategoryStats.pending, (state) => { state.loading = true; })
      .addCase(fetchCategoryStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchCategoryStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createNewCategory.pending, (state) => { state.loading = true; })
      .addCase(createNewCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload.data);
      })
      .addCase(createNewCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateExistingCategory.pending, (state) => { state.loading = true; })
      .addCase(updateExistingCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(c => c._id === action.payload.data._id);
        if (index !== -1) {
          state.categories[index] = action.payload.data;
        }
      })
      .addCase(updateExistingCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeCategory.pending, (state) => { state.loading = true; })
      .addCase(removeCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Remove from list
        state.categories = state.categories.filter(c => c._id !== action.payload);
      })
      .addCase(removeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
