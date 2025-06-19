import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InsurancePolicyService from '../../services/InsurancePolicyService';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useToast } from '../../components/ToastContext';

const InsurancePolicyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showErrorToast } = useToast();

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        setLoading(true);
        const data = await InsurancePolicyService.getPolicyById(id);
        setPolicy(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        const errorMessage = err.response?.data?.message || 'Неуспешно извличане на данните за полицата';
        setError(errorMessage);
        showErrorToast(errorMessage);
        setLoading(false);
      }
    };

    fetchPolicy();
  }, [id, showErrorToast]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mb: 2 }}>Грешка: {error}</Alert>;
  }

  if (!policy) {
    return <Alert severity="warning" sx={{ mb: 2 }}>Полицата не е намерена</Alert>;
  }

  return (
    <Box sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/insurance-policies')}
          sx={{ mr: 2 }}
        >
          Назад
        </Button>
        <Typography variant="h5" component="h1" color="primary">
          Детайли за полица {policy.code}
        </Typography>
        <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
          {InsurancePolicyService.formatDate(policy.createdAt)}
        </Typography>
      </Box>

      {/* Tariff Info Section */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            Информация за тарифата
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">Избрано покритие:</Typography>
            <Typography variant="body2" fontWeight="bold">
              {policy.tariffPreset ? policy.tariffPreset.name : policy.tariffPresetName || 'Пакет по избор'}
            </Typography>
            {policy.promotionalCode && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Промо код: <b>{policy.promotionalCode.code} ({policy.promotionalCodeDiscount}%)</b>
              </Typography>
            )}
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Клауза</TableCell>
                  <TableCell>Тарифен номер</TableCell>
                  <TableCell align="right">Застрахователна сума</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {policy.insurancePolicyClauses && policy.insurancePolicyClauses.length > 0 &&
                  policy.insurancePolicyClauses
                    .sort((a, b) => a.position - b.position)
                    .map((clause) => (
                      <TableRow key={clause.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {clause.name}
                          </Typography>
                        </TableCell>
                        <TableCell>{clause.tariffNumber || '-'}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold" color="primary">
                            {InsurancePolicyService.formatCurrency(clause.tariffAmount)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                {/* Financial statistics rows */}
                <TableRow>
                  <TableCell colSpan={2} align="right"><b>Застрахователна премия</b></TableCell>
                  <TableCell align="right"><b>{InsurancePolicyService.formatCurrency(policy.subtotal)}</b></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} align="right"><b>Отстъпка</b></TableCell>
                  <TableCell align="right"><b>{policy.discount}%</b></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} align="right"><b>Данък</b></TableCell>
                  <TableCell align="right"><b>{InsurancePolicyService.formatCurrency(policy.subtotalTax)}</b></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} align="right"><b>Обща сума</b></TableCell>
                  <TableCell align="right"><b>{InsurancePolicyService.formatCurrency(policy.total)}</b></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Property and Insurer Info Sections - 2 cols on desktop, 1 col on mobile */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Property Info */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Данни за имота
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Населено място:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {policy.settlement?.name || '-'}
                  </Typography>
                </Box>
                
                {policy.propertyAddress && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Адрес на имота:</Typography>
                    <Typography variant="body2">{policy.propertyAddress}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Тип имот:</Typography>
                  <Typography variant="body2">{policy.estateType?.name || '-'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Вид имот:</Typography>
                  <Typography variant="body2">{policy.estateSubtype?.name || '-'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Отстояние от вода:</Typography>
                  <Typography variant="body2">{policy.distanceToWater?.name || '-'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">РЗП:</Typography>
                  <Typography variant="body2">{policy.areaSqMeters ? `${policy.areaSqMeters} кв.м.` : '-'}</Typography>
                </Box>
              </Box>
              {/* Property Checklist Table */}
              {policy.propertyChecklistItems && policy.propertyChecklistItems.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
                    Характеристики на имота
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Характеристика</TableCell>
                          <TableCell align="right">Стойност</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {policy.propertyChecklistItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="right">
                              <b>{item.value ? 'Да' : 'Не'}</b>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        {/* Owner Info */}
        {(policy.propertyOwnerName || policy.propertyOwnerIdNumber) && (
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Данни за собственика
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {policy.propertyOwnerName && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Име:</Typography>
                      <Typography variant="body2" fontWeight="bold">{policy.propertyOwnerName}</Typography>
                    </Box>
                  )}
                  {policy.propertyOwnerIdNumber && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">ЕГН/ЛНЧ:</Typography>
                      <Typography variant="body2">{policy.propertyOwnerIdNumber}</Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
        {/* Insurer Info */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Данни за застраховащия
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Име:</Typography>
                  <Typography variant="body2" fontWeight="bold">{policy.fullName || '-'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">{policy.idNumberType?.name || '-'}:</Typography>
                  <Typography variant="body2">{policy.idNumber || '-'}</Typography>
                </Box>
                {policy.birthDate && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Дата на раждане:</Typography>
                    <Typography variant="body2">{policy.birthDate}</Typography>
                  </Box>
                )}
                {policy.gender && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Пол:</Typography>
                    <Typography variant="body2">
                      {policy.gender === 'male' ? 'Мъж' : 'Жена'}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Телефон:</Typography>
                  <Typography variant="body2">{policy.phone || '-'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Имейл:</Typography>
                  <Typography variant="body2">{policy.email || '-'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Адрес:</Typography>
                  <Typography variant="body2">{policy.permanentAddress || '-'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Населено място:</Typography>
                  <Typography variant="body2">{policy.insurerSettlement?.name || '-'}</Typography>
                </Box>
                {policy.insurerNationality && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Националност:</Typography>
                    <Typography variant="body2">{policy.insurerNationality.name}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Роля:</Typography>
                  <Typography variant="body2">{policy.personRole?.name || '-'}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InsurancePolicyDetails; 