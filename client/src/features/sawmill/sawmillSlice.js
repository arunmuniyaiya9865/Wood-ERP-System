import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMachines = createAsyncThunk('sawmill/fetchMachines', async (_, thunkAPI) => {
  try {
    const response = await api.get('/sawmill/machines');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchQueue = createAsyncThunk('sawmill/fetchQueue', async (_, thunkAPI) => {
  try {
    const response = await api.get('/sawmill/queue');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

const sawmillSlice = createSlice({
  name: 'sawmill',
  initialState: { machines: [], queue: [], stats: {}, loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachines.pending, (state) => { state.loading = true; })
      .addCase(fetchMachines.fulfilled, (state, action) => { state.loading = false; state.machines = action.payload; })
      .addCase(fetchQueue.fulfilled, (state, action) => { state.queue = action.payload; });
  }
});

export default sawmillSlice.reducer;
