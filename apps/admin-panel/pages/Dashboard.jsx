import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Event,
  AttachMoney,
  Schedule,
  Star,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  Refresh,
  Download,
  TrendingDown,
  CalendarToday,
  AccessTime,
  MonetizationOn,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced mock data with more detailed analytics
  const stats = [
    {
      title: 'Total Revenue',
      value: '$24,580',
      change: '+12.5%',
      trend: 'up',
      icon: <AttachMoney />,
      color: '#4CAF50',
      subtitle: 'vs last period',
    },
    {
      title: 'Total Appointments',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: <Event />,
      color: '#2196F3',
      subtitle: '156 completed',
    },
    {
      title: 'Active Staff',
      value: '12',
      change: '0%',
      trend: 'neutral',
      icon: <People />,
      color: '#FF9800',
      subtitle: '8 working today',
    },
    {
      title: 'Avg Rating',
      value: '4.8',
      change: '+0.2',
      trend: 'up',
      icon: <Star />,
      color: '#9C27B0',
      subtitle: 'from 89 reviews',
    },
  ];

  // Additional analytics data
  const performanceMetrics = [
    {
      title: 'Customer Retention',
      value: '87%',
      change: '+5.2%',
      trend: 'up',
      target: '90%',
    },
    {
      title: 'Staff Utilization',
      value: '78%',
      change: '-2.1%',
      trend: 'down',
      target: '85%',
    },
    {
      title: 'Avg Service Time',
      value: '67 min',
      change: '-3 min',
      trend: 'up',
      target: '60 min',
    },
    {
      title: 'Cancellation Rate',
      value: '4.2%',
      change: '-1.1%',
      trend: 'up',
      target: '3%',
    },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 18000, appointments: 120 },
    { month: 'Feb', revenue: 22000, appointments: 140 },
    { month: 'Mar', revenue: 19000, appointments: 125 },
    { month: 'Apr', revenue: 25000, appointments: 160 },
    { month: 'May', revenue: 23000, appointments: 145 },
    { month: 'Jun', revenue: 24580, appointments: 156 },
  ];

  const serviceData = [
    { name: 'Hair Services', value: 35, color: '#D32F2F' },
    { name: 'Nail Services', value: 28, color: '#FF5722' },
    { name: 'Massage', value: 20, color: '#4CAF50' },
    { name: 'Facial', value: 12, color: '#2196F3' },
    { name: 'Other', value: 5, color: '#9C27B0' },
  ];

  const recentAppointments = [
    {
      id: 1,
      customer: 'Sarah Johnson',
      service: 'Hair Cut & Color',
      time: '10:00 AM',
      staff: 'Maria Rodriguez',
      status: 'confirmed',
      amount: '$120',
      duration: '90 min',
    },
    {
      id: 2,
      customer: 'John Smith',
      service: 'Deep Tissue Massage',
      time: '11:30 AM',
      staff: 'Lisa Chen',
      status: 'in-progress',
      amount: '$90',
      duration: '60 min',
    },
    {
      id: 3,
      customer: 'Emily Davis',
      service: 'Manicure & Pedicure',
      time: '2:00 PM',
      staff: 'Anna Kim',
      status: 'pending',
      amount: '$45',
      duration: '45 min',
    },
  ];

  const topServices = [
    { name: 'Hair Services', revenue: '$8,450', bookings: 42, growth: '+15%' },
    { name: 'Nail Services', revenue: '$6,230', bookings: 38, growth: '+8%' },
    { name: 'Massage', revenue: '$5,890', bookings: 28, growth: '+22%' },
    { name: 'Facial', revenue: '$4,010', bookings: 22, growth: '+5%' },
  ];

  const staffPerformance = [
    { name: 'Maria Rodriguez', services: 45, revenue: '$4,230', rating: 4.9, status: 'Active' },
    { name: 'Lisa Chen', services: 38, revenue: '$3,420', rating: 4.8, status: 'Active' },
    { name: 'Anna Kim', services: 32, revenue: '$2,890', rating: 4.7, status: 'Active' },
    { name: 'David Park', services: 28, revenue: '$2,650', rating: 4.6, status: 'On Leave' },
  ];

  const alerts = [
    { type: 'warning', message: 'Low inventory: Hair color supplies running low', action: 'Reorder' },
    { type: 'info', message: 'Staff meeting scheduled for tomorrow at 9 AM', action: 'View Details' },
    { type: 'success', message: 'Monthly revenue target achieved!', action: 'View Report' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'in-progress':
        return 'primary';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting dashboard data...');
  };

  return (
    <Box>
      {/* Header with Controls */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's what's happening at your salon today.
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExport}
            size="small"
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={isLoading}
            size="small"
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Box>
      </Box>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Box mb={3}>
          {alerts.map((alert, index) => (
            <Alert
              key={index}
              severity={alert.type}
              action={
                <Button color="inherit" size="small">
                  {alert.action}
                </Button>
              }
              sx={{ mb: 1 }}
            >
              {alert.message}
            </Alert>
          ))}
        </Box>
      )}

      {/* Time Range Selector */}
      <Box mb={3}>
        <Tabs
          value={timeRange}
          onChange={(e, newValue) => setTimeRange(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="7 Days" value="7d" />
          <Tab label="30 Days" value="30d" />
          <Tab label="90 Days" value="90d" />
          <Tab label="1 Year" value="1y" />
        </Tabs>
      </Box>

      {/* Main Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.subtitle}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      {stat.trend === 'up' ? (
                        <ArrowUpward sx={{ color: '#4CAF50', fontSize: 16 }} />
                      ) : stat.trend === 'down' ? (
                        <TrendingDown sx={{ color: '#F44336', fontSize: 16 }} />
                      ) : null}
                      <Typography
                        variant="body2"
                        color={stat.trend === 'up' ? '#4CAF50' : stat.trend === 'down' ? '#F44336' : 'text.secondary'}
                        ml={0.5}
                      >
                        {stat.change}
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Performance Metrics */}
      <Typography variant="h6" gutterBottom fontWeight="bold" mb={2}>
        Performance Metrics
      </Typography>
      <Grid container spacing={3} mb={4}>
        {performanceMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2">
                  {metric.title}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {metric.value}
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  {metric.trend === 'up' ? (
                    <ArrowUpward sx={{ color: '#4CAF50', fontSize: 14 }} />
                  ) : (
                    <TrendingDown sx={{ color: '#F44336', fontSize: 14 }} />
                  )}
                  <Typography
                    variant="body2"
                    color={metric.trend === 'up' ? '#4CAF50' : '#F44336'}
                    ml={0.5}
                  >
                    {metric.change}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Target: {metric.target}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(parseFloat(metric.value) / parseFloat(metric.target.replace('%', '').replace(' min', '').replace('$', ''))) * 100}
                  sx={{ mt: 1, height: 4 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabbed Analytics Section */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Overview" />
          <Tab label="Services" />
          <Tab label="Staff" />
          <Tab label="Appointments" />
        </Tabs>

        {/* Overview Tab */}
        {activeTab === 0 && (
          <Grid container spacing={3} mt={2}>
            {/* Revenue Chart */}
            <Grid item xs={12} lg={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Revenue & Appointments Trend
                  </Typography>
                  <Box sx={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="revenue"
                          stroke="#D32F2F"
                          strokeWidth={3}
                          name="Revenue ($)"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="appointments"
                          stroke="#FF5722"
                          strokeWidth={3}
                          name="Appointments"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Service Distribution */}
            <Grid item xs={12} lg={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Service Distribution
                  </Typography>
                  <Box sx={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={serviceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {serviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  <Box mt={2}>
                    {serviceData.map((item, index) => (
                      <Box key={index} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Box display="flex" alignItems="center">
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: item.color,
                              mr: 1,
                            }}
                          />
                          <Typography variant="body2">{item.name}</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="bold">
                          {item.value}%
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Services Tab */}
        {activeTab === 1 && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Top Performing Services
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Service</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Bookings</TableCell>
                      <TableCell align="right">Growth</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topServices.map((service) => (
                      <TableRow key={service.name}>
                        <TableCell>{service.name}</TableCell>
                        <TableCell align="right">{service.revenue}</TableCell>
                        <TableCell align="right">{service.bookings}</TableCell>
                        <TableCell align="right">
                          <Box display="flex" alignItems="center">
                            <ArrowUpward sx={{ color: '#4CAF50', fontSize: 16, mr: 0.5 }} />
                            <Typography color="#4CAF50">{service.growth}</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Staff Tab */}
        {activeTab === 2 && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Staff Performance
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Staff Member</TableCell>
                      <TableCell align="right">Services</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Rating</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {staffPerformance.map((staff) => (
                      <TableRow key={staff.name}>
                        <TableCell>{staff.name}</TableCell>
                        <TableCell align="right">{staff.services}</TableCell>
                        <TableCell align="right">{staff.revenue}</TableCell>
                        <TableCell align="right">
                          <Box display="flex" alignItems="center">
                            <Star sx={{ color: '#FFD700', fontSize: 16, mr: 0.5 }} />
                            <Typography>{staff.rating}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={staff.status}
                            color={staff.status === 'Active' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Appointments Tab */}
        {activeTab === 3 && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Today's Appointments
                </Typography>
                <Box display="flex" gap={1}>
                  <Button size="small" startIcon={<CalendarToday />}>
                    Calendar View
                  </Button>
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                </Box>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Staff</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                              {appointment.customer[0]}
                            </Avatar>
                            {appointment.customer}
                          </Box>
                        </TableCell>
                        <TableCell>{appointment.service}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <AccessTime sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                            {appointment.time}
                          </Box>
                        </TableCell>
                        <TableCell>{appointment.staff}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <MonetizationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                            {appointment.amount}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={appointment.status}
                            color={getStatusColor(appointment.status)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;