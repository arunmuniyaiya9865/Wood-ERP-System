import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchDashboardStats = createAsyncThunk('dashboard/fetchStats', async (_, thunkAPI) => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchRevenueData = createAsyncThunk('dashboard/fetchRevenue', async (_, thunkAPI) => {
  try {
    const response = await api.get('/dashboard/revenue');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchProductionDataByDay = createAsyncThunk('dashboard/fetchProduction', async (_, thunkAPI) => {
  try {
    const response = await api.get('/dashboard/production');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchSpeciesMix = createAsyncThunk('dashboard/fetchSpeciesMix', async (_, thunkAPI) => {
  try {
    const response = await api.get('/dashboard/species-mix');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchRecentOrders = createAsyncThunk('dashboard/fetchRecentOrders', async (_, thunkAPI) => {
  try {
    const response = await api.get('/dashboard/recent-orders');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchStockAlerts = createAsyncThunk('dashboard/fetchStockAlerts', async (_, thunkAPI) => {
  try {
    const response = await api.get('/dashboard/stock-alerts');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: { stats: {}, revenue: [], production: [], speciesMix: [], recentOrders: [], stockAlerts: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => { state.loading = false; state.stats = action.payload; })
      .addCase(fetchRevenueData.fulfilled, (state, action) => { state.revenue = action.payload; })
      .addCase(fetchProductionDataByDay.fulfilled, (state, action) => { state.production = action.payload; })
      .addCase(fetchSpeciesMix.fulfilled, (state, action) => { state.speciesMix = action.payload; })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => { state.recentOrders = action.payload; })
      .addCase(fetchStockAlerts.fulfilled, (state, action) => { state.stockAlerts = action.payload; });
  }
});

export default dashboardSlice.reducer;
