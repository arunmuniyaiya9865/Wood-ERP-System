import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchInventoryItems = createAsyncThunk('inventory/fetchItems', async (filters, thunkAPI) => {
  try {
    const response = await api.get('/inventory', { params: filters });
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchInventoryStats = createAsyncThunk('inventory/fetchStats', async (_, thunkAPI) => {
  try {
    const response = await api.get('/inventory/stats');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: { items: [], stats: {}, loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryItems.pending, (state) => { state.loading = true; })
      .addCase(fetchInventoryItems.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchInventoryStats.fulfilled, (state, action) => { state.stats = action.payload; });
  }
});

export default inventorySlice.reducer;
