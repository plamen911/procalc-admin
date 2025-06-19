import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import InsurancePolicyService from '../../services/InsurancePolicyService';
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useToast } from '../../components/ToastContext';

const InsurancePoliciesList = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    limit: 10
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { showErrorToast } = useToast();

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        search: filters.search
      };

      const data = await InsurancePolicyService.getPolicies(params);
      setPolicies(data.policies);
      setPagination(data.pagination);
      setLoading(false);
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Неуспешно извличане на застрахователни полици';
      setError(errorMessage);
      showErrorToast(errorMessage);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await InsurancePolicyService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchPolicies();
    fetchStats();
  }, [pagination.currentPage, filters]);

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleSearchChange = (event) => {
    setFilters(prev => ({ ...prev, search: event.target.value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSortChange = (event) => {
    setFilters(prev => ({ ...prev, sortBy: event.target.value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSortOrderChange = (event) => {
    setFilters(prev => ({ ...prev, sortOrder: event.target.value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleLimitChange = (event) => {
    setFilters(prev => ({ ...prev, limit: event.target.value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchPolicies();
  };

  if (loading && policies.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mb: 2 }}>Грешка: {error}</Alert>;
  }

  // Mobile view - card layout
  if (isMobile) {
    return (
      <Box sx={{ py: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom color="primary" sx={{ mb: 3 }}>
          Застрахователни полици
        </Typography>

        {/* Stats Cards */}
        {stats && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h6" color="primary">
                    {stats.totalPolicies}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Общо полици
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h6" color="primary">
                    {InsurancePolicyService.formatCurrency(stats.totalAmount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Обща сума
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Search and Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <form onSubmit={handleSearchSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Търси по код, име, телефон..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Сортиране</InputLabel>
                  <Select
                    value={filters.sortBy}
                    onChange={handleSortChange}
                    label="Сортиране"
                  >
                    {InsurancePolicyService.getSortOptions().map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Порядък</InputLabel>
                  <Select
                    value={filters.sortOrder}
                    onChange={handleSortOrderChange}
                    label="Порядък"
                  >
                    <MenuItem value="DESC">Низходящ</MenuItem>
                    <MenuItem value="ASC">Възходящ</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Policies Cards */}
        <Grid container spacing={2}>
          {policies.map((policy) => (
            <Grid item xs={12} key={policy.id}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {policy.code}
                    </Typography>
                    <Chip 
                      label={InsurancePolicyService.formatCurrency(policy.total)} 
                      color="primary" 
                      size="small"
                    />
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Застраховащ:</Typography>
                      <Typography variant="body2">{policy.fullName || '-'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Телефон:</Typography>
                      <Typography variant="body2">{policy.phone || '-'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Населено място:</Typography>
                      <Typography variant="body2">{policy.settlement || '-'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Тип имот:</Typography>
                      <Typography variant="body2">{policy.estateType || '-'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Дата:</Typography>
                      <Typography variant="body2">{InsurancePolicyService.formatDate(policy.createdAt)}</Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    component={RouterLink}
                    to={`/insurance-policies/${policy.id}`}
                    startIcon={<VisibilityIcon />}
                  >
                    Преглед
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}

        {/* Items per page */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Покажи</InputLabel>
            <Select
              value={filters.limit}
              onChange={handleLimitChange}
              label="Покажи"
            >
              {InsurancePolicyService.getItemsPerPageOptions().map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    );
  }

  // Desktop view - table layout
  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom color="primary" sx={{ mb: 3 }}>
        Застрахователни полици
      </Typography>

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {stats.totalPolicies}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Общо полици
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {InsurancePolicyService.formatCurrency(stats.totalAmount)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Обща сума
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {stats.todayPolicies}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Полици днес
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {InsurancePolicyService.formatCurrency(stats.todayAmount)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Сума днес
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSearchSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Търси по код, име, телефон, имейл..."
                value={filters.search}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Сортиране</InputLabel>
                <Select
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  label="Сортиране"
                >
                  {InsurancePolicyService.getSortOptions().map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Порядък</InputLabel>
                <Select
                  value={filters.sortOrder}
                  onChange={handleSortOrderChange}
                  label="Порядък"
                >
                  <MenuItem value="DESC">Низходящ</MenuItem>
                  <MenuItem value="ASC">Възходящ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Покажи</InputLabel>
                <Select
                  value={filters.limit}
                  onChange={handleLimitChange}
                  label="Покажи"
                >
                  {InsurancePolicyService.getItemsPerPageOptions().map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                Търси
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Policies Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Код</TableCell>
              <TableCell>Застраховащ</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Населено място</TableCell>
              <TableCell>Тип имот</TableCell>
              <TableCell>Тарифен план</TableCell>
              <TableCell align="right">Обща сума</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {policy.code}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {policy.fullName || '-'}
                  </Typography>
                  {policy.email && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      {policy.email}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{policy.phone || '-'}</TableCell>
                <TableCell>{policy.settlement || '-'}</TableCell>
                <TableCell>{policy.estateType || '-'}</TableCell>
                <TableCell>
                  <Chip 
                    label={policy.tariffPreset || 'Пакет по избор'} 
                    size="small" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {InsurancePolicyService.formatCurrency(policy.total)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {InsurancePolicyService.formatDate(policy.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    component={RouterLink}
                    to={`/insurance-policies/${policy.id}`}
                    startIcon={<VisibilityIcon />}
                    variant="outlined"
                  >
                    Преглед
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Results info */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Показване на {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} от {pagination.totalItems} полици
        </Typography>
      </Box>
    </Box>
  );
};

export default InsurancePoliciesList; 