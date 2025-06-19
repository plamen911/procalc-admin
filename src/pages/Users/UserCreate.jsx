import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserManagementService from '../../services/UserManagementService';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useToast } from '../../components/ToastContext';

const UserCreate = () => {
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    roles: ['ROLE_AGENT'] // Default role
  });
  const [availableRoles] = useState(UserManagementService.getAvailableRoles());

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const handleRoleChange = (role) => {
    const roleValue = role.value;
    const newRoles = user.roles.includes(roleValue)
      ? user.roles.filter(r => r !== roleValue)
      : [...user.roles, roleValue];

    setUser({
      ...user,
      roles: newRoles
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Validate required fields
    if (!user.email || !user.password) {
      setError('Имейл адрес и парола са задължителни');
      setSaving(false);
      return;
    }

    try {
      const response = await UserManagementService.create(user);
      showSuccessToast(response.message || 'Потребителят е създаден успешно');
      navigate('/users');
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Неуспешно създаване на потребител';
      setError(errorMessage);
      setSaving(false);
      showErrorToast(errorMessage);
    }
  };

  return (
    <Box sx={{ py: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" component="h1" color="primary" gutterBottom>
        Създаване на потребител
      </Typography>

      {error && <Alert severity="error" sx={{ mb: { xs: 2, sm: 3 } }}>{error}</Alert>}

      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 } }}>
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
                error={saving && !user.email}
                helperText={saving && !user.email ? 'Имейлът е задължителен' : ''}
                size="small"
                sx={{ mb: { xs: 1, sm: 2 } }}
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Парола"
                type="password"
                id="password"
                autoComplete="new-password"
                value={user.password}
                onChange={handleInputChange}
                error={saving && !user.password}
                helperText={saving && !user.password ? 'Паролата е задължителна' : ''}
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
                          checked={user.roles.includes(role.value)}
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
    </Box>
  );
};

export default UserCreate;
