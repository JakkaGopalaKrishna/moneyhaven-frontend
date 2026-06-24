import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';
import { updateProfileUser, uploadAvatarUser, deleteAvatarUser } from './profileSlice';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  otpSent: false,
  otpVerified: false,
  otpLoading: false,
};

// Send OTP
export const sendOtpUser = createAsyncThunk(
  'auth/sendOtp',
  async (email, thunkAPI) => {
    try {
      return await authService.sendOtp(email);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Verify OTP
export const verifyOtpUser = createAsyncThunk(
  'auth/verifyOtp',
  async (data, thunkAPI) => {
    try {
      return await authService.verifyOtp(data);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Register user
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get current user
export const getCurrentUser = createAsyncThunk(
  'auth/getMe',
  async (_, thunkAPI) => {
    try {
      return await authService.getMe();
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuth: () => initialState,
    resetOtpState: (state) => {
      state.otpSent = false;
      state.otpVerified = false;
      state.otpLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOtpUser.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
      })
      .addCase(sendOtpUser.fulfilled, (state) => {
        state.otpLoading = false;
        state.otpSent = true;
      })
      .addCase(sendOtpUser.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyOtpUser.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
      })
      .addCase(verifyOtpUser.fulfilled, (state) => {
        state.otpLoading = false;
        state.otpVerified = true;
      })
      .addCase(verifyOtpUser.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Profile Updates Sync
      .addCase(updateProfileUser.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload.user };
        }
      })
      .addCase(uploadAvatarUser.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload.user };
        }
      })
      .addCase(deleteAvatarUser.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload.user };
        }
      });
  },
});

export const { clearError, resetAuth, resetOtpState } = authSlice.actions;
export default authSlice.reducer;
