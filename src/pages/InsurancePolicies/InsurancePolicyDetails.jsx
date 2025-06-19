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
      </Box>

      <Grid container spacing={3}>
        {/* Policy Overview */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Обща информация
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Код на полицата:</Typography>
                  <Typography variant="body2" fontWeight="bold">{policy.code}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Дата на създаване:</Typography>
                  <Typography variant="body2">{InsurancePolicyService.formatDate(policy.createdAt)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Последна промяна:</Typography>
                  <Typography variant="body2">{InsurancePolicyService.formatDate(policy.updatedAt)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Тарифен план:</Typography>
                  <Typography variant="body2">
                    {policy.tariffPreset ? policy.tariffPreset.name : policy.tariffPresetName || 'Пакет по избор'}
                  </Typography>
                </Box>
                {policy.promotionalCode && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Промо код:</Typography>
                    <Typography variant="body2">
                      {policy.promotionalCode.code} ({policy.promotionalCodeDiscount}%)
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Summary */}
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Финансова информация
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="h6" color="primary">
                      {InsurancePolicyService.formatCurrency(policy.subtotal)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Застрахователна премия
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="h6" color="primary">
                      {policy.discount}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Отстъпка
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="h6" color="primary">
                      {InsurancePolicyService.formatCurrency(policy.subtotalTax)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Данък
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.main', borderRadius: 1 }}>
                    <Typography variant="h6" color="white">
                      {InsurancePolicyService.formatCurrency(policy.total)}
                    </Typography>
                    <Typography variant="caption" color="white">
                      Обща сума
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Insurer Information */}
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
                  <Typography variant="body2" color="text.secondary">ЕГН/ЛНЧ:</Typography>
                  <Typography variant="body2">{policy.idNumber || '-'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Тип документ:</Typography>
                  <Typography variant="body2">{policy.idNumberType?.name || '-'}</Typography>
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

        {/* Property Information */}
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
                  <Typography variant="body2" fontWeight="bold">{policy.settlement?.name || '-'}</Typography>
                </Box>
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
                {policy.propertyAddress && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Адрес на имота:</Typography>
                    <Typography variant="body2">{policy.propertyAddress}</Typography>
                  </Box>
                )}
                {policy.propertyOwnerName && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Собственик:</Typography>
                    <Typography variant="body2">{policy.propertyOwnerName}</Typography>
                  </Box>
                )}
                {policy.propertyOwnerIdNumber && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">ЕГН/ЛНЧ на собственика:</Typography>
                    <Typography variant="body2">{policy.propertyOwnerIdNumber}</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Insurance Clauses */}
        {policy.insurancePolicyClauses && policy.insurancePolicyClauses.length > 0 && (
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Покрити рискове
                </Typography>
                <Divider sx={{ mb: 2 }} />
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
                      {policy.insurancePolicyClauses
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
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Property Checklist */}
        {policy.propertyChecklistItems && policy.propertyChecklistItems.length > 0 && (
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Контролен списък за имота
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  {policy.propertyChecklistItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
                        <Typography variant="body2">{item.name}:</Typography>
                        <Chip
                          label={item.value ? 'Да' : 'Не'}
                          color={item.value ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default InsurancePolicyDetails; 