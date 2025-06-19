import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppConfigService from '../../services/AppConfigService';
import { useToast } from '../../components/ToastContext';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

const AppConfigEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    nameBg: ''
  });
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [insuranceClauses, setInsuranceClauses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch app configs
        const configs = await AppConfigService.getAll();
        const config = configs.find(c => c.id === parseInt(id));

        if (!config) {
          setError('Конфигурацията не е намерена');
          setLoading(false);
          return;
        }

        setFormData({
          name: config.name,
          value: config.value,
          nameBg: config.nameBg
        });

        // If this config is related to insurance clauses, fetch them
        if (['EARTHQUAKE_ID', 'FLOOD_LT_500_M_ID', 'FLOOD_GT_500_M_ID'].includes(config.name)) {
          const clausesData = await AppConfigService.getInsuranceClauses();
          setInsuranceClauses(clausesData);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Неуспешно извличане на данни');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      await AppConfigService.update(id, formData);
      showSuccessToast('Конфигурацията беше успешно запазена');
      navigate('/app-configs');
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.errors?.[0] || 'Неуспешно обновяване на конфигурация';
      setSaveError(errorMessage);
      showErrorToast(errorMessage);
      setSaving(false);
    }
  };

  // Render different input based on config type
  const renderConfigInput = () => {
    switch (formData.name) {
      case 'CURRENCY':
        return (
          <FormControl fullWidth variant="outlined">
            <InputLabel id="currency-label">Валута</InputLabel>
            <Select
              labelId="currency-label"
              name="value"
              value={formData.value}
              onChange={handleChange}
              label="Валута"
              required
            >
              <MenuItem value="лв.">лв.</MenuItem>
              <MenuItem value="€">€</MenuItem>
            </Select>
          </FormControl>
        );
      case 'DISCOUNT_PERCENTS':
      case 'TAX_PERCENTS':
        return (
          <TextField
            fullWidth
            label={formData.nameBg || 'Процент'}
            name="value"
            type="number"
            inputProps={{ min: 0, max: 100 }}
            value={formData.value}
            onChange={handleChange}
            required
            variant="outlined"
            helperText="Стойността трябва да бъде между 0 и 100"
          />
        );
      case 'EARTHQUAKE_ID':
      case 'FLOOD_LT_500_M_ID':
      case 'FLOOD_GT_500_M_ID':
        return (
          <FormControl fullWidth variant="outlined">
            <InputLabel id="clause-label">{formData.nameBg || 'Клауза'}</InputLabel>
            <Select
              labelId="clause-label"
              name="value"
              value={formData.value}
              onChange={handleChange}
              label={formData.nameBg || 'Клауза'}
              required
            >
              {insuranceClauses.map(clause => (
                <MenuItem key={clause.id} value={clause.id.toString()}>
                  {clause.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      default:
        return (
          <TextField
            fullWidth
            label={formData.nameBg || 'Стойност'}
            name="value"
            value={formData.value}
            onChange={handleChange}
            required
            variant="outlined"
          />
        );
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress />
    </Box>
  );

  if (error) return <Alert severity="error" sx={{ mb: 2 }}>Грешка: {error}</Alert>;

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom color="primary">
        Редактиране на конфигурация
      </Typography>

      {saveError && <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert>}

      <Paper elevation={2} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Име"
                name="nameBg"
                value={formData.nameBg || ''}
                onChange={handleChange}
                variant="outlined"
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              {renderConfigInput()}
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/app-configs')}
                >
                  Назад
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={saving}
                >
                  {saving ? 'Запазване...' : 'Запази промените'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AppConfigEdit;
