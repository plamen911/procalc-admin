import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

// Components
import Navbar from './components/Navbar';
import { ToastProvider } from './components/ToastContext';
import AuthProvider from './components/AuthProvider';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import InsuranceClausesList from './pages/InsuranceClauses/InsuranceClausesList';
import InsuranceClauseEdit from './pages/InsuranceClauses/InsuranceClauseEdit';
import TariffPresetsList from './pages/TariffPresets/TariffPresetsList';
import TariffPresetEdit from './pages/TariffPresets/TariffPresetEdit';
import TariffPresetCreate from './pages/TariffPresets/TariffPresetCreate';
import TariffPresetPreview from './pages/TariffPresets/TariffPresetPreview';
import AppConfigsList from './pages/AppConfigs/AppConfigsList';
import AppConfigEdit from './pages/AppConfigs/AppConfigEdit';
import UserProfile from './pages/Profile/UserProfile';
import UsersList from './pages/Users/UsersList';
import UserEdit from './pages/Users/UserEdit';
import UserCreate from './pages/Users/UserCreate';
import InsurancePoliciesList from './pages/InsurancePolicies/InsurancePoliciesList';
import InsurancePolicyDetails from './pages/InsurancePolicies/InsurancePolicyDetails';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#8B2131',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Public route */}
              <Route path="/login" element={<Login />} />

              {/* Protected routes */}
              <Route path="/*" element={
                <>
                  <Navbar />
                  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Routes>
                      <Route path="/" element={<Home />} />

                      {/* Insurance Clauses Routes */}
                      <Route path="/insurance-clauses" element={<InsuranceClausesList />} />
                      <Route path="/insurance-clauses/edit/:id" element={<InsuranceClauseEdit />} />

                      {/* Tariff Presets Routes */}
                      <Route path="/tariff-presets" element={<TariffPresetsList />} />
                      <Route path="/tariff-presets/create" element={<TariffPresetCreate />} />
                      <Route path="/tariff-presets/edit/:id" element={<TariffPresetEdit />} />
                      <Route path="/tariff-presets/preview/:id" element={<TariffPresetPreview />} />

                      {/* App Configs Routes */}
                      <Route path="/app-configs" element={<AppConfigsList />} />
                      <Route path="/app-configs/edit/:id" element={<AppConfigEdit />} />

                      {/* User Profile Route */}
                      <Route path="/profile" element={<UserProfile />} />

                      {/* User Management Routes */}
                      <Route path="/users" element={<UsersList />} />
                      <Route path="/users/create" element={<UserCreate />} />
                      <Route path="/users/edit/:id" element={<UserEdit />} />

                      {/* Insurance Policies Routes */}
                      <Route path="/insurance-policies" element={<InsurancePoliciesList />} />
                      <Route path="/insurance-policies/:id" element={<InsurancePolicyDetails />} />
                    </Routes>
                  </Container>
                </>
              } />
            </Routes>
          </AuthProvider>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App
