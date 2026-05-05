const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/v1/procurement', require('./routes/procurementRoutes'));
app.use('/api/v1/logs', require('./routes/logsRoutes'));
app.use('/api/v1/inventory', require('./routes/inventoryRoutes'));
app.use('/api/v1/sawmill', require('./routes/sawmillRoutes'));
app.use('/api/v1/optimizer', require('./routes/optimizerRoutes'));
app.use('/api/v1/production', require('./routes/productionRoutes'));
app.use('/api/v1/sales', require('./routes/salesRoutes'));
app.use('/api/v1/export', require('./routes/exportRoutes'));
app.use('/api/v1/finance', require('./routes/financeRoutes'));
app.use('/api/v1/analytics', require('./routes/analyticsRoutes'));

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`TimberERP Server running on port ${PORT}`);
});
