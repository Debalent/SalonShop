import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from 'react-query';

import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import StaffManagement from './pages/StaffManagement';
import BookingManagement from './pages/BookingManagement';
import Analytics from './pages/Analytics';
import PayrollManagement from './pages/PayrollManagement';
import InventoryManagement from './pages/InventoryManagement';
import Settings from './pages/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';

// Create a query client
const queryClient = new QueryClient();

// Theme inspired by Hideaway Pizza's color scheme
const theme = createTheme({
  palette: {
    primary: {
      main: '#D32F2F', // Rich red
      light: '#FF5252',
      dark: '#B71C1C',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FF5722', // Orange accent
      light: '#FF7043',
      dark: '#D84315',
      contrastText: '#fff',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Routes>
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/staff" element={<StaffManagement />} />
                          <Route path="/bookings" element={<BookingManagement />} />
                          <Route path="/analytics" element={<Analytics />} />
                          <Route path="/payroll" element={<PayrollManagement />} />
                          <Route path="/inventory" element={<InventoryManagement />} />
                          <Route path="/settings" element={<Settings />} />
                        </Routes>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;