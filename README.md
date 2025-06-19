# Estate Calculator - Admin Module

A React-based administrative interface for managing the Estate Calculator application. This module provides comprehensive tools for administrators to manage insurance clauses, tariff presets, application configurations, and user accounts.

## Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Protected routes for administrative access
- User session management

### 📋 Insurance Management
- **Insurance Clauses Management**: Create, edit, and manage insurance policy clauses
- **Tariff Presets**: Configure and manage insurance tariff presets
  - Create new tariff presets
  - Edit existing presets
  - Preview tariff configurations
  - Associate clauses with tariffs

### ⚙️ Application Configuration
- **App Configs**: Manage application-wide settings and configurations
- **System Settings**: Centralized configuration management

### 👥 User Management
- **User Administration**: Create, edit, and manage user accounts
- **User Profiles**: View and manage user profile information
- **Role-based Access Control**: Manage user permissions and roles

### 🎨 User Interface
- Modern Material-UI based interface
- Responsive design for desktop and tablet use
- Toast notifications for user feedback
- Intuitive navigation with breadcrumbs

## Technology Stack

- **Frontend Framework**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **UI Library**: Material-UI (MUI) 7.1.0
- **Styling**: Tailwind CSS 4.1.8
- **Routing**: React Router DOM 7.6.1
- **HTTP Client**: Axios 1.9.0
- **Date Handling**: date-fns 2.30.0
- **Linting**: ESLint 9.25.0

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Access to the Estate Calculator API backend

## Installation

1. **Navigate to the admin directory**:
   ```bash
   cd admin
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API endpoint**:
   Update the API URL in `src/services/api.js` to point to your backend server:
   ```javascript
   const API_URL = 'https://your-api-domain.com/';
   ```

## Development

### Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## Project Structure

```
admin/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AuthProvider.jsx # Authentication context provider
│   │   ├── Navbar.jsx       # Navigation component
│   │   ├── ToastContext.jsx # Toast notifications
│   │   └── PromotionalCodeModal.jsx
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Dashboard
│   │   ├── Login.jsx        # Authentication page
│   │   ├── InsuranceClauses/ # Insurance clause management
│   │   ├── TariffPresets/   # Tariff preset management
│   │   ├── AppConfigs/      # Application configuration
│   │   ├── Users/           # User management
│   │   └── Profile/         # User profile management
│   ├── services/            # API service layer
│   │   ├── api.js           # Base API configuration
│   │   ├── auth.js          # Authentication service
│   │   ├── InsuranceClauseService.js
│   │   ├── TariffPresetService.js
│   │   ├── UserManagementService.js
│   │   └── ...
│   ├── App.jsx              # Main application component
│   └── main.jsx             # Application entry point
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
└── vite.config.js          # Vite configuration
```

## API Integration

The admin module communicates with the Symfony backend API through RESTful endpoints. Key API services include:

- **Authentication**: JWT token-based authentication
- **Insurance Clauses**: CRUD operations for insurance policy clauses
- **Tariff Presets**: Management of insurance tariff configurations
- **User Management**: Administrative user operations
- **App Configuration**: System settings management

## Environment Configuration

### Development
- API URL: Configured in `src/services/api.js`
- CORS: Handled by the backend API
- Authentication: JWT tokens stored in localStorage

### Production
- Update API URL to production endpoint
- Ensure HTTPS is enabled
- Configure proper CORS settings on the backend

## Security Considerations

- JWT tokens are stored securely in localStorage
- All API requests include authentication headers
- Protected routes prevent unauthorized access
- HTTPS is required for production deployments

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend API has proper CORS configuration
2. **Authentication Issues**: Check JWT token validity and API endpoint configuration
3. **Build Errors**: Verify all dependencies are installed correctly

### Development Tips

- Use browser developer tools to monitor API requests
- Check the console for authentication and API error messages
- Verify API endpoint configuration in `src/services/api.js`

## Contributing

1. Follow the existing code structure and naming conventions
2. Use Material-UI components for consistency
3. Implement proper error handling for API calls
4. Add appropriate loading states for async operations
5. Test all CRUD operations thoroughly

## License

This project is part of the Estate Calculator application suite.
