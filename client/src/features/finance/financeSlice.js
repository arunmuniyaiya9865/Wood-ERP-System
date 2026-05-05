import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchInvoices = createAsyncThunk('finance/fetchInvoices', async (_, thunkAPI) => {
  try {
    const response = await api.get('/finance/invoices');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchCashFlow = createAsyncThunk('finance/fetchCashFlow', async (_, thunkAPI) => {
  try {
    const response = await api.get('/finance/cashflow');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchFinanceStats = createAsyncThunk('finance/fetchStats', async (_, thunkAPI) => {
  try {
    const response = await api.get('/finance/stats');
    return response.data;
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

const financeSlice = createSlice({
  name: 'finance',
  initialState: { invoices: [], cashFlow: [], stats: {}, loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => { state.loading = true; })
      .addCase(fetchInvoices.fulfilled, (state, action) => { state.loading = false; state.invoices = action.payload; })
      .addCase(fetchCashFlow.fulfilled, (state, action) => { state.cashFlow = action.payload; })
      .addCase(fetchFinanceStats.fulfilled, (state, action) => { state.stats = action.payload; });
  }
});

export default financeSlice.reducer;
