import React from 'react';
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
  // Mock data - replace with real data from API
  const stats = [
    {
      title: 'Total Revenue',
      value: '$24,580',
      change: '+12.5%',
      trend: 'up',
      icon: <AttachMoney />,
      color: '#4CAF50',
    },
    {
      title: 'Total Appointments',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: <Event />,
      color: '#2196F3',
    },
    {
      title: 'Active Staff',
      value: '12',
      change: '0%',
      trend: 'neutral',
      icon: <People />,
      color: '#FF9800',
    },
    {
      title: 'Avg Rating',
      value: '4.8',
      change: '+0.2',
      trend: 'up',
      icon: <Star />,
      color: '#9C27B0',
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
    },
    {
      id: 2,
      customer: 'John Smith',
      service: 'Deep Tissue Massage',
      time: '11:30 AM',
      staff: 'Lisa Chen',
      status: 'in-progress',
    },
    {
      id: 3,
      customer: 'Emily Davis',
      service: 'Manicure & Pedicure',
      time: '2:00 PM',
      staff: 'Anna Kim',
      status: 'pending',
    },
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Welcome back! Here's what's happening at your salon today.
      </Typography>

      {/* Stats Cards */}
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
                    <Box display="flex" alignItems="center" mt={1}>
                      {stat.trend === 'up' ? (
                        <ArrowUpward sx={{ color: '#4CAF50', fontSize: 16 }} />
                      ) : stat.trend === 'down' ? (
                        <ArrowDownward sx={{ color: '#F44336', fontSize: 16 }} />
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

      <Grid container spacing={3}>
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

        {/* Recent Appointments */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Today's Appointments
                </Typography>
                <IconButton>
                  <MoreVert />
                </IconButton>
              </Box>
              <List>
                {recentAppointments.map((appointment) => (
                  <ListItem key={appointment.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {appointment.customer[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {appointment.customer}
                          </Typography>
                          <Chip
                            label={appointment.status}
                            color={getStatusColor(appointment.status)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {appointment.service} • {appointment.time}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            with {appointment.staff}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;