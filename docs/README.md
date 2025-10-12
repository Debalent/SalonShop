# SalonShop - Complete Beauty & Salon Management System

A comprehensive, full-stack salon management application with mobile customer booking app, web admin dashboard, and robust backend API. Built with React Native, React, and Node.js.

## 🏗️ Project Structure

```
SalonShop/
├── mobile/                     # React Native mobile app
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── screens/           # Screen components
│   │   ├── navigation/        # Navigation configuration
│   │   ├── contexts/          # React contexts
│   │   ├── services/          # API services
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Utility functions
│   │   └── themes/            # Theme configuration
│   ├── assets/               # Images, fonts, icons
│   └── app.json              # Expo configuration
│
├── admin-panel/               # React web admin dashboard
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React contexts
│   │   ├── services/         # API services
│   │   ├── hooks/            # Custom hooks
│   │   └── utils/            # Utility functions
│   ├── public/               # Static assets
│   └── package.json          # Dependencies
│
├── backend/                   # Node.js Express API
│   ├── controllers/          # Route controllers
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── services/            # Business logic services
│   ├── utils/               # Utility functions
│   ├── config/              # Configuration files
│   └── server.js            # Entry point
│
├── shared/                   # Shared code between apps
│   ├── constants/           # Shared constants
│   ├── validators/          # Form validation
│   ├── hooks/              # API hooks
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript definitions
│
├── localization/            # i18n translation files
│   ├── en.json             # English
│   ├── es.json             # Spanish
│   ├── ko.json             # Korean
│   ├── zh.json             # Chinese
│   ├── vi.json             # Vietnamese
│   └── index.js            # i18n configuration
│
├── docs/                    # Documentation
│   ├── README.md           # This file
│   ├── ROADMAP.md          # Development roadmap
│   ├── ACCESSIBILITY.md    # Accessibility guidelines
│   ├── ARCHITECTURE.md     # Technical architecture
│   └── SURVEY_INSIGHTS.md  # User research insights
│
├── tests/                   # Test files
│   ├── mobile/             # Mobile app tests
│   ├── admin-panel/        # Admin panel tests
│   ├── backend/            # Backend API tests
│   └── shared/             # Shared code tests
│
└── scripts/                 # Build and deployment scripts
    ├── build.js            # Build scripts
    ├── deploy.js           # Deployment scripts
    └── seed-data.js        # Database seeding
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB database
- Expo CLI (for mobile development)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SalonShop
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend && npm install
   
   # Admin Panel
   cd ../admin-panel && npm install
   
   # Mobile App
   cd ../mobile && npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp backend/.env.example backend/.env
   cp admin-panel/.env.example admin-panel/.env
   cp mobile/.env.example mobile/.env
   
   # Edit environment variables
   nano backend/.env
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend API
   cd backend && npm run dev
   
   # Terminal 2 - Admin Panel
   cd admin-panel && npm start
   
   # Terminal 3 - Mobile App
   cd mobile && expo start
   ```

## 🎯 Features

### 📱 Mobile App (React Native)
- **Customer Features:**
  - Service browsing and booking
  - Staff selection and scheduling
  - Payment processing with Stripe
  - Booking history and management
  - Push notifications
  - Multi-language support
  - Dark/light theme support

- **Staff Features:**
  - Schedule management
  - Customer information access
  - Booking status updates
  - Earnings tracking

### 💻 Admin Panel (React Web)
- **Business Management:**
  - Real-time dashboard with analytics
  - Service and staff management
  - Customer relationship management
  - Booking and appointment oversight
  - Financial reporting and payroll
  - Inventory management
  - Review and rating system

### 🔧 Backend API (Node.js/Express)
- **Core Services:**
  - RESTful API with comprehensive endpoints
  - JWT authentication and authorization
  - Role-based access control
  - Real-time notifications with Socket.io
  - File upload with Cloudinary
  - Email/SMS notifications
  - Payment processing integration
  - Comprehensive data validation

## 🛠️ Technology Stack

### Frontend
- **Mobile:** React Native + Expo
- **Web:** React + Material-UI
- **State Management:** React Context + Hooks
- **Navigation:** React Navigation (mobile), React Router (web)
- **UI Libraries:** React Native Paper, Material-UI
- **Internationalization:** react-i18next

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT + bcrypt
- **File Storage:** Cloudinary
- **Real-time:** Socket.io
- **Email:** SendGrid
- **SMS:** Twilio
- **Payments:** Stripe

### DevOps & Tools
- **Version Control:** Git
- **Package Manager:** npm/yarn
- **Code Quality:** ESLint, Prettier
- **Testing:** Jest, React Testing Library
- **Deployment:** Docker, Heroku/AWS
- **Monitoring:** Analytics integration

## 📊 Database Schema

### Core Models
- **User:** Customer, staff, and admin accounts
- **Booking:** Appointment scheduling and management
- **Service:** Beauty services and pricing
- **ServiceType:** Service categories and variations
- **Staff:** Employee profiles and specialties
- **Payroll:** Employee compensation tracking
- **Tip:** Gratuity management and distribution
- **DispersalRule:** Automated payment distribution

### Key Relationships
```
User (1:N) Booking
Staff (1:N) Booking
Service (1:N) Booking
ServiceType (1:N) Service
User (1:N) Payroll
Staff (1:N) Tip
```

## 🔐 Authentication & Authorization

### Role-Based Access Control
- **Customer:** Book services, view history, manage profile
- **Staff:** Manage schedule, view appointments, update status
- **Admin:** Full business management access
- **Super Admin:** System-wide administration

### Security Features
- JWT token-based authentication
- Password hashing with bcrypt
- Rate limiting and request throttling
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 🌍 Internationalization

Support for 5 languages:
- **English (en)** - Default
- **Spanish (es)** - Español
- **Korean (ko)** - 한국어
- **Chinese (zh)** - 中文
- **Vietnamese (vi)** - Tiếng Việt

### Implementation
- react-i18next for translation management
- Automatic language detection
- RTL language support ready
- Localized date/time formatting
- Currency localization

## 🎨 Design System

### Theme (Hideaway Pizza Inspired)
- **Primary:** Deep Red (#D32F2F)
- **Secondary:** Amber Gold (#FFC107)
- **Background:** Light Gray (#FAFAFA)
- **Typography:** Clean, readable fonts
- **Spacing:** Consistent 8px grid system

### Accessibility
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation support
- High contrast mode
- Focus indicators
- Alternative text for images

## 📱 Mobile App Architecture

### Navigation Structure
```
Root Navigator
├── Auth Stack (Login, Register, Forgot Password)
└── Main Tabs
    ├── Home (Services, Booking)
    ├── Bookings (History, Upcoming)
    ├── Profile (Settings, Preferences)
    └── Admin/Staff (Role-specific features)
```

### Key Components
- **Logo Component:** Reusable branding element
- **Theme Provider:** Dark/light mode support
- **Auth Context:** Authentication state management
- **API Service:** Centralized API communication

## 💻 Admin Panel Architecture

### Dashboard Modules
- **Analytics:** Revenue, bookings, customer insights
- **Bookings:** Appointment management and scheduling
- **Services:** Service catalog management
- **Staff:** Employee management and scheduling
- **Customers:** CRM and customer insights
- **Reports:** Financial and operational reporting
- **Settings:** Business configuration

### Features
- Responsive design for all screen sizes
- Real-time data updates
- Export functionality for reports
- Batch operations for efficiency
- Advanced filtering and search

## 🔄 API Architecture

### RESTful Endpoints
```
Authentication
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
POST /api/auth/refresh

Bookings
GET    /api/bookings
POST   /api/bookings
PUT    /api/bookings/:id
DELETE /api/bookings/:id
GET    /api/bookings/available-slots

Services
GET    /api/services
POST   /api/services
PUT    /api/services/:id
DELETE /api/services/:id
GET    /api/services/search

Staff
GET    /api/staff
GET    /api/staff/:id/schedule
PUT    /api/staff/:id/schedule

Analytics
GET    /api/analytics/dashboard
GET    /api/analytics/revenue
GET    /api/analytics/bookings
```

### Middleware Stack
- **Authentication:** JWT verification
- **Authorization:** Role-based access control
- **Validation:** Request data validation
- **Error Handling:** Centralized error management
- **Logging:** Request/response logging
- **Rate Limiting:** API abuse prevention

## 🧪 Testing Strategy

### Test Coverage
- **Unit Tests:** Individual component/function testing
- **Integration Tests:** API endpoint testing
- **E2E Tests:** Complete user flow testing
- **Performance Tests:** Load and stress testing

### Testing Tools
- Jest for unit testing
- React Testing Library for component testing
- Supertest for API testing
- Cypress for E2E testing

## 🚀 Deployment

### Production Setup
1. **Backend Deployment:**
   - Configure production environment variables
   - Set up MongoDB cluster
   - Deploy to Heroku/AWS/Digital Ocean
   - Configure SSL certificates

2. **Admin Panel Deployment:**
   - Build production bundle
   - Deploy to Netlify/Vercel
   - Configure environment variables
   - Set up custom domain

3. **Mobile App Deployment:**
   - Build Android APK/iOS IPA
   - Submit to Google Play/App Store
   - Configure push notifications
   - Set up analytics tracking

### Environment Variables
```bash
# Backend
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://...
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_live_...
CLOUDINARY_URL=cloudinary://...
SENDGRID_API_KEY=SG...
TWILIO_ACCOUNT_SID=AC...

# Frontend
REACT_APP_API_URL=https://api.yourapp.com
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_...
```

## 📈 Performance Optimization

### Frontend
- Code splitting and lazy loading
- Image optimization and lazy loading
- Bundle size optimization
- Caching strategies
- Progressive Web App features

### Backend
- Database indexing
- Query optimization
- Caching with Redis
- Connection pooling
- API response compression

### Mobile
- Native module optimization
- Image caching
- Offline functionality
- Background processing
- Memory management

## 🔧 Development Workflow

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# Create pull request
# After review and approval, merge to main
```

### Code Quality
- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks
- Conventional commits
- Code review requirements

## 📚 API Documentation

### Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Responses
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Development Guidelines
- Follow the established code style
- Write comprehensive tests
- Update documentation
- Use conventional commit messages
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🙋‍♂️ Support

For support, email support@salonshop.com or join our Slack channel.

## 🗺️ Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned features and improvements.

## 🏆 Acknowledgments

- Hideaway Pizza for UI/UX inspiration
- React Native and React communities
- Open source contributors
- Beta testers and early adopters

---

**Built with ❤️ by the SalonShop Team**