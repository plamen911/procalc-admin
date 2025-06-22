import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import UserManagementService from '../../services/UserManagementService';
import AuthService from '../../services/auth';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useToast } from '../../components/ToastContext';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { showSuccessToast, showErrorToast } = useToast();

  const fetchUsers = async () => {
    try {
      const data = await UserManagementService.getAll();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Неуспешно извличане на потребители';
      setError(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteClick = (user) => {
    // Get current user
    const currentUser = AuthService.getCurrentUser();

    // Debug log
    console.log('Delete click - Current user ID:', currentUser?.id, 'Type:', typeof currentUser?.id);
    console.log('Delete click - Target user ID:', user?.id, 'Type:', typeof user?.id);

    // Check if user is trying to delete themselves
    if (currentUser && (String(currentUser.id) === String(user.id) || (currentUser.id === undefined && currentUser.email === user.email))) {
      showErrorToast('Не можете да изтриете собствения си акаунт');
      return;
    }

    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    // Double-check that user is not trying to delete themselves
    const currentUser = AuthService.getCurrentUser();

    // Debug log
    console.log('Delete confirm - Current user ID:', currentUser?.id, 'Type:', typeof currentUser?.id);
    console.log('Delete confirm - Target user ID:', userToDelete?.id, 'Type:', typeof userToDelete?.id);

    if (currentUser && (String(currentUser.id) === String(userToDelete.id) || (currentUser.id === undefined && currentUser.email === userToDelete.email))) {
      showErrorToast('Не можете да изтриете собствения си акаунт');
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      return;
    }

    try {
      await UserManagementService.delete(userToDelete.id);
      showSuccessToast('Потребителят е изтрит успешно');
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      // Refresh the users list
      fetchUsers();
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Неуспешно изтриване на потребител';
      showErrorToast(errorMessage);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  // Function to get a friendly name for a role
  const getRoleName = (role) => {
    const roleMap = {
      'ROLE_ADMIN': 'Администратор',
      'ROLE_OFFICE': 'Офис',
      'ROLE_AGENT': 'Агент',
      'ROLE_USER': 'Потребител'
    };
    return roleMap[role] || role;
  };

  // Function to get a color for a role chip
  const getRoleColor = (role) => {
    const colorMap = {
      'ROLE_ADMIN': 'error',
      'ROLE_OFFICE': 'warning',
      'ROLE_AGENT': 'info',
      'ROLE_USER': 'default'
    };
    return colorMap[role] || 'default';
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress />
    </Box>
  );

  if (error) return <Alert severity="error" sx={{ mb: 2 }}>Грешка: {error}</Alert>;

  // Mobile view - card layout
  if (isMobile) {
    return (
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1" gutterBottom color="primary" sx={{ mb: 0 }}>
            Управление на потребители
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/users/create"
            startIcon={<AddIcon />}
          >
            Добави потребител
          </Button>
        </Box>

        <Grid container spacing={2}>
          {users.map((user) => (
            <Grid item xs={12} key={user.id}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {user.fullName || user.email}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Имейл:</Typography>
                      <Typography variant="body2">{user.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Име:</Typography>
                      <Typography variant="body2">{user.firstName || '-'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Фамилия:</Typography>
                      <Typography variant="body2">{user.lastName || '-'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Роли:</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 0.5 }}>
                        {user.roles && Array.isArray(user.roles) && user.roles.filter(role => role !== 'ROLE_USER').map((role) => (
                          <Chip 
                            key={role}
                            label={getRoleName(role)} 
                            size="small" 
                            color={getRoleColor(role)} 
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Button 
                    variant="contained" 
                    component={RouterLink} 
                    to={`/users/edit/${user.id}`}
                    startIcon={<EditIcon />}
                  >
                    Редактиране
                  </Button>
                  {/* Debug log for mobile view */}
                  {console.log('Mobile view - Current user ID:', AuthService.getCurrentUser()?.id, 'Type:', typeof AuthService.getCurrentUser()?.id, 'User ID:', user?.id, 'Type:', typeof user?.id) || 
                    (String(AuthService.getCurrentUser()?.id) !== String(user.id) && 
                     !(AuthService.getCurrentUser()?.id === undefined && AuthService.getCurrentUser()?.email === user.email)) && (
                    <Button 
                      variant="outlined" 
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteClick(user)}
                    >
                      Изтриване
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
        >
          <DialogTitle>Потвърждение за изтриване</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Сигурни ли сте, че искате да изтриете потребителя {userToDelete?.fullName || userToDelete?.email}? Това действие не може да бъде отменено.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Отказ</Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
              Изтриване
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // Desktop view - table layout
  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom color="primary" sx={{ mb: 0 }}>
          Управление на потребители
        </Typography>
        <Button
          variant="contained"
          component={RouterLink}
          to="/users/create"
          startIcon={<AddIcon />}
        >
          Добави потребител
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }} aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>Име</TableCell>
              <TableCell>Имейл</TableCell>
              <TableCell>Роли</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.fullName || '-'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {user.roles && Array.isArray(user.roles) && user.roles.filter(role => role !== 'ROLE_USER').map((role) => (
                      <Chip 
                        key={role}
                        label={getRoleName(role)} 
                        size="small" 
                        color={getRoleColor(role)} 
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      component={RouterLink}
                      to={`/users/edit/${user.id}`}
                      startIcon={<EditIcon />}
                    >
                      Редактиране
                    </Button>
                    {/* Debug log for desktop view */}
                    {console.log('Desktop view - Current user ID:', AuthService.getCurrentUser()?.id, 'Type:', typeof AuthService.getCurrentUser()?.id, 'User ID:', user?.id, 'Type:', typeof user?.id) || 
                      (String(AuthService.getCurrentUser()?.id) !== String(user.id) && 
                       !(AuthService.getCurrentUser()?.id === undefined && AuthService.getCurrentUser()?.email === user.email)) && (
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteClick(user)}
                      >
                        Изтриване
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Потвърждение за изтриване</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Сигурни ли сте, че искате да изтриете потребителя {userToDelete?.fullName || userToDelete?.email}? Това действие не може да бъде отменено.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Отказ</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Изтриване
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersList;
