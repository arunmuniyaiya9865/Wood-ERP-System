import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchWorkOrders = createAsyncThunk('production/fetchWOs', async (filters, thunkAPI) => {
  try {
    const response = await api.get('/production/work-orders', { params: filters });
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchProductionStats = createAsyncThunk('production/fetchStats', async (_, thunkAPI) => {
  try {
    const response = await api.get('/production/stats');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

const productionSlice = createSlice({
  name: 'production',
  initialState: { workOrders: [], stats: {}, loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchWorkOrders.fulfilled, (state, action) => { state.loading = false; state.workOrders = action.payload; })
      .addCase(fetchProductionStats.fulfilled, (state, action) => { state.stats = action.payload; });
  }
});

export default productionSlice.reducer;
