import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import InsuranceClauseService from '../../services/InsuranceClauseService';
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
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Switch from '@mui/material/Switch';

const InsuranceClausesList = () => {
  const [insuranceClauses, setInsuranceClauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchInsuranceClauses = async () => {
    try {
      const data = await InsuranceClauseService.getAll();
      // Sort insurance clauses by position
      const sortedData = [...data].sort((a, b) => a.position - b.position);
      setInsuranceClauses(sortedData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Неуспешно извличане на застрахователни клаузи');
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchInsuranceClauses();
  }, []);

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
        <Typography variant="h5" component="h1" gutterBottom color="primary">
          Застрахователни клаузи
        </Typography>
        <Grid container spacing={2}>
          {insuranceClauses.map((clause) => (
            <Grid item xs={12} key={clause.id}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {clause.name}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Тарифен номер:</Typography>
                      <Typography variant="body2">{clause.tariff_number === 0 ? '' : clause.tariff_number}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Има тарифен номер:</Typography>
                      <Chip 
                        label={clause.has_tariff_number ? 'Да' : 'Не'} 
                        size="small" 
                        color={clause.has_tariff_number ? 'success' : 'default'} 
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Тарифна сума:</Typography>
                      <Typography variant="body2">{clause.tariff_amount === 0 ? '' : clause.tariff_amount}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Активен:</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Chip 
                          icon={clause.active ? <CheckCircleIcon /> : <CancelIcon />}
                          label={clause.active ? 'Да' : 'Не'} 
                          size="small" 
                          color={clause.active ? 'success' : 'default'} 
                        />
                        {clause.id === 1 && (
                          <Typography variant="caption" color="info.main" sx={{ mt: 0.5 }}>
                            Винаги активна
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    variant="contained" 
                    component={RouterLink} 
                    to={`/insurance-clauses/edit/${clause.id}`}
                    startIcon={<EditIcon />}
                    fullWidth
                  >
                    Редактиране
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // Desktop view - table layout
  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom color="primary">
        Застрахователни клаузи
      </Typography>
      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }} aria-label="insurance clauses table">
          <TableHead>
            <TableRow>
              <TableCell>Клаузи</TableCell>
              <TableCell>Тарифно число</TableCell>
              <TableCell>Има тарифно число</TableCell>
              <TableCell>Застр. премия</TableCell>
              <TableCell>Активен</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {insuranceClauses.map((clause) => (
              <TableRow key={clause.id} hover>
                <TableCell>{clause.name}</TableCell>
                <TableCell>{clause.tariff_number === 0 ? '' : clause.tariff_number}</TableCell>
                <TableCell>
                  <Chip 
                    label={clause.has_tariff_number ? 'Да' : 'Не'} 
                    size="small" 
                    color={clause.has_tariff_number ? 'success' : 'default'} 
                  />
                </TableCell>
                <TableCell>{clause.tariff_amount === 0 ? '' : clause.tariff_amount}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Chip 
                      icon={clause.active ? <CheckCircleIcon /> : <CancelIcon />}
                      label={clause.active ? 'Да' : 'Не'} 
                      size="small" 
                      color={clause.active ? 'success' : 'default'} 
                    />
                    {clause.id === 1 && (
                      <Typography variant="caption" color="info.main" sx={{ mt: 0.5 }}>
                        Винаги активна
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    component={RouterLink}
                    to={`/insurance-clauses/edit/${clause.id}`}
                    startIcon={<EditIcon />}
                  >
                    Редактиране
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InsuranceClausesList;
