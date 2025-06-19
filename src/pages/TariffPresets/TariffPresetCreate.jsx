import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TariffPresetService from '../../services/TariffPresetService';
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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TariffPresetCreate = () => {
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    active: true
  });
  const [tariffPresetClauses, setTariffPresetClauses] = useState([]);
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch available insurance clauses
        const clausesData = await InsuranceClauseService.getAll();

        // Pre-populate all insurance clauses
        if (clausesData.length > 0) {
          const prePopulatedClauses = clausesData.map(clause => ({
            insurance_clause: {
              id: clause.id,
              name: clause.name
            },
            tariff_amount: 0
          }));
          setTariffPresetClauses(prePopulatedClauses);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Неуспешно извличане на данни');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'active' ? checked : value
    }));
  };

  const handleClauseChange = (index, value) => {
    setTariffPresetClauses(prevClauses => {
      const updatedClauses = [...prevClauses];
      updatedClauses[index] = {
        ...updatedClauses[index],
        tariff_amount: value
      };
      return updatedClauses;
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      // Combine form data with tariff preset clauses
      const dataToSend = {
        ...formData,
        tariff_preset_clauses: tariffPresetClauses
      };

      await TariffPresetService.create(dataToSend);
      showSuccessToast('Тарифният пакет беше успешно създаден');
      navigate('/tariff-presets');
    } catch (err) {
      console.error(err);
      const errorMessage = 'Неуспешно създаване на тарифния пакет';
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
        Създаване на тарифен пакет
      </Typography>

      {saveError && <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert>}

      <Paper elevation={2} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Име"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
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
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Клаузи</Typography>

              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="normal" sx={{ py: 1 }}>Клаузи</TableCell>
                      <TableCell padding="normal" sx={{ py: 1 }}>Застрахователна сума</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tariffPresetClauses.map((clause, index) => (
                      <TableRow key={`new-${index}`}>
                        <TableCell padding="normal" sx={{ py: 1 }}>
                          {clause.insurance_clause.name}
                        </TableCell>
                        <TableCell padding="normal" sx={{ py: 1 }}>
                          <TextField
                            size="small"
                            type="number"
                            value={clause.tariff_amount}
                            onChange={(e) => handleClauseChange(index, parseFloat(e.target.value))}
                            fullWidth
                            required
                            inputProps={{ step: "0.01", min: "0" }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/tariff-presets')}
                >
                  Назад
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={saving}
                >
                  {saving ? 'Създаване...' : 'Създай'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default TariffPresetCreate;
