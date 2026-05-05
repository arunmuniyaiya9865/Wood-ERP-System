import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchOptimizationRuns = createAsyncThunk('optimizer/fetchRuns', async (_, thunkAPI) => {
  try {
    const response = await api.get('/optimizer/runs');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const runOptimizer = createAsyncThunk('optimizer/run', async (payload, thunkAPI) => {
  try {
    const response = await api.post('/optimizer/run', payload);
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchOptimizerStats = createAsyncThunk('optimizer/fetchStats', async (_, thunkAPI) => {
  try {
    const response = await api.get('/optimizer/stats');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

const optimizerSlice = createSlice({
  name: 'optimizer',
  initialState: { runs: [], stats: {}, loading: false, result: null },
  extraReducers: (builder) => {
    builder
      .addCase(runOptimizer.pending, (state) => { state.loading = true; })
      .addCase(runOptimizer.fulfilled, (state, action) => { state.loading = false; state.runs.unshift(action.payload); state.result = action.payload; })
      .addCase(fetchOptimizationRuns.fulfilled, (state, action) => { state.runs = action.payload; })
      .addCase(fetchOptimizerStats.fulfilled, (state, action) => { state.stats = action.payload; });
  }
});

export default optimizerSlice.reducer;
