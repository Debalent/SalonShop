import React, { useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, TextField, MenuItem,
  Switch, FormControlLabel, Tabs, Tab, Paper, Divider, Avatar,
  Alert, Snackbar, Chip, List, ListItem, ListItemText, ListItemIcon,
  ListItemSecondaryAction, IconButton, InputAdornment, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  Store, Palette, Notifications, Security, Payment, Language,
  Schedule, Save, Edit, Visibility, VisibilityOff, Add,
  Delete, LocationOn, Phone, Email, Public
} from '@mui/icons-material';

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showPassword, setShowPassword] = useState(false);

  // Business Settings
  const [business, setBusiness] = useState({
    name: 'SalonShop',
    tagline: 'Premium Beauty & Wellness',
    email: 'info@salonshop.com',
    phone: '(555) 100-2000',
    website: 'https://salonshop.com',
    address: '123 Main Street, Suite 100',
    city: 'Oklahoma City',
    state: 'OK',
    zip: '73101',
    timezone: 'America/Chicago',
    currency: 'USD',
    taxRate: 8.0,
    cancellationPolicy: '24 hours advance notice required for cancellations.',
    description: 'Full-service salon and spa offering hair, nails, massage, facial, and more.'
  });

  // Operating Hours
  const [hours, setHours] = useState({
    monday: { open: '09:00', close: '19:00', isOpen: true },
    tuesday: { open: '09:00', close: '19:00', isOpen: true },
    wednesday: { open: '09:00', close: '19:00', isOpen: true },
    thursday: { open: '09:00', close: '21:00', isOpen: true },
    friday: { open: '09:00', close: '21:00', isOpen: true },
    saturday: { open: '09:00', close: '18:00', isOpen: true },
    sunday: { open: '10:00', close: '16:00', isOpen: false },
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailBookingConfirmation: true,
    smsBookingReminder: true,
    emailDailyReport: true,
    pushNewBooking: true,
    pushCancellation: true,
    emailPayrollReady: true,
    lowStockAlert: true,
    reviewNotification: true,
    reminderHours: 2,
  });

  // Booking settings
  const [booking, setBooking] = useState({
    minAdvanceBooking: 30,
    maxAdvanceBooking: 90,
    slotDuration: 15,
    bufferTime: 10,
    allowOnlineBooking: true,
    requireDeposit: false,
    depositPercentage: 25,
    allowCancellation: true,
    cancellationWindow: 24,
    maxServicesPerBooking: 5,
    autoConfirm: false,
  });

  // Payment settings
  const [payment, setPayment] = useState({
    stripeEnabled: false,
    stripePublicKey: '',
    stripeSecretKey: '',
    acceptCash: true,
    acceptCard: true,
    acceptDigital: true,
    tipEnabled: true,
    defaultTipPercentages: [15, 18, 20, 25],
    autoTipDistribution: true,
  });

  // Appearance settings
  const [appearance, setAppearance] = useState({
    primaryColor: '#D32F2F',
    secondaryColor: '#FF5722',
    logo: '',
    favicon: '',
    theme: 'light',
  });

  const handleSave = (section) => {
    setSnackbar({ open: true, message: `${section} settings saved successfully`, severity: 'success' });
  };

  const tabContent = [
    { label: 'Business', icon: <Store /> },
    { label: 'Hours', icon: <Schedule /> },
    { label: 'Booking', icon: <Schedule /> },
    { label: 'Payments', icon: <Payment /> },
    { label: 'Notifications', icon: <Notifications /> },
    { label: 'Appearance', icon: <Palette /> },
    { label: 'Security', icon: <Security /> },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Settings</Typography>

      <Grid container spacing={3}>
        {/* Sidebar Tabs */}
        <Grid item xs={12} md={3}>
          <Paper>
            <Tabs orientation="vertical" value={activeTab} onChange={(_, v) => setActiveTab(v)}
              sx={{ borderRight: 1, borderColor: 'divider', '& .MuiTab-root': { alignItems: 'flex-start', textAlign: 'left' } }}>
              {tabContent.map((tab, idx) => (
                <Tab key={idx} label={tab.label} icon={tab.icon} iconPosition="start" sx={{ justifyContent: 'flex-start', minHeight: 48 }} />
              ))}
            </Tabs>
          </Paper>
        </Grid>

        {/* Content */}
        <Grid item xs={12} md={9}>
          {/* Business Settings */}
          {activeTab === 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Business Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Business Name" value={business.name} onChange={(e) => setBusiness({ ...business, name: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Tagline" value={business.tagline} onChange={(e) => setBusiness({ ...business, tagline: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email" value={business.email} onChange={(e) => setBusiness({ ...business, email: e.target.value })}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Phone" value={business.phone} onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Phone /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Website" value={business.website} onChange={(e) => setBusiness({ ...business, website: e.target.value })}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Public /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Address" value={business.address} onChange={(e) => setBusiness({ ...business, address: e.target.value })}
                    InputProps={{ startAdornment: <InputAdornment position="start"><LocationOn /></InputAdornment> }} />
                </Grid>
                <Grid item xs={4}>
                  <TextField fullWidth label="City" value={business.city} onChange={(e) => setBusiness({ ...business, city: e.target.value })} />
                </Grid>
                <Grid item xs={4}>
                  <TextField fullWidth label="State" value={business.state} onChange={(e) => setBusiness({ ...business, state: e.target.value })} />
                </Grid>
                <Grid item xs={4}>
                  <TextField fullWidth label="ZIP" value={business.zip} onChange={(e) => setBusiness({ ...business, zip: e.target.value })} />
                </Grid>
                <Grid item xs={6}>
                  <TextField select fullWidth label="Timezone" value={business.timezone} onChange={(e) => setBusiness({ ...business, timezone: e.target.value })}>
                    {['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Pacific/Honolulu'].map(tz => <MenuItem key={tz} value={tz}>{tz}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={3}>
                  <TextField select fullWidth label="Currency" value={business.currency} onChange={(e) => setBusiness({ ...business, currency: e.target.value })}>
                    {['USD', 'CAD', 'EUR', 'GBP'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={3}>
                  <TextField fullWidth label="Tax Rate" type="number" value={business.taxRate} onChange={(e) => setBusiness({ ...business, taxRate: parseFloat(e.target.value) })}
                    InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Description" value={business.description} onChange={(e) => setBusiness({ ...business, description: e.target.value })} multiline rows={3} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Cancellation Policy" value={business.cancellationPolicy} onChange={(e) => setBusiness({ ...business, cancellationPolicy: e.target.value })} multiline rows={2} />
                </Grid>
              </Grid>
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button variant="contained" startIcon={<Save />} onClick={() => handleSave('Business')}>Save Changes</Button>
              </Box>
            </Paper>
          )}

          {/* Hours Settings */}
          {activeTab === 1 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Operating Hours</Typography>
              {Object.entries(hours).map(([day, settings]) => (
                <Box key={day} display="flex" alignItems="center" gap={2} mb={2} p={2} bgcolor={settings.isOpen ? 'transparent' : 'grey.50'} borderRadius={1}>
                  <FormControlLabel control={<Switch checked={settings.isOpen} onChange={(e) => setHours({ ...hours, [day]: { ...settings, isOpen: e.target.checked } })} />}
                    label={day.charAt(0).toUpperCase() + day.slice(1)} sx={{ width: 150 }} />
                  {settings.isOpen ? (
                    <>
                      <TextField size="small" type="time" label="Open" value={settings.open}
                        onChange={(e) => setHours({ ...hours, [day]: { ...settings, open: e.target.value } })}
                        InputLabelProps={{ shrink: true }} sx={{ width: 140 }} />
                      <Typography>to</Typography>
                      <TextField size="small" type="time" label="Close" value={settings.close}
                        onChange={(e) => setHours({ ...hours, [day]: { ...settings, close: e.target.value } })}
                        InputLabelProps={{ shrink: true }} sx={{ width: 140 }} />
                    </>
                  ) : (
                    <Typography color="text.secondary">Closed</Typography>
                  )}
                </Box>
              ))}
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button variant="contained" startIcon={<Save />} onClick={() => handleSave('Hours')}>Save Hours</Button>
              </Box>
            </Paper>
          )}

          {/* Booking Settings */}
          {activeTab === 2 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Booking Configuration</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField fullWidth label="Min Advance Booking" type="number" value={booking.minAdvanceBooking}
                    onChange={(e) => setBooking({ ...booking, minAdvanceBooking: parseInt(e.target.value) })}
                    InputProps={{ endAdornment: <InputAdornment position="end">minutes</InputAdornment> }} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Max Advance Booking" type="number" value={booking.maxAdvanceBooking}
                    onChange={(e) => setBooking({ ...booking, maxAdvanceBooking: parseInt(e.target.value) })}
                    InputProps={{ endAdornment: <InputAdornment position="end">days</InputAdornment> }} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Slot Duration" type="number" value={booking.slotDuration}
                    onChange={(e) => setBooking({ ...booking, slotDuration: parseInt(e.target.value) })}
                    InputProps={{ endAdornment: <InputAdornment position="end">minutes</InputAdornment> }} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Buffer Between Appointments" type="number" value={booking.bufferTime}
                    onChange={(e) => setBooking({ ...booking, bufferTime: parseInt(e.target.value) })}
                    InputProps={{ endAdornment: <InputAdornment position="end">minutes</InputAdornment> }} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Max Services Per Booking" type="number" value={booking.maxServicesPerBooking}
                    onChange={(e) => setBooking({ ...booking, maxServicesPerBooking: parseInt(e.target.value) })} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Cancellation Window" type="number" value={booking.cancellationWindow}
                    onChange={(e) => setBooking({ ...booking, cancellationWindow: parseInt(e.target.value) })}
                    InputProps={{ endAdornment: <InputAdornment position="end">hours</InputAdornment> }} />
                </Grid>
                <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
                <Grid item xs={12}>
                  <FormControlLabel control={<Switch checked={booking.allowOnlineBooking} onChange={(e) => setBooking({ ...booking, allowOnlineBooking: e.target.checked })} />} label="Allow Online Booking" />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel control={<Switch checked={booking.autoConfirm} onChange={(e) => setBooking({ ...booking, autoConfirm: e.target.checked })} />} label="Auto-confirm Bookings" />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel control={<Switch checked={booking.requireDeposit} onChange={(e) => setBooking({ ...booking, requireDeposit: e.target.checked })} />} label="Require Deposit" />
                </Grid>
                {booking.requireDeposit && (
                  <Grid item xs={6}>
                    <TextField fullWidth label="Deposit Percentage" type="number" value={booking.depositPercentage}
                      onChange={(e) => setBooking({ ...booking, depositPercentage: parseInt(e.target.value) })}
                      InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
                  </Grid>
                )}
              </Grid>
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button variant="contained" startIcon={<Save />} onClick={() => handleSave('Booking')}>Save Settings</Button>
              </Box>
            </Paper>
          )}

          {/* Payment Settings */}
          {activeTab === 3 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Payment Configuration</Typography>
              <Alert severity="info" sx={{ mb: 3 }}>Stripe integration requires your API keys from the Stripe Dashboard.</Alert>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel control={<Switch checked={payment.stripeEnabled} onChange={(e) => setPayment({ ...payment, stripeEnabled: e.target.checked })} />} label="Enable Stripe Payments" />
                </Grid>
                {payment.stripeEnabled && (
                  <>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Stripe Publishable Key" value={payment.stripePublicKey}
                        onChange={(e) => setPayment({ ...payment, stripePublicKey: e.target.value })} placeholder="pk_live_..." />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Stripe Secret Key" type={showPassword ? 'text' : 'password'}
                        value={payment.stripeSecretKey} onChange={(e) => setPayment({ ...payment, stripeSecretKey: e.target.value })}
                        placeholder="sk_live_..."
                        InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
                    </Grid>
                  </>
                )}
                <Grid item xs={12}><Divider sx={{ my: 1 }} /><Typography variant="subtitle1" gutterBottom>Accepted Payment Methods</Typography></Grid>
                <Grid item xs={4}><FormControlLabel control={<Switch checked={payment.acceptCash} onChange={(e) => setPayment({ ...payment, acceptCash: e.target.checked })} />} label="Cash" /></Grid>
                <Grid item xs={4}><FormControlLabel control={<Switch checked={payment.acceptCard} onChange={(e) => setPayment({ ...payment, acceptCard: e.target.checked })} />} label="Card" /></Grid>
                <Grid item xs={4}><FormControlLabel control={<Switch checked={payment.acceptDigital} onChange={(e) => setPayment({ ...payment, acceptDigital: e.target.checked })} />} label="Digital / Mobile" /></Grid>
                <Grid item xs={12}><Divider sx={{ my: 1 }} /><Typography variant="subtitle1" gutterBottom>Tipping</Typography></Grid>
                <Grid item xs={12}><FormControlLabel control={<Switch checked={payment.tipEnabled} onChange={(e) => setPayment({ ...payment, tipEnabled: e.target.checked })} />} label="Enable Tipping" /></Grid>
                <Grid item xs={12}><FormControlLabel control={<Switch checked={payment.autoTipDistribution} onChange={(e) => setPayment({ ...payment, autoTipDistribution: e.target.checked })} />} label="Auto Tip Distribution" /></Grid>
                {payment.tipEnabled && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Default Tip Percentages</Typography>
                    <Box display="flex" gap={1}>
                      {payment.defaultTipPercentages.map((pct, i) => (
                        <Chip key={i} label={`${pct}%`} onDelete={() => setPayment({ ...payment, defaultTipPercentages: payment.defaultTipPercentages.filter((_, idx) => idx !== i) })} />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button variant="contained" startIcon={<Save />} onClick={() => handleSave('Payment')}>Save Settings</Button>
              </Box>
            </Paper>
          )}

          {/* Notification Settings */}
          {activeTab === 4 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Notification Preferences</Typography>
              <List>
                {[
                  { key: 'emailBookingConfirmation', label: 'Email booking confirmations', icon: <Email /> },
                  { key: 'smsBookingReminder', label: 'SMS booking reminders', icon: <Phone /> },
                  { key: 'emailDailyReport', label: 'Daily business report via email', icon: <Email /> },
                  { key: 'pushNewBooking', label: 'Push notification for new bookings', icon: <Notifications /> },
                  { key: 'pushCancellation', label: 'Push notification for cancellations', icon: <Notifications /> },
                  { key: 'emailPayrollReady', label: 'Email when payroll is ready', icon: <Email /> },
                  { key: 'lowStockAlert', label: 'Low stock alerts', icon: <Notifications /> },
                  { key: 'reviewNotification', label: 'New review notifications', icon: <Notifications /> },
                ].map(item => (
                  <ListItem key={item.key}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                    <ListItemSecondaryAction>
                      <Switch checked={notifications[item.key]}
                        onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })} />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <TextField fullWidth label="Reminder Lead Time" type="number" value={notifications.reminderHours}
                onChange={(e) => setNotifications({ ...notifications, reminderHours: parseInt(e.target.value) })}
                InputProps={{ endAdornment: <InputAdornment position="end">hours before appointment</InputAdornment> }}
                sx={{ maxWidth: 400 }} />
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button variant="contained" startIcon={<Save />} onClick={() => handleSave('Notification')}>Save Preferences</Button>
              </Box>
            </Paper>
          )}

          {/* Appearance Settings */}
          {activeTab === 5 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Appearance & Branding</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField fullWidth label="Primary Color" type="color" value={appearance.primaryColor}
                    onChange={(e) => setAppearance({ ...appearance, primaryColor: e.target.value })} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Secondary Color" type="color" value={appearance.secondaryColor}
                    onChange={(e) => setAppearance({ ...appearance, secondaryColor: e.target.value })} />
                </Grid>
                <Grid item xs={12}>
                  <TextField select fullWidth label="Theme" value={appearance.theme}
                    onChange={(e) => setAppearance({ ...appearance, theme: e.target.value })}>
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="system">System</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Preview</Typography>
                  <Box display="flex" gap={2}>
                    <Box sx={{ width: 100, height: 60, bgcolor: appearance.primaryColor, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography color="white" variant="body2">Primary</Typography>
                    </Box>
                    <Box sx={{ width: 100, height: 60, bgcolor: appearance.secondaryColor, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography color="white" variant="body2">Secondary</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button variant="contained" startIcon={<Save />} onClick={() => handleSave('Appearance')}>Save Theme</Button>
              </Box>
            </Paper>
          )}

          {/* Security Settings */}
          {activeTab === 6 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Security</Typography>
              <Alert severity="info" sx={{ mb: 3 }}>Configure security policies for your organization.</Alert>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel control={<Switch defaultChecked />} label="Require strong passwords (min 8 chars, mixed case, numbers)" />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel control={<Switch defaultChecked />} label="Enable two-factor authentication (2FA)" />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel control={<Switch />} label="Force password change every 90 days" />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel control={<Switch defaultChecked />} label="Lock account after 5 failed login attempts" />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Session Timeout" type="number" defaultValue={30}
                    InputProps={{ endAdornment: <InputAdornment position="end">minutes</InputAdornment> }} />
                </Grid>
                <Grid item xs={6}>
                  <TextField select fullWidth label="IP Whitelist Mode" defaultValue="disabled">
                    <MenuItem value="disabled">Disabled</MenuItem>
                    <MenuItem value="admin-only">Admin Only</MenuItem>
                    <MenuItem value="all">All Users</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button variant="contained" startIcon={<Save />} onClick={() => handleSave('Security')}>Save Security Settings</Button>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
