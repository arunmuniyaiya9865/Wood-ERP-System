import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchShipments = createAsyncThunk('export/fetchShipments', async (_, thunkAPI) => {
  try {
    const response = await api.get('/export/shipments');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchExportDocuments = createAsyncThunk('export/fetchDocs', async (_, thunkAPI) => {
  try {
    const response = await api.get('/export/documents');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchExportStats = createAsyncThunk('export/fetchStats', async (_, thunkAPI) => {
  try {
    const response = await api.get('/export/stats');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

const exportSlice = createSlice({
  name: 'export',
  initialState: { shipments: [], documents: [], stats: {}, loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShipments.pending, (state) => { state.loading = true; })
      .addCase(fetchShipments.fulfilled, (state, action) => { state.loading = false; state.shipments = action.payload; })
      .addCase(fetchExportDocuments.fulfilled, (state, action) => { state.documents = action.payload; })
      .addCase(fetchExportStats.fulfilled, (state, action) => { state.stats = action.payload; });
  }
});

export default exportSlice.reducer;
