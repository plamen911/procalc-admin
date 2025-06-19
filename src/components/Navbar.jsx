import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from './AuthProvider';

const pages = [
  { name: 'Застрахователни клаузи', path: '/insurance-clauses' },
  { name: 'Тарифни пакети', path: '/tariff-presets' },
  { name: 'Конфигурация', path: '/app-configs' },
  { name: 'Потребители', path: '/users' }
];

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElDesktopNav, setAnchorElDesktopNav] = useState(null);
  const location = useLocation();
  const { logout, currentUser } = useAuth();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenDesktopNavMenu = (event) => {
    setAnchorElDesktopNav(event.currentTarget);
  };

  const handleCloseDesktopNavMenu = () => {
    setAnchorElDesktopNav(null);
  };

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Desktop logo */}
          <DashboardIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Калкулатор имущество
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {currentUser && currentUser.fullName && (
                <MenuItem 
                  sx={{
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    mb: 1,
                    pb: 1
                  }}
                  disabled
                >
                  <Typography 
                    textAlign="center"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <AccountCircleIcon sx={{ mr: 1 }} fontSize="small" />
                    {currentUser.fullName}
                  </Typography>
                </MenuItem>
              )}
              {pages.map((page) => (
                <MenuItem 
                  key={page.name} 
                  onClick={handleCloseNavMenu}
                  component={RouterLink}
                  to={page.path}
                  selected={isActive(page.path)}
                  sx={{
                    backgroundColor: isActive(page.path) ? 'rgba(139, 33, 49, 0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isActive(page.path) ? 'rgba(139, 33, 49, 0.2)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <Typography 
                    textAlign="center"
                    color={isActive(page.path) ? 'primary' : 'inherit'}
                    fontWeight={isActive(page.path) ? 'bold' : 'regular'}
                  >
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}

              {/* Profile link for mobile */}
              <MenuItem 
                component={RouterLink}
                to="/profile"
                onClick={handleCloseNavMenu}
                sx={{
                  borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                  mt: 1,
                  pt: 1
                }}
              >
                <Typography 
                  textAlign="center"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <AccountCircleIcon sx={{ mr: 1 }} fontSize="small" />
                  Профил
                </Typography>
              </MenuItem>

              {/* Logout button for mobile */}
              <MenuItem 
                onClick={() => {
                  handleCloseNavMenu();
                  handleLogout();
                }}
                sx={{
                  mt: 1
                }}
              >
                <Typography 
                  textAlign="center"
                  color="error"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                  Изход
                </Typography>
              </MenuItem>
            </Menu>
          </Box>

          {/* Mobile logo */}
          <DashboardIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Калкулатор имущество
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
            {currentUser && currentUser.fullName && (
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mr: 2,
                  color: 'white'
                }}
              >
                <AccountCircleIcon sx={{ mr: 1 }} fontSize="small" />
                {currentUser.fullName}
              </Typography>
            )}
            <Button
              onClick={handleOpenDesktopNavMenu}
              sx={{ 
                my: 2, 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
              endIcon={<MenuIcon />}
            >
              Меню
            </Button>
            <Menu
              id="desktop-menu-appbar"
              anchorEl={anchorElDesktopNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElDesktopNav)}
              onClose={handleCloseDesktopNavMenu}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.name} 
                  onClick={handleCloseDesktopNavMenu}
                  component={RouterLink}
                  to={page.path}
                  selected={isActive(page.path)}
                  sx={{
                    backgroundColor: isActive(page.path) ? 'rgba(139, 33, 49, 0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isActive(page.path) ? 'rgba(139, 33, 49, 0.2)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <Typography 
                    textAlign="center"
                    color={isActive(page.path) ? 'primary' : 'inherit'}
                    fontWeight={isActive(page.path) ? 'bold' : 'regular'}
                  >
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}

              {/* Profile link for desktop dropdown */}
              <MenuItem 
                component={RouterLink}
                to="/profile"
                onClick={handleCloseDesktopNavMenu}
                sx={{
                  borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                  mt: 1,
                  pt: 1
                }}
              >
                <Typography 
                  textAlign="center"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <AccountCircleIcon sx={{ mr: 1 }} fontSize="small" />
                  Профил
                </Typography>
              </MenuItem>

              {/* Logout button for desktop dropdown */}
              <MenuItem 
                onClick={() => {
                  handleCloseDesktopNavMenu();
                  handleLogout();
                }}
                sx={{
                  mt: 1
                }}
              >
                <Typography 
                  textAlign="center"
                  color="error"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                  Изход
                </Typography>
              </MenuItem>
            </Menu>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
