import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reportService from '../services/reportService';

const initialState = {
  history: [],
  preview: null,
  loading: false,
  exportLoading: false,
  error: null,
};

export const fetchReportPreview = createAsyncThunk(
  'reports/fetchPreview',
  async ({ reportType, filters }, thunkAPI) => {
    try {
      return await reportService.getPreview(reportType, filters);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchReportHistory = createAsyncThunk(
  'reports/fetchHistory',
  async (_, thunkAPI) => {
    try {
      return await reportService.getHistory();
    } catch (error) {
      const message = (error.response?.data?.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const exportReportFile = createAsyncThunk(
  'reports/exportFile',
  async ({ format, reportType, filters }, thunkAPI) => {
    try {
      const blob = await reportService.exportReport(format, reportType, filters);
      
      // Determine file extension
      let ext = 'pdf';
      if (format === 'csv') ext = 'csv';
      if (format === 'excel') ext = 'xlsx';

      // Create a temporary link to download the blob
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      // Using a generic name here, the backend sets the proper content-disposition but
      // sometimes browser overrides it if we set link.download. So we try to let backend name it.
      // Actually, axios doesn't expose filename easily from headers without exposing them.
      link.setAttribute('download', `MoneyHaven_${reportType.replace(/\\s+/g, '_')}_Export.${ext}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      return true;
    } catch (error) {
      const message = (error.response?.data?.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearReportError: (state) => {
      state.error = null;
    },
    clearPreview: (state) => {
      state.preview = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Preview
      .addCase(fetchReportPreview.pending, (state) => { state.loading = true; })
      .addCase(fetchReportPreview.fulfilled, (state, action) => {
        state.loading = false;
        state.preview = action.payload.data;
      })
      .addCase(fetchReportPreview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // History
      .addCase(fetchReportHistory.pending, (state) => { state.loading = true; })
      .addCase(fetchReportHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload.data;
      })
      .addCase(fetchReportHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Export
      .addCase(exportReportFile.pending, (state) => { state.exportLoading = true; })
      .addCase(exportReportFile.fulfilled, (state) => { state.exportLoading = false; })
      .addCase(exportReportFile.rejected, (state, action) => {
        state.exportLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReportError, clearPreview } = reportSlice.actions;
export default reportSlice.reducer;
