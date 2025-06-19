import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InsuranceClauseService from '../../services/InsuranceClauseService';
import { useToast } from '../../components/ToastContext';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InputAdornment from '@mui/material/InputAdornment';

const InsuranceClauseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    tariff_number: 0,
    has_tariff_number: false,
    tariff_amount: 0,
    position: 0,
    active: false
  });
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchInsuranceClause = async () => {
      try {
        const data = await InsuranceClauseService.getAll();
        const clause = data.find(c => c.id === parseInt(id));

        if (!clause) {
          setError('Застрахователната клауза не е намерена');
          setLoading(false);
          return;
        }

        // Ensure that insurance clause with ID = 1 is always active
        setFormData({
          name: clause.name,
          tariff_number: clause.tariff_number,
          has_tariff_number: clause.has_tariff_number,
          tariff_amount: clause.tariff_amount,
          position: clause.position,
          active: parseInt(id) === 1 ? true : clause.active
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Неуспешно извличане на застрахователна клауза');
        setLoading(false);
      }
    };

    fetchInsuranceClause();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === 'has_tariff_number') {
      // When toggling "Has Tariff Number", clear the appropriate field
      setFormData(prevData => ({
        ...prevData,
        has_tariff_number: checked,
        // Clear tariff_amount when has_tariff_number is true, clear tariff_number when false
        tariff_amount: checked ? 0 : prevData.tariff_amount,
        tariff_number: checked ? prevData.tariff_number : 0
      }));
    } else if (name === 'active') {
      // Handle active status toggle
      // Ensure that insurance clause with ID = 1 is always active
      if (parseInt(id) === 1) {
        setFormData(prevData => ({
          ...prevData,
          active: true
        }));
      } else {
        setFormData(prevData => ({
          ...prevData,
          active: checked
        }));
      }
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      // Convert string values to appropriate types
      // Ensure that insurance clause with ID = 1 is always active
      const dataToSend = {
        ...formData,
        tariff_number: parseFloat(formData.tariff_number),
        tariff_amount: parseFloat(formData.tariff_amount),
        position: parseInt(formData.position),
        active: parseInt(id) === 1 ? true : formData.active
      };

      await InsuranceClauseService.update(id, dataToSend);
      showSuccessToast('Застрахователната клауза беше успешно запазена');
      navigate('/insurance-clauses');
    } catch (err) {
      console.error(err);
      const errorMessage = 'Неуспешно обновяване на застрахователна клауза';
      setSaveError(errorMessage);
      showErrorToast(errorMessage);
      setSaving(false);
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
        Редактиране на застрахователна клауза
      </Typography>

      {saveError && <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert>}

      <Paper elevation={2} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Име"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                variant="outlined"
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Тарифно число"
                name="tariff_number"
                type="number"
                inputProps={{ step: "0.01" }}
                value={formData.tariff_number}
                onChange={handleChange}
                required
                variant="outlined"
                disabled={!formData.has_tariff_number}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.has_tariff_number}
                    onChange={handleChange}
                    name="has_tariff_number"
                    color="primary"
                  />
                }
                label="Има тарифно число"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Застрахователна премия"
                name="tariff_amount"
                type="number"
                inputProps={{ step: "0.01" }}
                value={formData.tariff_amount}
                onChange={handleChange}
                required
                variant="outlined"
                disabled={formData.has_tariff_number}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              {parseInt(id) === 1 ? (
                <>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={true}
                        disabled={true}
                        name="active"
                        color="primary"
                      />
                    }
                    label="Активен"
                  />
                  <Alert severity="info" sx={{ mt: 1 }}>
                    Тази клауза трябва винаги да бъде активна и не може да бъде деактивирана.
                  </Alert>
                </>
              ) : (
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.active}
                      onChange={handleChange}
                      name="active"
                      color="primary"
                    />
                  }
                  label="Активен"
                />
              )}
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/insurance-clauses')}
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

export default InsuranceClauseEdit;
