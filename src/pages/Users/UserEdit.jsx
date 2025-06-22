import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserManagementService from '../../services/UserManagementService';
import PromotionalCodeService from '../../services/PromotionalCodeService';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useToast } from '../../components/ToastContext';
import PromotionalCodeModal from '../../components/PromotionalCodeModal';

// Translation function for API error messages
const translateErrorMessage = (message) => {
  const translations = {
    'Code cannot be blank': 'Кодът не може да бъде празен',
    'Code cannot be longer than 50 characters': 'Кодът не може да бъде по-дълъг от 50 символа',
    'Description cannot be blank': 'Описанието не може да бъде празно',
    'Discount percentage cannot be blank': 'Процентът отстъпка не може да бъде празен',
    'Discount percentage must be between 0% and 100%': 'Процентът отстъпка трябва да бъде между 0% и 100%',
    'Promotional code not found': 'Промоционалният код не е намерен'
  };

  // Check if the message contains a pattern that needs to be translated
  for (const [englishPattern, bulgarianPattern] of Object.entries(translations)) {
    if (message.includes(englishPattern)) {
      return message.replace(englishPattern, bulgarianPattern);
    }
  }

  // Return the original message if no translation is found
  return message;
};

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    roles: []
  });
  const [availableRoles] = useState(UserManagementService.getAvailableRoles());

  // Promotional codes state
  const [promotionalCodes, setPromotionalCodes] = useState([]);
  const [loadingCodes, setLoadingCodes] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCode, setSelectedCode] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await UserManagementService.getById(id);
        setUser({
          ...userData,
          password: '' // Clear password field for security
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        const errorMessage = translateErrorMessage(err.response?.data?.message) || 'Неуспешно извличане на данни за потребителя';
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Fetch promotional codes for the user
  useEffect(() => {
    const fetchPromotionalCodes = async () => {
      if (!id) return;

      setLoadingCodes(true);
      try {
        const codes = await PromotionalCodeService.getByUserId(id);
        setPromotionalCodes(codes);
      } catch (err) {
        console.error('Error fetching promotional codes:', err);
        showErrorToast('Неуспешно извличане на промоционални кодове');
      } finally {
        setLoadingCodes(false);
      }
    };

    fetchPromotionalCodes();
  }, [id, showErrorToast]);

  // Handle opening the modal for creating a new promotional code
  const handleCreateCode = () => {
    setSelectedCode(null);
    setModalMode('create');
    setModalOpen(true);
  };

  // Handle opening the modal for editing a promotional code
  const handleEditCode = (code) => {
    setSelectedCode(code);
    setModalMode('edit');
    setModalOpen(true);
  };

  // Handle opening the modal for viewing a promotional code
  const handleViewCode = (code) => {
    setSelectedCode(code);
    setModalMode('view');
    setModalOpen(true);
  };

  // Handle opening the delete confirmation dialog
  const handleDeleteConfirm = (code) => {
    setSelectedCode(code);
    setDeleteDialogOpen(true);
  };

  // Handle saving a promotional code (create or update)
  const handleSaveCode = async (codeData) => {
    try {
      if (modalMode === 'create') {
        await PromotionalCodeService.create(codeData);
        showSuccessToast('Промоционалният код е създаден успешно');
      } else {
        await PromotionalCodeService.update(codeData.id, codeData);
        showSuccessToast('Промоционалният код е обновен успешно');
      }

      // Refresh the list of promotional codes
      const codes = await PromotionalCodeService.getByUserId(id);
      setPromotionalCodes(codes);

      return true;
    } catch (err) {
      console.error('Error saving promotional code:', err);

      // Check if the error response contains an errors array
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        // Join all translated error messages into a single string
        const errorMessage = err.response.data.errors.map(msg => translateErrorMessage(msg)).join(', ');
        showErrorToast(errorMessage);
      } else {
        // Fallback to the generic error message
        showErrorToast(translateErrorMessage(err.response?.data?.message) || 'Неуспешно запазване на промоционалния код');
      }

      throw err;
    }
  };

  // Handle deleting a promotional code
  const handleDeleteCode = async () => {
    if (!selectedCode) return;

    try {
      await PromotionalCodeService.delete(selectedCode.id);
      showSuccessToast('Промоционалният код е изтрит успешно');

      // Refresh the list of promotional codes
      const codes = await PromotionalCodeService.getByUserId(id);
      setPromotionalCodes(codes);

      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Error deleting promotional code:', err);
      showErrorToast(translateErrorMessage(err.response?.data?.message) || 'Неуспешно изтриване на промоционалния код');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const handleRoleChange = (role) => {
    const roleValue = role.value;
    const currentRoles = Array.isArray(user.roles) ? user.roles : [];
    const newRoles = currentRoles.includes(roleValue)
      ? currentRoles.filter(r => r !== roleValue)
      : [...currentRoles, roleValue];

    setUser({
      ...user,
      roles: newRoles
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Create a copy of user data for submission
      const userData = { ...user };

      // Remove password if it's empty
      if (!userData.password) {
        delete userData.password;
      }

      await UserManagementService.update(id, userData);
      setSaving(false);
      showSuccessToast('Потребителят е обновен успешно');
      navigate('/users');
    } catch (err) {
      console.error(err);
      const errorMessage = translateErrorMessage(err.response?.data?.message) || 'Неуспешно обновяване на потребителя';
      setError(errorMessage);
      setSaving(false);
      showErrorToast(errorMessage);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: { xs: 2, sm: 4 } }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" component="h1" color="primary" gutterBottom>
        Редактиране на потребител
      </Typography>

      {error && <Alert severity="error" sx={{ mb: { xs: 2, sm: 3 } }}>{error}</Alert>}

      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={{ xs: 1, sm: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Имейл адрес"
                name="email"
                autoComplete="email"
                value={user.email}
                onChange={handleInputChange}
                size="small"
                sx={{ mb: { xs: 1, sm: 2 } }}
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Парола (оставете празно, за да запазите текущата)"
                type="password"
                id="password"
                autoComplete="new-password"
                value={user.password}
                onChange={handleInputChange}
                size="small"
                sx={{ mb: { xs: 1, sm: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="normal"
                fullWidth
                id="firstName"
                label="Име"
                name="firstName"
                value={user.firstName || ''}
                onChange={handleInputChange}
                size="small"
                sx={{ mb: { xs: 1, sm: 2 } }}
              />
              <TextField
                margin="normal"
                fullWidth
                id="lastName"
                label="Фамилия"
                name="lastName"
                value={user.lastName || ''}
                onChange={handleInputChange}
                size="small"
                sx={{ mb: { xs: 1, sm: 2 } }}
              />
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12}>
              <FormControl component="fieldset" margin="normal" sx={{ display: 'block' }}>
                <FormLabel component="legend">Роли</FormLabel>
                <FormGroup sx={{ flexDirection: 'row', flexWrap: 'wrap', gap: { xs: 1, sm: 2 } }}>
                  {availableRoles.map((role) => (
                    <FormControlLabel
                      key={role.value}
                      control={
                        <Checkbox
                          checked={Array.isArray(user.roles) && user.roles.includes(role.value)}
                          onChange={() => handleRoleChange(role)}
                          name={role.value}
                          size="small"
                        />
                      }
                      label={role.label}
                      sx={{ mr: { xs: 2, sm: 3 } }}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'row', 
            gap: { xs: 1, sm: 2 }, 
            mt: { xs: 2, sm: 3 },
            width: '100%',
            '& > button': { flex: { xs: 1, sm: 'none' }, width: { sm: 'auto' } }
          }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/users')}
              size="medium"
            >
              Назад
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={saving}
              size="medium"
            >
              {saving ? 'Запазване...' : 'Запази'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Promotional Codes Section */}
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2" color="primary">
            Промоционални кодове
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateCode}
            size="small"
          >
            Добави код
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {loadingCodes ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : promotionalCodes.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            Няма намерени промоционални кодове за този потребител
          </Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Код</TableCell>
                  <TableCell>Описание</TableCell>
                  <TableCell>Отстъпка</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Използван</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {promotionalCodes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell>{code.code}</TableCell>
                    <TableCell>{code.description}</TableCell>
                    <TableCell>{code.discountPercentage}%</TableCell>
                    <TableCell>
                      {code.active ? (
                        <Typography variant="body2" color="success.main">Активен</Typography>
                      ) : (
                        <Typography variant="body2" color="error.main">Неактивен</Typography>
                      )}
                    </TableCell>
                    <TableCell>{code.usageCount} пъти</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewCode(code)}
                        title="Преглед"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditCode(code)}
                        title="Редактиране"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteConfirm(code)}
                        title="Изтриване"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Promotional Code Modal */}
      <PromotionalCodeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCode}
        promotionalCode={selectedCode}
        userId={id}
        mode={modalMode}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Потвърждение за изтриване</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Сигурни ли сте, че искате да изтриете промоционалния код "{selectedCode?.code}"?
            Това действие не може да бъде отменено.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Отказ
          </Button>
          <Button onClick={handleDeleteCode} color="error" variant="contained">
            Изтрий
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserEdit;
