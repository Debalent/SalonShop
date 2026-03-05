import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, IconButton, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Chip, Tabs, Tab, InputAdornment, CircularProgress, Alert, Snackbar,
  LinearProgress, Tooltip, Pagination
} from '@mui/material';
import {
  Add, Edit, Delete, Search, Warning, CheckCircle, Inventory as InventoryIcon,
  TrendingDown, Refresh, Download, LocalShipping, AddCircle, RemoveCircle
} from '@mui/icons-material';

const categories = ['Hair Products', 'Nail Products', 'Skin Care', 'Massage Oils', 'Tools', 'Cleaning', 'Other'];

const InventoryManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '', sku: '', category: '', currentStock: '', unit: 'pcs',
    costPrice: '', retailPrice: '', reorderPoint: '', reorderQuantity: '', brand: '', supplier: ''
  });
  const [adjustForm, setAdjustForm] = useState({ adjustment: '', reason: '', type: 'restock' });

  const mockItems = [
    { _id: '1', name: 'OPI Nail Polish — Classic Red', sku: 'NP-001', category: 'Nail Products', currentStock: 24, unit: 'bottles', costPrice: 4.50, retailPrice: 12.99, reorderPoint: 10, status: 'in-stock', brand: 'OPI' },
    { _id: '2', name: 'Professional Hair Dye — Blonde', sku: 'HD-003', category: 'Hair Products', currentStock: 8, unit: 'tubes', costPrice: 8.00, retailPrice: 0, reorderPoint: 15, status: 'low-stock', brand: 'Schwarzkopf' },
    { _id: '3', name: 'Massage Oil — Lavender', sku: 'MO-012', category: 'Massage Oils', currentStock: 0, unit: 'bottles', costPrice: 12.00, retailPrice: 25.00, reorderPoint: 5, status: 'out-of-stock', brand: 'DoTerra' },
    { _id: '4', name: 'Acrylic Nail Set', sku: 'NP-020', category: 'Nail Products', currentStock: 45, unit: 'sets', costPrice: 15.00, retailPrice: 35.00, reorderPoint: 10, status: 'in-stock', brand: 'Kiara Sky' },
    { _id: '5', name: 'Facial Cleanser — Gentle', sku: 'SC-005', category: 'Skin Care', currentStock: 3, unit: 'bottles', costPrice: 18.00, retailPrice: 45.00, reorderPoint: 5, status: 'low-stock', brand: 'CeraVe Professional' },
    { _id: '6', name: 'Disposable Gloves (Box of 100)', sku: 'CL-001', category: 'Cleaning', currentStock: 52, unit: 'boxes', costPrice: 8.00, retailPrice: 0, reorderPoint: 20, status: 'in-stock', brand: 'Medline' },
    { _id: '7', name: 'Hair Shears — Professional', sku: 'TL-008', category: 'Tools', currentStock: 6, unit: 'pairs', costPrice: 45.00, retailPrice: 0, reorderPoint: 2, status: 'in-stock', brand: 'Mizutani' },
    { _id: '8', name: 'Sanitizer Solution', sku: 'CL-003', category: 'Cleaning', currentStock: 18, unit: 'bottles', costPrice: 6.50, retailPrice: 0, reorderPoint: 10, status: 'in-stock', brand: 'Barbicide' },
  ];

  useEffect(() => { fetchItems(); }, [search, categoryFilter, activeTab, page]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      let filtered = [...mockItems];
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(i => i.name.toLowerCase().includes(s) || i.sku.toLowerCase().includes(s) || i.brand.toLowerCase().includes(s));
      }
      if (categoryFilter) filtered = filtered.filter(i => i.category === categoryFilter);
      const tabStatuses = [null, ['in-stock'], ['low-stock'], ['out-of-stock']];
      if (activeTab > 0 && tabStatuses[activeTab]) filtered = filtered.filter(i => tabStatuses[activeTab].includes(i.status));
      setItems(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, sku: item.sku, category: item.category, currentStock: item.currentStock,
        unit: item.unit, costPrice: item.costPrice, retailPrice: item.retailPrice || '', reorderPoint: item.reorderPoint,
        reorderQuantity: '', brand: item.brand, supplier: '' });
    } else {
      setEditingItem(null);
      setFormData({ name: '', sku: '', category: '', currentStock: '', unit: 'pcs', costPrice: '', retailPrice: '', reorderPoint: '', reorderQuantity: '', brand: '', supplier: '' });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSnackbar({ open: true, message: editingItem ? 'Item updated' : 'Item created', severity: 'success' });
    setDialogOpen(false);
    fetchItems();
  };

  const handleOpenAdjust = (item) => {
    setSelectedItem(item);
    setAdjustForm({ adjustment: '', reason: '', type: 'restock' });
    setAdjustOpen(true);
  };

  const handleAdjust = async () => {
    setSnackbar({ open: true, message: 'Stock adjusted successfully', severity: 'success' });
    setAdjustOpen(false);
    fetchItems();
  };

  const statusConfig = {
    'in-stock': { color: 'success', icon: <CheckCircle fontSize="small" /> },
    'low-stock': { color: 'warning', icon: <Warning fontSize="small" /> },
    'out-of-stock': { color: 'error', icon: <TrendingDown fontSize="small" /> },
  };

  const stockValue = mockItems.reduce((sum, i) => sum + (i.currentStock * i.costPrice), 0);
  const lowStockCount = mockItems.filter(i => i.status === 'low-stock').length;
  const outOfStockCount = mockItems.filter(i => i.status === 'out-of-stock').length;

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Inventory Management</Typography>
        <Box display="flex" gap={1}>
          <Button variant="outlined" startIcon={<Download />}>Export</Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>Add Item</Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar sx={{ bgcolor: '#2196F3', width: 40, height: 40 }}><InventoryIcon /></Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Items</Typography>
                  <Typography variant="h5" fontWeight="bold">{mockItems.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar sx={{ bgcolor: '#4CAF50', width: 40, height: 40 }}>$</Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Stock Value</Typography>
                  <Typography variant="h5" fontWeight="bold">${stockValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar sx={{ bgcolor: '#FF9800', width: 40, height: 40 }}><Warning /></Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Low Stock</Typography>
                  <Typography variant="h5" fontWeight="bold" color="warning.main">{lowStockCount}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar sx={{ bgcolor: '#F44336', width: 40, height: 40 }}><TrendingDown /></Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Out of Stock</Typography>
                  <Typography variant="h5" fontWeight="bold" color="error.main">{outOfStockCount}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {outOfStockCount > 0 && `${outOfStockCount} item(s) are out of stock. `}
          {lowStockCount > 0 && `${lowStockCount} item(s) are running low.`}
          {' '}Review and reorder as needed.
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField fullWidth size="small" placeholder="Search inventory..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField select fullWidth size="small" label="Category" value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}>
              <MenuItem value="">All Categories</MenuItem>
              {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
              <Tab label="All" />
              <Tab label="In Stock" />
              <Tab label="Low Stock" />
              <Tab label="Out of Stock" />
            </Tabs>
          </Grid>
        </Grid>
      </Paper>

      {/* Inventory Table */}
      <TableContainer component={Paper}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell>Product</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="center">Stock</TableCell>
                <TableCell align="center">Reorder Point</TableCell>
                <TableCell align="right">Cost</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id} hover>
                  <TableCell>
                    <Box>
                      <Typography fontWeight="medium">{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.brand}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell><Chip label={item.sku} size="small" variant="outlined" /></TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell align="center">
                    <Box>
                      <Typography fontWeight="medium">{item.currentStock} {item.unit}</Typography>
                      <LinearProgress variant="determinate"
                        value={Math.min((item.currentStock / Math.max(item.reorderPoint * 2, 1)) * 100, 100)}
                        sx={{ height: 4, borderRadius: 2, mt: 0.5 }}
                        color={item.status === 'in-stock' ? 'success' : item.status === 'low-stock' ? 'warning' : 'error'} />
                    </Box>
                  </TableCell>
                  <TableCell align="center">{item.reorderPoint}</TableCell>
                  <TableCell align="right">${item.costPrice.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <Chip icon={statusConfig[item.status]?.icon} label={item.status.replace('-', ' ')}
                      color={statusConfig[item.status]?.color} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Adjust Stock">
                      <IconButton size="small" onClick={() => handleOpenAdjust(item)}>
                        {item.status === 'out-of-stock' ? <AddCircle fontSize="small" color="success" /> : <LocalShipping fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpenDialog(item)}><Edit fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4 }}><Typography color="text.secondary">No items found</Typography></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItem ? 'Edit Item' : 'Add Inventory Item'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}><TextField fullWidth label="Product Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></Grid>
            <Grid item xs={6}><TextField fullWidth label="SKU" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} required disabled={!!editingItem} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} /></Grid>
            <Grid item xs={6}>
              <TextField select fullWidth label="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
                {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={3}><TextField fullWidth label="Stock" type="number" value={formData.currentStock} onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })} /></Grid>
            <Grid item xs={3}>
              <TextField select fullWidth label="Unit" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })}>
                {['pcs', 'bottles', 'tubes', 'sets', 'boxes', 'pairs', 'liters', 'oz'].map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth label="Cost Price" type="number" value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} required />
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth label="Retail Price" type="number" value={formData.retailPrice}
                onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth label="Reorder Point" type="number" value={formData.reorderPoint}
                onChange={(e) => setFormData({ ...formData, reorderPoint: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>{editingItem ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      {/* Adjust Stock Dialog */}
      <Dialog open={adjustOpen} onClose={() => setAdjustOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Adjust Stock — {selectedItem?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Current stock: {selectedItem?.currentStock} {selectedItem?.unit}
          </Typography>
          <TextField select fullWidth label="Adjustment Type" value={adjustForm.type} onChange={(e) => setAdjustForm({ ...adjustForm, type: e.target.value })} sx={{ mt: 2, mb: 2 }}>
            {['restock', 'usage', 'damage', 'return', 'correction', 'sale'].map(t => <MenuItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</MenuItem>)}
          </TextField>
          <TextField fullWidth label="Quantity" type="number" value={adjustForm.adjustment}
            onChange={(e) => setAdjustForm({ ...adjustForm, adjustment: e.target.value })}
            helperText="Positive to add, negative to remove" sx={{ mb: 2 }} />
          <TextField fullWidth label="Reason" value={adjustForm.reason}
            onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })} multiline rows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdjustOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdjust} disabled={!adjustForm.adjustment || !adjustForm.reason}>Adjust Stock</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default InventoryManagement;
