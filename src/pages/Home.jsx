import { Link as RouterLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import InsuranceIcon from '@mui/icons-material/Description';
import TariffIcon from '@mui/icons-material/ListAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import ClauseIcon from '@mui/icons-material/Assignment';

const menuItems = [
  {
    title: 'Застрахователни клаузи',
    description: 'Управление на застрахователни клаузи за калкулатора на имоти.',
    icon: <InsuranceIcon fontSize="large" color="primary" />,
    path: '/insurance-clauses',
    buttonText: 'Управление на застрахователни клаузи'
  }, {
    title: 'Тарифни пакети',
    description: 'Управление на тарифни пакети за калкулатора на имоти.',
    icon: <TariffIcon fontSize="large" color="primary" />,
    path: '/tariff-presets',
    buttonText: 'Управление на тарифни пакети'
  }, {
    title: 'Конфигурация',
    description: 'Конфигуриране на настройките на калкулатора на имоти.',
    icon: <SettingsIcon fontSize="large" color="primary" />,
    path: '/app-configs',
    buttonText: 'Управление на настройките'
  }
];

const Home = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom color="primary">
        Администратор на калкулатор за имоти
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Добре дошли в административния панел на калкулатора за имоти. Използвайте навигацията отгоре или картите по-долу, за да управлявате приложението.
      </Typography>
      <Divider sx={{ my: 3 }} />
      <Grid container spacing={3} alignItems="stretch" sx={{ display: 'flex' }}>
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.title} sx={{ display: 'flex' }}>
            <Card sx={{ 
              height: '100%', 
              width: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              minWidth: 0, // Prevents content from causing overflow
              flex: '1 1 0px' // All cards take equal space
            }} elevation={3}>
              <CardContent sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                height: 150, 
                width: '100%',
                overflow: 'hidden' // Prevents content from causing overflow
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {item.icon}
                  <Typography variant="h6" component="h2" sx={{ ml: 1 }}>
                    {item.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ width: '100%', padding: 2 }}>
                <Button 
                  variant="contained" 
                  component={RouterLink} 
                  to={item.path}
                  fullWidth
                  sx={{ 
                    textAlign: 'center',
                    height: 40, // Fixed height for all buttons
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {item.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default Home;
