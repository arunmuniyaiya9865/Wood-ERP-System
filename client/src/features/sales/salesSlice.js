import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchCustomers = createAsyncThunk('sales/fetchCustomers', async (filters, thunkAPI) => {
  try {
    const response = await api.get('/sales/customers', { params: filters });
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchSalesOrders = createAsyncThunk('sales/fetchOrders', async (_, thunkAPI) => {
  try {
    const response = await api.get('/sales/orders');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchPipeline = createAsyncThunk('sales/fetchPipeline', async (_, thunkAPI) => {
  try {
    const response = await api.get('/sales/pipeline');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchSalesStats = createAsyncThunk('sales/fetchStats', async (_, thunkAPI) => {
  try {
    const response = await api.get('/sales/stats');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

const salesSlice = createSlice({
  name: 'sales',
  initialState: { customers: [], orders: [], pipeline: [], stats: {}, loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => { state.loading = true; })
      .addCase(fetchCustomers.fulfilled, (state, action) => { state.loading = false; state.customers = action.payload; })
      .addCase(fetchSalesOrders.fulfilled, (state, action) => { state.orders = action.payload; })
      .addCase(fetchPipeline.fulfilled, (state, action) => { state.pipeline = action.payload; })
      .addCase(fetchSalesStats.fulfilled, (state, action) => { state.stats = action.payload; });
  }
});

export default salesSlice.reducer;
