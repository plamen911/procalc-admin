import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/auth';

// Create context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status on mount and when location changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is logged in
        const isLoggedIn = AuthService.isLoggedIn();
        console.log('Auth check - isLoggedIn:', isLoggedIn);

        if (isLoggedIn) {
          // Get user data
          const userData = AuthService.getCurrentUser();
          setCurrentUser(userData);
          console.log('User authenticated:', userData);
        } else {
          // If not on login page, redirect to login
          if (location.pathname !== '/login') {
            console.log('User not authenticated, redirecting to login');
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Authentication check error:', error);
        // On error, clear auth state and redirect to login
        AuthService.logout();
        if (location.pathname !== '/login') {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  // Provide auth context
  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login: async (username, password) => {
      try {
        const user = await AuthService.login(username, password);
        setCurrentUser(user);
        return user;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    logout: () => {
      AuthService.logout();
      setCurrentUser(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;