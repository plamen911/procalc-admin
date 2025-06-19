import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppConfigService from '../../services/AppConfigService';
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
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

const AppConfigsList = () => {
  const [appConfigs, setAppConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchAppConfigs = async () => {
      try {
        const data = await AppConfigService.getAll();
        // Filter out EARTHQUAKE_ID, FLOOD_LT_500_M_ID and FLOOD_GT_500_M_ID
        const filteredData = data.filter(config => 
          !['EARTHQUAKE_ID', 'FLOOD_LT_500_M_ID', 'FLOOD_GT_500_M_ID'].includes(config.name)
        );
        setAppConfigs(filteredData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Неуспешно извличане на конфигурации');
        setLoading(false);
      }
    };

    fetchAppConfigs();
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
          Конфигурация
        </Typography>
        <Grid container spacing={2}>
          {appConfigs.map((config) => (
            <Grid item xs={12} key={config.id}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {config.nameBg || config.name}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Стойност:</Typography>
                      <Typography variant="body2">{config.value}</Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    variant="contained" 
                    component={RouterLink} 
                    to={`/app-configs/edit/${config.id}`}
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
        Конфигурация
      </Typography>
      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }} aria-label="app configs table">
          <TableHead>
            <TableRow>
              <TableCell>Име</TableCell>
              <TableCell>Стойност</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appConfigs.map((config) => (
              <TableRow key={config.id} hover>
                <TableCell>{config.nameBg || config.name}</TableCell>
                <TableCell>{config.value}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    component={RouterLink}
                    to={`/app-configs/edit/${config.id}`}
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

export default AppConfigsList;
