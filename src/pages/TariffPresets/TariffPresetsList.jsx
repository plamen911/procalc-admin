import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import TariffPresetService from '../../services/TariffPresetService';
import { useToast } from '../../components/ToastContext';
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
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const TariffPresetsList = () => {
  const [tariffPresets, setTariffPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { showSuccessToast, showErrorToast } = useToast();

  const fetchTariffPresets = async () => {
    try {
      const data = await TariffPresetService.getAll();
      setTariffPresets(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Неуспешно извличане на тарифни пакети');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTariffPresets();
  }, []);

  const handleDeleteClick = (preset) => {
    setPresetToDelete(preset);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPresetToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!presetToDelete) return;

    setDeleting(true);
    try {
      await TariffPresetService.delete(presetToDelete.id);
      showSuccessToast('Тарифният пакет беше успешно изтрит');
      setDeleteDialogOpen(false);
      setPresetToDelete(null);
      // Refresh the list
      await fetchTariffPresets();
    } catch (err) {
      console.error(err);
      showErrorToast('Неуспешно изтриване на тарифния пакет');
    } finally {
      setDeleting(false);
    }
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
          <Typography variant="h5" component="h1" gutterBottom color="primary">
            Тарифни пакети
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/tariff-presets/create"
          >
            Създай
          </Button>
        </Box>
        <Grid container spacing={2}>
          {tariffPresets.map((preset) => (
            <Grid item xs={12} key={preset.id}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {preset.name}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Активен:</Typography>
                      {preset.active ? (
                        <Chip 
                          icon={<CheckCircleIcon />}
                          label="Да" 
                          size="small" 
                          color="success" 
                        />
                      ) : (
                        <Chip 
                          icon={<CancelIcon />}
                          label="Не" 
                          size="small" 
                          color="default" 
                        />
                      )}
                    </Box>
                  </Box>
                </CardContent>
                <CardActions sx={{ gap: 1, flexWrap: 'wrap' }}>
                  <Button 
                    variant="contained" 
                    component={RouterLink} 
                    to={`/tariff-presets/edit/${preset.id}`}
                    startIcon={<EditIcon />}
                    sx={{ flex: 1 }}
                  >
                    Редактиране
                  </Button>
                  <Button 
                    variant="outlined"
                    component={RouterLink}
                    to={`/tariff-presets/preview/${preset.id}`}
                    startIcon={<VisibilityIcon />}
                    sx={{ flex: 1 }}
                  >
                    Преглед
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteClick(preset)}
                    sx={{ flex: 1 }}
                  >
                    Изтриване
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom color="primary">
          Тарифни пакети
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/tariff-presets/create"
        >
          Създай
        </Button>
      </Box>
      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }} aria-label="tariff presets table">
          <TableHead>
            <TableRow>
              <TableCell>Име</TableCell>
              <TableCell>Активен</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tariffPresets.map((preset) => (
              <TableRow key={preset.id} hover>
                <TableCell>{preset.name}</TableCell>
                <TableCell>
                  <Chip 
                    icon={preset.active ? <CheckCircleIcon /> : <CancelIcon />}
                    label={preset.active ? 'Да' : 'Не'} 
                    size="small" 
                    color={preset.active ? 'success' : 'default'} 
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      component={RouterLink}
                      to={`/tariff-presets/edit/${preset.id}`}
                      startIcon={<EditIcon />}
                    >
                      Редактиране
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      component={RouterLink}
                      to={`/tariff-presets/preview/${preset.id}`}
                      startIcon={<VisibilityIcon />}
                    >
                      Преглед
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteClick(preset)}
                    >
                      Изтриване
                    </Button>
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
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Потвърждение за изтриване"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Сигурни ли сте, че искате да изтриете тарифен пакет "{presetToDelete?.name}"?
            Това действие не може да бъде отменено.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Отказ
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleting}
            autoFocus
          >
            {deleting ? 'Изтриване...' : 'Изтрий'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TariffPresetsList;
