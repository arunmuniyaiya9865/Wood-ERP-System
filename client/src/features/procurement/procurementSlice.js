import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';


// ==========================
// FETCH
// ==========================

export const fetchSuppliers = createAsyncThunk(
  'procurement/fetchSuppliers',
  async (filters, thunkAPI) => {
    try {
      const res = await api.get('/procurement/suppliers', { params: filters });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchPurchaseOrders = createAsyncThunk(
  'procurement/fetchPOs',
  async (filters, thunkAPI) => {
    try {
      const res = await api.get('/procurement/purchase-orders', { params: filters });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// ==========================
// (FUTURE READY) CREATE API
// ==========================

export const createPurchaseOrder = createAsyncThunk(
  'procurement/createPO',
  async (data, thunkAPI) => {
    try {
      const res = await api.post('/procurement/purchase-orders', data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createSupplier = createAsyncThunk(
  'procurement/createSupplier',
  async (data, thunkAPI) => {
    try {
      const res = await api.post('/procurement/suppliers', data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// ==========================
// SLICE
// ==========================

const procurementSlice = createSlice({
  name: 'procurement',
  initialState: {
    suppliers: [],
    purchaseOrders: [],
    
    loadingSuppliers: false,
    loadingPOs: false,
    creating: false,

    error: null
  },

  reducers: {
    // 🔥 LOCAL (instant UI update)
    addPurchaseOrder: (state, action) => {
      state.purchaseOrders.unshift(action.payload);
    },

    addSupplier: (state, action) => {
      state.suppliers.unshift(action.payload);
    }
  },

  extraReducers: (builder) => {
    builder

      // =====================
      // FETCH SUPPLIERS
      // =====================
      .addCase(fetchSuppliers.pending, (state) => {
        state.loadingSuppliers = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loadingSuppliers = false;
        state.suppliers = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loadingSuppliers = false;
        state.error = action.payload;
      })

      // =====================
      // FETCH POs
      // =====================
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.loadingPOs = true;
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.loadingPOs = false;
        state.purchaseOrders = action.payload;
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.loadingPOs = false;
        state.error = action.payload;
      })

      // =====================
      // CREATE PO (API)
      // =====================
      .addCase(createPurchaseOrder.pending, (state) => {
        state.creating = true;
      })
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.creating = false;
        state.purchaseOrders.unshift(action.payload);
      })
      .addCase(createPurchaseOrder.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })

      // =====================
      // CREATE SUPPLIER (API)
      // =====================
      .addCase(createSupplier.pending, (state) => {
        state.creating = true;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.creating = false;
        state.suppliers.unshift(action.payload);
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      });
  }
});


// EXPORTS
export const { addPurchaseOrder, addSupplier } = procurementSlice.actions;
export default procurementSlice.reducer;