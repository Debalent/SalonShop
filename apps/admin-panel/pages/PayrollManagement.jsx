import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, IconButton, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Chip, Tabs, Tab, InputAdornment, CircularProgress, Alert, Snackbar,
  LinearProgress, Divider, Pagination
} from '@mui/material';
import {
  AttachMoney, TrendingUp, AccountBalance, Receipt,
  CheckCircle, HourglassEmpty, ThumbUp, Search, Refresh,
  Download, Print
} from '@mui/icons-material';

const PayrollManagement = () => {
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [generateForm, setGenerateForm] = useState({ payPeriodStart: '', payPeriodEnd: '' });

  const mockPayroll = [
    { _id: '1', staff: { firstName: 'Maria', lastName: 'Rodriguez', role: 'stylist' }, payPeriodStart: '2026-02-16', payPeriodEnd: '2026-02-28', hours: { regular: 72, overtime: 4, total: 76 }, earnings: { regular: 1800, overtime: 150, commission: 634.50, tips: 380, bonuses: 0, grossPay: 2964.50 }, deductions: { federalTax: 355.74, stateTax: 148.23, socialSecurity: 183.80, medicare: 42.98, totalDeductions: 730.75 }, netPay: 2233.75, status: 'paid', completedServices: 45 },
    { _id: '2', staff: { firstName: 'Lisa', lastName: 'Chen', role: 'technician' }, payPeriodStart: '2026-02-16', payPeriodEnd: '2026-02-28', hours: { regular: 68, overtime: 0, total: 68 }, earnings: { regular: 1496, overtime: 0, commission: 410.40, tips: 290, bonuses: 50, grossPay: 2246.40 }, deductions: { federalTax: 269.57, stateTax: 112.32, socialSecurity: 139.28, medicare: 32.57, totalDeductions: 553.74 }, netPay: 1692.66, status: 'approved', completedServices: 38 },
    { _id: '3', staff: { firstName: 'Anna', lastName: 'Kim', role: 'technician' }, payPeriodStart: '2026-02-16', payPeriodEnd: '2026-02-28', hours: { regular: 64, overtime: 2, total: 66 }, earnings: { regular: 1280, overtime: 60, commission: 289, tips: 210, bonuses: 0, grossPay: 1839 }, deductions: { federalTax: 220.68, stateTax: 91.95, socialSecurity: 114.02, medicare: 26.67, totalDeductions: 453.32 }, netPay: 1385.68, status: 'pending', completedServices: 32 },
    { _id: '4', staff: { firstName: 'Jessica', lastName: 'Tran', role: 'manager' }, payPeriodStart: '2026-02-16', payPeriodEnd: '2026-02-28', hours: { regular: 80, overtime: 6, total: 86 }, earnings: { regular: 2400, overtime: 270, commission: 918, tips: 450, bonuses: 100, grossPay: 4138 }, deductions: { federalTax: 496.56, stateTax: 206.90, socialSecurity: 256.56, medicare: 60.00, totalDeductions: 1020.02 }, netPay: 3117.98, status: 'draft', completedServices: 52 },
  ];

  useEffect(() => { fetchPayroll(); }, [activeTab, page]);

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      let filtered = [...mockPayroll];
      const statuses = [null, ['draft'], ['pending'], ['approved'], ['paid']];
      if (activeTab > 0 && statuses[activeTab]) filtered = filtered.filter(r => statuses[activeTab].includes(r.status));
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(r => `${r.staff.firstName} ${r.staff.lastName}`.toLowerCase().includes(s));
      }
      setPayrollRecords(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (recordId) => {
    setSnackbar({ open: true, message: 'Payroll record approved', severity: 'success' });
    fetchPayroll();
  };

  const handleProcess = async (recordId) => {
    setSnackbar({ open: true, message: 'Payroll processed and marked as paid', severity: 'success' });
    fetchPayroll();
  };

  const handleGenerate = async () => {
    setSnackbar({ open: true, message: 'Payroll records generated for the period', severity: 'success' });
    setGenerateOpen(false);
    fetchPayroll();
  };

  const statusConfig = {
    draft: { color: 'default', icon: <HourglassEmpty fontSize="small" /> },
    pending: { color: 'warning', icon: <HourglassEmpty fontSize="small" /> },
    approved: { color: 'info', icon: <ThumbUp fontSize="small" /> },
    paid: { color: 'success', icon: <CheckCircle fontSize="small" /> }
  };

  const totalGross = mockPayroll.reduce((s, r) => s + r.earnings.grossPay, 0);
  const totalNet = mockPayroll.reduce((s, r) => s + r.netPay, 0);
  const totalDeductions = mockPayroll.reduce((s, r) => s + r.deductions.totalDeductions, 0);

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Payroll Management</Typography>
        <Box display="flex" gap={1}>
          <Button variant="outlined" startIcon={<Download />}>Export</Button>
          <Button variant="contained" startIcon={<Receipt />} onClick={() => setGenerateOpen(true)}>Generate Payroll</Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Avatar sx={{ bgcolor: '#4CAF50', width: 40, height: 40 }}><AttachMoney /></Avatar>
                <Typography color="text.secondary">Total Gross Pay</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">${totalGross.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Avatar sx={{ bgcolor: '#2196F3', width: 40, height: 40 }}><AccountBalance /></Avatar>
                <Typography color="text.secondary">Total Net Pay</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">${totalNet.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Avatar sx={{ bgcolor: '#FF9800', width: 40, height: 40 }}><TrendingUp /></Avatar>
                <Typography color="text.secondary">Total Deductions</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">${totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Avatar sx={{ bgcolor: '#9C27B0', width: 40, height: 40 }}><Receipt /></Avatar>
                <Typography color="text.secondary">Staff Count</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">{mockPayroll.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField fullWidth size="small" placeholder="Search staff..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
              <Tab label="All" />
              <Tab label="Draft" />
              <Tab label="Pending" />
              <Tab label="Approved" />
              <Tab label="Paid" />
            </Tabs>
          </Grid>
        </Grid>
      </Paper>

      {/* Payroll Table */}
      <TableContainer component={Paper}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell>Staff</TableCell>
                <TableCell>Pay Period</TableCell>
                <TableCell align="center">Hours</TableCell>
                <TableCell align="right">Gross Pay</TableCell>
                <TableCell align="right">Deductions</TableCell>
                <TableCell align="right">Net Pay</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payrollRecords.map((record) => (
                <TableRow key={record._id} hover sx={{ cursor: 'pointer' }}
                  onClick={() => { setSelectedRecord(record); setDetailOpen(true); }}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                        {record.staff.firstName[0]}{record.staff.lastName[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">{record.staff.firstName} {record.staff.lastName}</Typography>
                        <Typography variant="caption" color="text.secondary">{record.staff.role}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{new Date(record.payPeriodStart).toLocaleDateString()} - {new Date(record.payPeriodEnd).toLocaleDateString()}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">{record.hours.regular}h</Typography>
                    {record.hours.overtime > 0 && <Typography variant="caption" color="warning.main">+{record.hours.overtime}h OT</Typography>}
                  </TableCell>
                  <TableCell align="right"><Typography fontWeight="medium">${record.earnings.grossPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography></TableCell>
                  <TableCell align="right"><Typography color="error">${record.deductions.totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight="bold" color="success.dark">${record.netPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography></TableCell>
                  <TableCell align="center">
                    <Chip icon={statusConfig[record.status].icon} label={record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      color={statusConfig[record.status].color} size="small" />
                  </TableCell>
                  <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                    {(record.status === 'draft' || record.status === 'pending') && (
                      <Button size="small" variant="outlined" color="info" onClick={() => handleApprove(record._id)}>Approve</Button>
                    )}
                    {record.status === 'approved' && (
                      <Button size="small" variant="contained" color="success" onClick={() => handleProcess(record._id)}>Process</Button>
                    )}
                    {record.status === 'paid' && (
                      <IconButton size="small"><Print fontSize="small" /></IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
        {selectedRecord && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Payroll Detail — {selectedRecord.staff.firstName} {selectedRecord.staff.lastName}</Typography>
                <Chip label={selectedRecord.status} color={statusConfig[selectedRecord.status].color} size="small" />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Pay Period: {new Date(selectedRecord.payPeriodStart).toLocaleDateString()} — {new Date(selectedRecord.payPeriodEnd).toLocaleDateString()}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Hours</Typography>
              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid item xs={4}><Typography variant="body2">Regular: {selectedRecord.hours.regular}h</Typography></Grid>
                <Grid item xs={4}><Typography variant="body2">Overtime: {selectedRecord.hours.overtime}h</Typography></Grid>
                <Grid item xs={4}><Typography variant="body2" fontWeight="medium">Total: {selectedRecord.hours.total}h</Typography></Grid>
              </Grid>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Earnings</Typography>
              {[ ['Regular Pay', selectedRecord.earnings.regular], ['Overtime Pay', selectedRecord.earnings.overtime], ['Commission', selectedRecord.earnings.commission], ['Tips', selectedRecord.earnings.tips], ['Bonuses', selectedRecord.earnings.bonuses] ].map(([label, val]) => (
                <Box key={label} display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2">{label}</Typography>
                  <Typography variant="body2">${val.toFixed(2)}</Typography>
                </Box>
              ))}
              <Box display="flex" justifyContent="space-between" mt={1} pt={1} borderTop="1px solid" borderColor="divider">
                <Typography fontWeight="bold">Gross Pay</Typography>
                <Typography fontWeight="bold">${selectedRecord.earnings.grossPay.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Deductions</Typography>
              {[ ['Federal Tax', selectedRecord.deductions.federalTax], ['State Tax', selectedRecord.deductions.stateTax], ['Social Security', selectedRecord.deductions.socialSecurity], ['Medicare', selectedRecord.deductions.medicare] ].map(([label, val]) => (
                <Box key={label} display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2">{label}</Typography>
                  <Typography variant="body2" color="error">-${val.toFixed(2)}</Typography>
                </Box>
              ))}
              <Box display="flex" justifyContent="space-between" mt={1} pt={1} borderTop="1px solid" borderColor="divider">
                <Typography fontWeight="bold">Total Deductions</Typography>
                <Typography fontWeight="bold" color="error">-${selectedRecord.deductions.totalDeductions.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" fontWeight="bold">Net Pay</Typography>
                <Typography variant="h6" fontWeight="bold" color="success.main">${selectedRecord.netPay.toFixed(2)}</Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailOpen(false)}>Close</Button>
              {selectedRecord.status === 'approved' && (
                <Button variant="contained" color="success" onClick={() => { handleProcess(selectedRecord._id); setDetailOpen(false); }}>Process Payment</Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Generate Payroll Dialog */}
      <Dialog open={generateOpen} onClose={() => setGenerateOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Generate Payroll</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            This will auto-calculate earnings for all active staff members for the selected pay period.
          </Typography>
          <TextField fullWidth label="Pay Period Start" type="date" InputLabelProps={{ shrink: true }}
            value={generateForm.payPeriodStart} onChange={(e) => setGenerateForm({ ...generateForm, payPeriodStart: e.target.value })} sx={{ mt: 2, mb: 2 }} />
          <TextField fullWidth label="Pay Period End" type="date" InputLabelProps={{ shrink: true }}
            value={generateForm.payPeriodEnd} onChange={(e) => setGenerateForm({ ...generateForm, payPeriodEnd: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenerateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleGenerate}
            disabled={!generateForm.payPeriodStart || !generateForm.payPeriodEnd}>Generate</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PayrollManagement;
