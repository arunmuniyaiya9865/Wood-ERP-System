import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchKPITrends = createAsyncThunk('analytics/fetchKPITrends', async (_, thunkAPI) => {
  try {
    const response = await api.get('/analytics/kpi-trends');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchRevenueTrend = createAsyncThunk('analytics/fetchRevenueTrend', async (_, thunkAPI) => {
  try {
    const response = await api.get('/analytics/revenue-trend');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchProductionAnalytics = createAsyncThunk('analytics/fetchProduction', async (_, thunkAPI) => {
  try {
    const response = await api.get('/analytics/production');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchAnalyticsStats = createAsyncThunk('analytics/fetchStats', async (_, thunkAPI) => {
  try {
    const response = await api.get('/analytics/stats');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: { kpiTrends: [], revenueTrend: [], productionAnalytics: [], stats: {}, loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKPITrends.pending, (state) => { state.loading = true; })
      .addCase(fetchKPITrends.fulfilled, (state, action) => { state.loading = false; state.kpiTrends = action.payload; })
      .addCase(fetchRevenueTrend.fulfilled, (state, action) => { state.revenueTrend = action.payload; })
      .addCase(fetchProductionAnalytics.fulfilled, (state, action) => { state.productionAnalytics = action.payload; })
      .addCase(fetchAnalyticsStats.fulfilled, (state, action) => { state.stats = action.payload; });
  }
});

export default analyticsSlice.reducer;
