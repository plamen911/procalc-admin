import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import bgLocale from 'date-fns/locale/bg';

// Translation function for API error messages
const translateErrorMessage = (message) => {
  const translations = {
    'Code cannot be blank': 'Кодът не може да бъде празен',
    'Code cannot be longer than 50 characters': 'Кодът не може да бъде по-дълъг от 50 символа',
    'Description cannot be blank': 'Описанието не може да бъде празно',
    'Discount percentage cannot be blank': 'Процентът отстъпка не може да бъде празен',
    'Discount percentage must be between 0% and 100%': 'Процентът отстъпка трябва да бъде между 0% и 100%',
    'An error occurred while saving the promotional code': 'Възникна грешка при запазване на промоционалния код'
  };

  // Check if the message contains a pattern that needs to be translated
  for (const [englishPattern, bulgarianPattern] of Object.entries(translations)) {
    if (message.includes(englishPattern)) {
      return message.replace(englishPattern, bulgarianPattern);
    }
  }

  // Return the original message if no translation is found
  return message;
};

const PromotionalCodeModal = ({ 
  open, 
  onClose, 
  onSave, 
  promotionalCode, 
  userId,
  mode = 'create' // 'create', 'edit', or 'view'
}) => {
  const [loading, setLoading] = useState(false);
  // We still track errors for validation but don't display them above the form
  const [_error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountPercentage: 0,
    validFrom: null,
    validTo: null,
    active: true,
    usageLimit: null,
    user: userId ? { id: userId } : null
  });

  // Initialize form data when promotional code changes
  useEffect(() => {
    // Reset submitted state when modal is opened/reopened
    setSubmitted(false);

    if (promotionalCode) {
      setFormData({
        ...promotionalCode,
        validFrom: promotionalCode.validFrom ? new Date(promotionalCode.validFrom) : null,
        validTo: promotionalCode.validTo ? new Date(promotionalCode.validTo) : null,
        user: userId ? { id: userId } : promotionalCode.user
      });
    } else {
      // Reset form for new promotional code
      setFormData({
        code: '',
        description: '',
        discountPercentage: 0,
        validFrom: new Date(),
        validTo: null,
        active: true,
        usageLimit: null,
        user: userId ? { id: userId } : null
      });
    }
  }, [promotionalCode, userId, open]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleDateChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Error saving promotional code:', err);

      // Check if the error response contains an errors array
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        // Set the error state to the array of translated error messages
        setError(err.response.data.errors.map(errorMsg => translateErrorMessage(errorMsg)));
      } else {
        // Fallback to the generic error message (translated)
        setError(translateErrorMessage(err.response?.data?.message || 'An error occurred while saving the promotional code'));
      }
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = mode === 'view';
  const title = {
    'create': 'Създаване на промоционален код',
    'edit': 'Редактиране на промоционален код',
    'view': 'Преглед на промоционален код'
  }[mode];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Код"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              disabled={isReadOnly || mode === 'edit'}
              required
              error={submitted && !formData.code}
              helperText={submitted && !formData.code ? 'Кодът е задължителен' : (mode === 'edit' ? 'Кодът не може да бъде променян' : '')}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Отстъпка (%)"
              name="discountPercentage"
              type="number"
              value={formData.discountPercentage}
              onChange={handleInputChange}
              disabled={isReadOnly || mode === 'edit'}
              required
              inputProps={{ min: 0, max: 100 }}
              error={submitted && (formData.discountPercentage < 0 || formData.discountPercentage > 100)}
              helperText={
                submitted && (formData.discountPercentage < 0 || formData.discountPercentage > 100)
                  ? 'Отстъпката трябва да бъде между 0% и 100%' 
                  : (mode === 'edit' ? 'Процентът отстъпка не може да бъде променян' : '')
              }
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Описание"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isReadOnly}
              required
              multiline
              rows={2}
              error={submitted && !formData.description}
              helperText={submitted && !formData.description ? 'Описанието е задължително' : ''}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bgLocale}>
              <DateTimePicker
                label="Валиден от"
                value={formData.validFrom}
                onChange={(newValue) => handleDateChange('validFrom', newValue)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    size: "small"
                  } 
                }}
                disabled={isReadOnly}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bgLocale}>
              <DateTimePicker
                label="Валиден до"
                value={formData.validTo}
                onChange={(newValue) => handleDateChange('validTo', newValue)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    size: "small"
                  } 
                }}
                disabled={isReadOnly}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Лимит на използване"
              name="usageLimit"
              type="number"
              value={formData.usageLimit || ''}
              onChange={handleInputChange}
              disabled={isReadOnly}
              inputProps={{ min: 1 }}
              helperText="Оставете празно за неограничено използване"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={handleInputChange}
                  name="active"
                  disabled={isReadOnly}
                />
              }
              label="Активен"
            />
            {!isReadOnly && formData.usageCount > 0 && (
              <Typography variant="body2" color="text.secondary">
                Използван {formData.usageCount} пъти
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {isReadOnly ? 'Затвори' : 'Отказ'}
        </Button>
        {!isReadOnly && (
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Запази'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PromotionalCodeModal;
