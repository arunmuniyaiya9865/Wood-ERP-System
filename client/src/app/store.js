import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import procurementReducer from '../features/procurement/procurementSlice';
import logsReducer from '../features/logs/logsSlice';
import inventoryReducer from '../features/inventory/inventorySlice';
import sawmillReducer from '../features/sawmill/sawmillSlice';
import optimizerReducer from '../features/optimizer/optimizerSlice';
import productionReducer from '../features/production/productionSlice';
import salesReducer from '../features/sales/salesSlice';
import exportReducer from '../features/export/exportSlice';
import financeReducer from '../features/finance/financeSlice';
import analyticsReducer from '../features/analytics/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    procurement: procurementReducer,
    logs: logsReducer,
    inventory: inventoryReducer,
    sawmill: sawmillReducer,
    optimizer: optimizerReducer,
    production: productionReducer,
    sales: salesReducer,
    export: exportReducer,
    finance: financeReducer,
    analytics: analyticsReducer,
  },
});
