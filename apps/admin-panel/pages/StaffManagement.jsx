import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, IconButton, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Chip, Tabs, Tab, InputAdornment, CircularProgress, Switch, FormControlLabel,
  Rating, Tooltip, Alert, Snackbar
} from '@mui/material';
import {
  Add, Edit, Delete, Search, Phone, Email, Star, Schedule,
  FilterList, Refresh, PersonOff, Person, TrendingUp, MoreVert
} from '@mui/icons-material';

const roles = ['staff', 'technician', 'stylist', 'budtender', 'manager'];
const specialties = ['nails', 'hair', 'massage', 'facial', 'waxing', 'tattoo', 'piercing', 'dispensary'];

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', role: 'staff',
    password: '', hourlyRate: '', commissionRate: '', specialties: []
  });

  // Mock data for development
  const mockStaff = [
    { _id: '1', firstName: 'Maria', lastName: 'Rodriguez', email: 'maria@salon.com', phone: '(555) 123-4567', role: 'stylist', isActive: true, avatar: null, staffInfo: { specialty: ['hair', 'nails'], hourlyRate: 25, commissionRate: 15, schedule: {} }, performance: { monthlyRevenue: 4230, monthlyBookings: 45, averageRating: 4.9 } },
    { _id: '2', firstName: 'Lisa', lastName: 'Chen', email: 'lisa@salon.com', phone: '(555) 234-5678', role: 'technician', isActive: true, avatar: null, staffInfo: { specialty: ['massage', 'facial'], hourlyRate: 22, commissionRate: 12, schedule: {} }, performance: { monthlyRevenue: 3420, monthlyBookings: 38, averageRating: 4.8 } },
    { _id: '3', firstName: 'Anna', lastName: 'Kim', email: 'anna@salon.com', phone: '(555) 345-6789', role: 'technician', isActive: true, avatar: null, staffInfo: { specialty: ['nails'], hourlyRate: 20, commissionRate: 10, schedule: {} }, performance: { monthlyRevenue: 2890, monthlyBookings: 32, averageRating: 4.7 } },
    { _id: '4', firstName: 'David', lastName: 'Park', email: 'david@salon.com', phone: '(555) 456-7890', role: 'stylist', isActive: false, avatar: null, staffInfo: { specialty: ['hair', 'waxing'], hourlyRate: 23, commissionRate: 14, schedule: {} }, performance: { monthlyRevenue: 2650, monthlyBookings: 28, averageRating: 4.6 } },
    { _id: '5', firstName: 'Jessica', lastName: 'Tran', email: 'jessica@salon.com', phone: '(555) 567-8901', role: 'manager', isActive: true, avatar: null, staffInfo: { specialty: ['hair', 'facial', 'massage'], hourlyRate: 30, commissionRate: 18, schedule: {} }, performance: { monthlyRevenue: 5100, monthlyBookings: 52, averageRating: 4.9 } },
  ];

  useEffect(() => {
    fetchStaff();
  }, [search, roleFilter]);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      let filtered = [...mockStaff];
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(m => `${m.firstName} ${m.lastName}`.toLowerCase().includes(s) || m.email.toLowerCase().includes(s));
      }
      if (roleFilter) filtered = filtered.filter(m => m.role === roleFilter);
      if (activeTab === 1) filtered = filtered.filter(m => m.isActive);
      if (activeTab === 2) filtered = filtered.filter(m => !m.isActive);
      setStaff(filtered);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to fetch staff', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (member = null) => {
    if (member) {
      setEditingStaff(member);
      setFormData({
        firstName: member.firstName, lastName: member.lastName, email: member.email,
        phone: member.phone, role: member.role, password: '',
        hourlyRate: member.staffInfo?.hourlyRate || '', commissionRate: member.staffInfo?.commissionRate || '',
        specialties: member.staffInfo?.specialty || []
      });
    } else {
      setEditingStaff(null);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', role: 'staff', password: '', hourlyRate: '', commissionRate: '', specialties: [] });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      // TODO: Replace with actual API call
      setSnackbar({ open: true, message: editingStaff ? 'Staff member updated' : 'Staff member created', severity: 'success' });
      setDialogOpen(false);
      fetchStaff();
    } catch (error) {
      setSnackbar({ open: true, message: 'Operation failed', severity: 'error' });
    }
  };

  const handleToggleActive = async (member) => {
    try {
      // TODO: Replace with actual API call
      setSnackbar({ open: true, message: `${member.firstName} ${member.isActive ? 'deactivated' : 'activated'}`, severity: 'success' });
      fetchStaff();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update status', severity: 'error' });
    }
  };

  const statsCards = [
    { label: 'Total Staff', value: mockStaff.length, color: '#2196F3', icon: <Person /> },
    { label: 'Active', value: mockStaff.filter(m => m.isActive).length, color: '#4CAF50', icon: <Person /> },
    { label: 'Inactive', value: mockStaff.filter(m => !m.isActive).length, color: '#FF9800', icon: <PersonOff /> },
    { label: 'Avg Rating', value: '4.8', color: '#9C27B0', icon: <Star /> },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Staff Management</Typography>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Add Staff Member
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statsCards.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: stat.color, width: 48, height: 48 }}>{stat.icon}</Avatar>
                <Box>
                  <Typography color="text.secondary" variant="body2">{stat.label}</Typography>
                  <Typography variant="h5" fontWeight="bold">{stat.value}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField fullWidth size="small" placeholder="Search staff..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField select fullWidth size="small" label="Filter by Role" value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}>
              <MenuItem value="">All Roles</MenuItem>
              {roles.map(role => <MenuItem key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={5}>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
              <Tab label="All" />
              <Tab label="Active" />
              <Tab label="Inactive" />
            </Tabs>
          </Grid>
        </Grid>
      </Paper>

      {/* Staff Table */}
      <TableContainer component={Paper}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell>Staff Member</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Specialties</TableCell>
                <TableCell align="center">Rating</TableCell>
                <TableCell align="right">Revenue (30d)</TableCell>
                <TableCell align="center">Bookings</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member._id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {member.firstName[0]}{member.lastName[0]}
                      </Avatar>
                      <Box>
                        <Typography fontWeight="medium">{member.firstName} {member.lastName}</Typography>
                        <Typography variant="body2" color="text.secondary">{member.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={member.role} size="small"
                      color={member.role === 'manager' ? 'secondary' : 'default'} variant="outlined" />
                  </TableCell>
                  <TableCell>
                    {(member.staffInfo?.specialty || []).map(spec => (
                      <Chip key={spec} label={spec} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                      <Star sx={{ color: '#FFB400', fontSize: 18 }} />
                      <Typography variant="body2">{member.performance?.averageRating || '—'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="medium">${member.performance?.monthlyRevenue?.toLocaleString() || '0'}</Typography>
                  </TableCell>
                  <TableCell align="center">{member.performance?.monthlyBookings || 0}</TableCell>
                  <TableCell align="center">
                    <Chip label={member.isActive ? 'Active' : 'Inactive'} size="small"
                      color={member.isActive ? 'success' : 'default'} />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpenDialog(member)}><Edit fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="View Schedule"><IconButton size="small"><Schedule fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title={member.isActive ? 'Deactivate' : 'Activate'}>
                      <IconButton size="small" onClick={() => handleToggleActive(member)} color={member.isActive ? 'default' : 'success'}>
                        {member.isActive ? <PersonOff fontSize="small" /> : <Person fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {staff.length === 0 && (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4 }}><Typography color="text.secondary">No staff members found</Typography></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField fullWidth label="First Name" value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Last Name" value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" type="email" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Phone" value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
            </Grid>
            <Grid item xs={6}>
              <TextField select fullWidth label="Role" value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                {roles.map(role => <MenuItem key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</MenuItem>)}
              </TextField>
            </Grid>
            {!editingStaff && (
              <Grid item xs={12}>
                <TextField fullWidth label="Password" type="password" value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              </Grid>
            )}
            <Grid item xs={6}>
              <TextField fullWidth label="Hourly Rate" type="number" value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Commission Rate" type="number" value={formData.commissionRate}
                onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
            </Grid>
            <Grid item xs={12}>
              <TextField select fullWidth label="Specialties" value={formData.specialties}
                onChange={(e) => setFormData({ ...formData, specialties: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value })}
                SelectProps={{ multiple: true, renderValue: (selected) => selected.map(s => <Chip key={s} label={s} size="small" sx={{ mr: 0.5 }} />).reduce((prev, curr) => [prev, curr]) }}>
                {specialties.map(spec => <MenuItem key={spec} value={spec}>{spec.charAt(0).toUpperCase() + spec.slice(1)}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>{editingStaff ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default StaffManagement;
