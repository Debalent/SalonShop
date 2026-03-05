import React, { useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, MenuItem, TextField,
  Tabs, Tab, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, LinearProgress, Avatar
} from '@mui/material';
import {
  TrendingUp, TrendingDown, AttachMoney, People, Event,
  Star, ArrowUpward, ArrowDownward
} from '@mui/icons-material';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#D32F2F', '#FF5722', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#00BCD4', '#795548'];

const Analytics = () => {
  const [period, setPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState(0);

  // Revenue over time
  const revenueData = [
    { date: 'Week 1', revenue: 5200, bookings: 38, newCustomers: 12 },
    { date: 'Week 2', revenue: 6100, bookings: 42, newCustomers: 8 },
    { date: 'Week 3', revenue: 5800, bookings: 40, newCustomers: 15 },
    { date: 'Week 4', revenue: 7480, bookings: 48, newCustomers: 11 },
  ];

  // Service breakdown
  const serviceData = [
    { name: 'Hair Services', value: 35, revenue: 8450, bookings: 42, growth: 15 },
    { name: 'Nail Services', value: 28, revenue: 6230, bookings: 38, growth: 8 },
    { name: 'Massage', value: 20, revenue: 5890, bookings: 28, growth: 22 },
    { name: 'Facial', value: 12, revenue: 4010, bookings: 22, growth: 5 },
    { name: 'Other', value: 5, revenue: 2000, bookings: 14, growth: -3 },
  ];

  // Staff performance
  const staffData = [
    { name: 'Maria Rodriguez', revenue: 5100, bookings: 52, rating: 4.9, utilization: 92 },
    { name: 'Lisa Chen', revenue: 4230, bookings: 45, rating: 4.8, utilization: 87 },
    { name: 'Jessica Tran', revenue: 3420, bookings: 38, rating: 4.8, utilization: 78 },
    { name: 'Anna Kim', revenue: 2890, bookings: 32, rating: 4.7, utilization: 72 },
    { name: 'David Park', revenue: 2650, bookings: 28, rating: 4.6, utilization: 65 },
  ];

  // Customer data
  const customerData = [
    { month: 'Oct', new: 45, returning: 120, total: 165 },
    { month: 'Nov', new: 52, returning: 130, total: 182 },
    { month: 'Dec', new: 68, returning: 145, total: 213 },
    { month: 'Jan', new: 38, returning: 125, total: 163 },
    { month: 'Feb', new: 55, returning: 140, total: 195 },
    { month: 'Mar', new: 46, returning: 148, total: 194 },
  ];

  // Booking patterns
  const hourlyData = [
    { time: '9AM', bookings: 8 }, { time: '10AM', bookings: 15 }, { time: '11AM', bookings: 18 },
    { time: '12PM', bookings: 12 }, { time: '1PM', bookings: 10 }, { time: '2PM', bookings: 16 },
    { time: '3PM', bookings: 14 }, { time: '4PM', bookings: 11 }, { time: '5PM', bookings: 6 },
  ];

  const kpiCards = [
    { title: 'Total Revenue', value: '$24,580', change: 12.5, icon: <AttachMoney />, color: '#4CAF50' },
    { title: 'Total Bookings', value: '168', change: 8.2, icon: <Event />, color: '#2196F3' },
    { title: 'New Customers', value: '46', change: -5.1, icon: <People />, color: '#FF9800' },
    { title: 'Avg Rating', value: '4.8', change: 2.1, icon: <Star />, color: '#9C27B0' },
    { title: 'Avg Transaction', value: '$146', change: 4.3, icon: <TrendingUp />, color: '#D32F2F' },
    { title: 'Cancellation Rate', value: '4.2%', change: -18.0, icon: <TrendingDown />, color: '#795548' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Analytics & Insights</Typography>
        <TextField select size="small" value={period} onChange={(e) => setPeriod(e.target.value)} sx={{ minWidth: 150 }}>
          <MenuItem value="7d">Last 7 Days</MenuItem>
          <MenuItem value="30d">Last 30 Days</MenuItem>
          <MenuItem value="90d">Last 90 Days</MenuItem>
          <MenuItem value="365d">Last Year</MenuItem>
        </TextField>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {kpiCards.map((kpi, idx) => (
          <Grid item xs={6} sm={4} md={2} key={idx}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Avatar sx={{ bgcolor: kpi.color, width: 36, height: 36 }}>{kpi.icon}</Avatar>
                  <Chip size="small" label={`${kpi.change > 0 ? '+' : ''}${kpi.change}%`}
                    icon={kpi.change > 0 ? <ArrowUpward sx={{ fontSize: 14 }} /> : <ArrowDownward sx={{ fontSize: 14 }} />}
                    color={kpi.change > 0 ? 'success' : 'error'} sx={{ height: 24 }} />
                </Box>
                <Typography variant="h5" fontWeight="bold">{kpi.value}</Typography>
                <Typography variant="caption" color="text.secondary">{kpi.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Revenue" />
        <Tab label="Services" />
        <Tab label="Staff" />
        <Tab label="Customers" />
        <Tab label="Bookings" />
      </Tabs>

      {/* Revenue Tab */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Revenue Trend</Typography>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Area type="monotone" dataKey="revenue" stroke="#D32F2F" fill="#D32F2F" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Revenue by Service</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={serviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}%`}>
                    {serviceData.map((_, idx) => <Cell key={idx} fill={COLORS[idx]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Services Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Service Performance</Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={serviceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#D32F2F" name="Revenue ($)" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="bookings" fill="#2196F3" name="Bookings" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell>Service</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                    <TableCell align="center">Growth</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serviceData.map((svc) => (
                    <TableRow key={svc.name}>
                      <TableCell>{svc.name}</TableCell>
                      <TableCell align="right">${svc.revenue.toLocaleString()}</TableCell>
                      <TableCell align="center">
                        <Chip size="small" label={`${svc.growth > 0 ? '+' : ''}${svc.growth}%`}
                          color={svc.growth > 0 ? 'success' : 'error'} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}

      {/* Staff Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell>Staff Member</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                    <TableCell align="center">Bookings</TableCell>
                    <TableCell align="center">Rating</TableCell>
                    <TableCell>Utilization</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {staffData.map((s) => (
                    <TableRow key={s.name}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>{s.name.split(' ').map(n => n[0]).join('')}</Avatar>
                          <Typography>{s.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'medium' }}>${s.revenue.toLocaleString()}</TableCell>
                      <TableCell align="center">{s.bookings}</TableCell>
                      <TableCell align="center">
                        <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                          <Star sx={{ color: '#FFB400', fontSize: 16 }} /> {s.rating}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress variant="determinate" value={s.utilization} sx={{ flex: 1, height: 8, borderRadius: 4 }}
                            color={s.utilization > 80 ? 'success' : s.utilization > 60 ? 'warning' : 'error'} />
                          <Typography variant="body2">{s.utilization}%</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}

      {/* Customers Tab */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Customer Trends</Typography>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={customerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="new" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.1} name="New Customers" />
                  <Area type="monotone" dataKey="returning" stroke="#2196F3" fill="#2196F3" fillOpacity={0.1} name="Returning" />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Customer Retention Rate</Typography>
                <Typography variant="h3" fontWeight="bold" color="success.main">87%</Typography>
                <LinearProgress variant="determinate" value={87} sx={{ mt: 1, height: 8, borderRadius: 4 }} color="success" />
              </CardContent>
            </Card>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Avg Customer Lifetime Value</Typography>
                <Typography variant="h3" fontWeight="bold">$842</Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Net Promoter Score</Typography>
                <Typography variant="h3" fontWeight="bold" color="primary.main">72</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Bookings Tab */}
      {activeTab === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Bookings by Hour</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#D32F2F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Booking Status Breakdown</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={[
                    { name: 'Completed', value: 142, color: '#4CAF50' },
                    { name: 'Confirmed', value: 18, color: '#2196F3' },
                    { name: 'Pending', value: 8, color: '#FF9800' },
                    { name: 'Cancelled', value: 7, color: '#F44336' },
                    { name: 'No-show', value: 3, color: '#9E9E9E' },
                  ]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                    {[{ color: '#4CAF50' }, { color: '#2196F3' }, { color: '#FF9800' }, { color: '#F44336' }, { color: '#9E9E9E' }].map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Analytics;
