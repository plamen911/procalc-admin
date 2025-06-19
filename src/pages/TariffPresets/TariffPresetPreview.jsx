import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TariffPresetService from '../../services/TariffPresetService';
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TariffPresetPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tariffPreset, setTariffPreset] = useState(null);
  const [tariffPresetClauses, setTariffPresetClauses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tariff presets
        const presetData = await TariffPresetService.getAll();
        const preset = presetData.find(p => p.id === parseInt(id));

        if (!preset) {
          setError('Тарифният пакет не е намерен');
          setLoading(false);
          return;
        }

        setTariffPreset(preset);

        // Set tariff preset clauses if they exist
        if (preset.tariff_preset_clauses && Array.isArray(preset.tariff_preset_clauses)) {
          setTariffPresetClauses(preset.tariff_preset_clauses);
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

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress />
    </Box>
  );

  if (error) return <Alert severity="error" sx={{ mb: 2 }}>Грешка: {error}</Alert>;

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom color="primary">
        Преглед на тарифен пакет: {tariffPreset?.name}
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Клаузи</TableCell>
                <TableCell align="right">Застрахователна сума</TableCell>
                <TableCell align="right">Тарифно число</TableCell>
                <TableCell align="right">Застрахователна премия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tariffPresetClauses.map((clause) => (
                <TableRow key={clause.id}>
                  <TableCell>{clause.insurance_clause.name}</TableCell>
                  <TableCell align="right">{clause.tariff_amount}</TableCell>
                  <TableCell align="right">{clause.insurance_clause.tariff_number}</TableCell>
                  <TableCell align="right">{clause.line_total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/tariff-presets')}
          >
            Назад
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default TariffPresetPreview;
