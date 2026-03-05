import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Chip, Tabs, Tab, InputAdornment, CircularProgress, Avatar,
  ToggleButton, ToggleButtonGroup, Tooltip, Alert, Snackbar, Pagination
} from '@mui/material';
import {
  Search, FilterList, Refresh, Event, Schedule, CheckCircle,
  Cancel, HourglassEmpty, PlayArrow, ViewList, CalendarMonth
} from '@mui/icons-material';

const statusColors = {
  pending: 'warning', confirmed: 'info', 'in-progress': 'primary',
  completed: 'success', cancelled: 'error', 'no-show': 'default'
};

const statusIcons = {
  pending: <HourglassEmpty fontSize="small" />, confirmed: <CheckCircle fontSize="small" />,
  'in-progress': <PlayArrow fontSize="small" />, completed: <CheckCircle fontSize="small" />,
  cancelled: <Cancel fontSize="small" />, 'no-show': <Cancel fontSize="small" />
};

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState('list');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const mockBookings = [
    { _id: '1', customer: { firstName: 'Sarah', lastName: 'Johnson' }, staff: { firstName: 'Maria', lastName: 'Rodriguez' }, services: [{ serviceType: { name: 'Hair Cut & Color' }, price: 120, duration: 90 }], appointmentDate: '2026-03-04', startTime: '10:00', endTime: '11:30', status: 'confirmed', totalAmount: 120, finalAmount: 129.60, notes: { customer: 'First-time color treatment' } },
    { _id: '2', customer: { firstName: 'John', lastName: 'Smith' }, staff: { firstName: 'Lisa', lastName: 'Chen' }, services: [{ serviceType: { name: 'Deep Tissue Massage' }, price: 90, duration: 60 }], appointmentDate: '2026-03-04', startTime: '11:30', endTime: '12:30', status: 'in-progress', totalAmount: 90, finalAmount: 97.20, notes: {} },
    { _id: '3', customer: { firstName: 'Emily', lastName: 'Davis' }, staff: { firstName: 'Anna', lastName: 'Kim' }, services: [{ serviceType: { name: 'Manicure' }, price: 25, duration: 30 }, { serviceType: { name: 'Pedicure' }, price: 35, duration: 45 }], appointmentDate: '2026-03-04', startTime: '14:00', endTime: '15:15', status: 'pending', totalAmount: 60, finalAmount: 64.80, notes: {} },
    { _id: '4', customer: { firstName: 'Michael', lastName: 'Lee' }, staff: { firstName: 'Jessica', lastName: 'Tran' }, services: [{ serviceType: { name: 'Hair Cut' }, price: 35, duration: 30 }], appointmentDate: '2026-03-05', startTime: '09:00', endTime: '09:30', status: 'confirmed', totalAmount: 35, finalAmount: 37.80, notes: {} },
    { _id: '5', customer: { firstName: 'Amy', lastName: 'Wang' }, staff: { firstName: 'Maria', lastName: 'Rodriguez' }, services: [{ serviceType: { name: 'Full Highlights' }, price: 180, duration: 120 }], appointmentDate: '2026-03-03', startTime: '13:00', endTime: '15:00', status: 'completed', totalAmount: 180, finalAmount: 194.40, notes: { customer: 'Prefer platinum blonde' } },
    { _id: '6', customer: { firstName: 'Robert', lastName: 'Garcia' }, staff: { firstName: 'David', lastName: 'Park' }, services: [{ serviceType: { name: 'Beard Trim' }, price: 20, duration: 20 }], appointmentDate: '2026-03-02', startTime: '16:00', endTime: '16:20', status: 'cancelled', totalAmount: 20, finalAmount: 21.60, cancellationReason: 'Customer request' },
  ];

  useEffect(() => { fetchBookings(); }, [search, statusFilter, activeTab, page]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      let filtered = [...mockBookings];
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(b =>
          `${b.customer.firstName} ${b.customer.lastName}`.toLowerCase().includes(s) ||
          `${b.staff.firstName} ${b.staff.lastName}`.toLowerCase().includes(s) ||
          b.services.some(svc => svc.serviceType.name.toLowerCase().includes(s))
        );
      }
      if (statusFilter) filtered = filtered.filter(b => b.status === statusFilter);
      const tabStatuses = [null, ['pending', 'confirmed'], ['in-progress'], ['completed'], ['cancelled', 'no-show']];
      if (activeTab > 0 && tabStatuses[activeTab]) filtered = filtered.filter(b => tabStatuses[activeTab].includes(b.status));
      setBookings(filtered);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to fetch bookings', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      // TODO: API call
      setSnackbar({ open: true, message: `Booking status updated to ${newStatus}`, severity: 'success' });
      fetchBookings();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update status', severity: 'error' });
    }
  };

  const todayBookings = mockBookings.filter(b => b.appointmentDate === '2026-03-04');
  const statsCards = [
    { label: "Today's Bookings", value: todayBookings.length, color: '#2196F3' },
    { label: 'Pending', value: mockBookings.filter(b => b.status === 'pending').length, color: '#FF9800' },
    { label: 'In Progress', value: mockBookings.filter(b => b.status === 'in-progress').length, color: '#D32F2F' },
    { label: "Today's Revenue", value: `$${todayBookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.finalAmount, 0).toFixed(0)}`, color: '#4CAF50' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Booking Management</Typography>
        <Box display="flex" gap={1}>
          <ToggleButtonGroup value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)} size="small">
            <ToggleButton value="list"><ViewList /></ToggleButton>
            <ToggleButton value="calendar"><CalendarMonth /></ToggleButton>
          </ToggleButtonGroup>
          <Button variant="outlined" startIcon={<Refresh />} onClick={fetchBookings}>Refresh</Button>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statsCards.map((stat, idx) => (
          <Grid item xs={6} sm={3} key={idx}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2">{stat.label}</Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color }}>{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField fullWidth size="small" placeholder="Search bookings..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} />
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField select fullWidth size="small" label="Status" value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {Object.keys(statusColors).map(s => <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField fullWidth size="small" type="date" label="From" InputLabelProps={{ shrink: true }}
              value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField fullWidth size="small" type="date" label="To" InputLabelProps={{ shrink: true }}
              value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto">
              <Tab label="All" />
              <Tab label="Upcoming" />
              <Tab label="Active" />
              <Tab label="Completed" />
              <Tab label="Cancelled" />
            </Tabs>
          </Grid>
        </Grid>
      </Paper>

      {/* Bookings Table */}
      <TableContainer component={Paper}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell>Customer</TableCell>
                <TableCell>Service(s)</TableCell>
                <TableCell>Staff</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id} hover onClick={() => { setSelectedBooking(booking); setDetailOpen(true); }}
                  sx={{ cursor: 'pointer' }}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', fontSize: 14 }}>
                        {booking.customer.firstName[0]}{booking.customer.lastName[0]}
                      </Avatar>
                      <Typography variant="body2">{booking.customer.firstName} {booking.customer.lastName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {booking.services.map((svc, i) => (
                      <Chip key={i} label={svc.serviceType.name} size="small" sx={{ mr: 0.5, mb: 0.5 }} variant="outlined" />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{booking.staff.firstName} {booking.staff.lastName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">{new Date(booking.appointmentDate).toLocaleDateString()}</Typography>
                    <Typography variant="caption" color="text.secondary">{booking.startTime} - {booking.endTime}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="medium">${booking.finalAmount.toFixed(2)}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip icon={statusIcons[booking.status]} label={booking.status.replace('-', ' ')}
                      color={statusColors[booking.status]} size="small" />
                  </TableCell>
                  <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                    {booking.status === 'pending' && (
                      <>
                        <Tooltip title="Confirm"><IconButton size="small" color="success" onClick={() => handleStatusChange(booking._id, 'confirmed')}><CheckCircle fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Cancel"><IconButton size="small" color="error" onClick={() => handleStatusChange(booking._id, 'cancelled')}><Cancel fontSize="small" /></IconButton></Tooltip>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <Tooltip title="Start"><IconButton size="small" color="primary" onClick={() => handleStatusChange(booking._id, 'in-progress')}><PlayArrow fontSize="small" /></IconButton></Tooltip>
                    )}
                    {booking.status === 'in-progress' && (
                      <Tooltip title="Complete"><IconButton size="small" color="success" onClick={() => handleStatusChange(booking._id, 'completed')}><CheckCircle fontSize="small" /></IconButton></Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {bookings.length === 0 && (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><Typography color="text.secondary">No bookings found</Typography></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination count={1} page={page} onChange={(_, v) => setPage(v)} color="primary" />
      </Box>

      {/* Booking Detail Dialog */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
        {selectedBooking && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Booking Details</Typography>
                <Chip label={selectedBooking.status.replace('-', ' ')} color={statusColors[selectedBooking.status]} size="small" />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                  <Typography>{selectedBooking.customer.firstName} {selectedBooking.customer.lastName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Staff</Typography>
                  <Typography>{selectedBooking.staff.firstName} {selectedBooking.staff.lastName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                  <Typography>{new Date(selectedBooking.appointmentDate).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Time</Typography>
                  <Typography>{selectedBooking.startTime} - {selectedBooking.endTime}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Services</Typography>
                  {selectedBooking.services.map((svc, i) => (
                    <Box key={i} display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">{svc.serviceType.name} ({svc.duration} min)</Typography>
                      <Typography variant="body2" fontWeight="medium">${svc.price.toFixed(2)}</Typography>
                    </Box>
                  ))}
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Subtotal</Typography>
                  <Typography>${selectedBooking.totalAmount.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Total (incl. tax)</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">${selectedBooking.finalAmount.toFixed(2)}</Typography>
                </Grid>
                {selectedBooking.notes?.customer && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                    <Typography variant="body2">{selectedBooking.notes.customer}</Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailOpen(false)}>Close</Button>
              {selectedBooking.status === 'pending' && (
                <Button variant="contained" color="success" onClick={() => { handleStatusChange(selectedBooking._id, 'confirmed'); setDetailOpen(false); }}>
                  Confirm Booking
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default BookingManagement;
