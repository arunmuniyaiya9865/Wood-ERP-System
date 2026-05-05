const asyncHandler = require('express-async-handler');

const getKPITrends = asyncHandler(async (req, res) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = months.map(month => ({
    month,
    yield: Math.floor(Math.random() * 10) + 85,
    satisfaction: Math.floor(Math.random() * 10) + 90,
    otd: Math.floor(Math.random() * 15) + 80
  }));
  res.json(data);
});

const getRevenueTrend = asyncHandler(async (req, res) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = months.map(month => ({
    month,
    revenue: Math.floor(Math.random() * 100000) + 50000
  }));
  res.json(data);
});

const getProductionAnalytics = asyncHandler(async (req, res) => {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const data = weeks.map(week => ({
    week,
    Pine: Math.floor(Math.random() * 400) + 200,
    Oak: Math.floor(Math.random() * 300) + 150,
    Teak: Math.floor(Math.random() * 200) + 100
  }));
  res.json(data);
});

const getAnalyticsStats = asyncHandler(async (req, res) => {
  res.json({
    oee: 84.5,
    customerSat: 96.2,
    otdRate: 92.8,
    fscCompliance: 100
  });
});

module.exports = { getKPITrends, getRevenueTrend, getProductionAnalytics, getAnalyticsStats };
