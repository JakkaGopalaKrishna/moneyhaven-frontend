import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import profileService from '../services/profileService';

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

// Get profile
export const getProfileUser = createAsyncThunk(
  'profile/getProfile',
  async (_, thunkAPI) => {
    try {
      return await profileService.getProfile();
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update profile
export const updateProfileUser = createAsyncThunk(
  'profile/updateProfile',
  async (userData, thunkAPI) => {
    try {
      return await profileService.updateProfile(userData);
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Change password
export const changePasswordUser = createAsyncThunk(
  'profile/changePassword',
  async (passwordData, thunkAPI) => {
    try {
      return await profileService.changePassword(passwordData);
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Upload avatar
export const uploadAvatarUser = createAsyncThunk(
  'profile/uploadAvatar',
  async (formData, thunkAPI) => {
    try {
      return await profileService.uploadAvatar(formData);
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete avatar
export const deleteAvatarUser = createAsyncThunk(
  'profile/deleteAvatar',
  async (_, thunkAPI) => {
    try {
      return await profileService.deleteAvatar();
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getProfileUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfileUser.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.user;
      })
      .addCase(getProfileUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfileUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfileUser.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.user;
      })
      .addCase(updateProfileUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Change Password
      .addCase(changePasswordUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(changePasswordUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePasswordUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload Avatar
      .addCase(uploadAvatarUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadAvatarUser.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.user;
      })
      .addCase(uploadAvatarUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Avatar
      .addCase(deleteAvatarUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAvatarUser.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.user;
      })
      .addCase(deleteAvatarUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
