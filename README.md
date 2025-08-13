# 💰 Personal Finance Tracker

A comprehensive full-stack web application that helps users track expenses, analyze spending habits, and manage their financial health. Built with React frontend, Node.js backend, MongoDB database, and integrated with Plaid API for secure bank account linking.

## ✨ Features

- **User Authentication**: Secure sign up, login, and profile management
- **Bank Account Integration**: Securely link bank accounts using Plaid API
- **Transaction Management**: Automatic import and categorization of transactions
- **Expense Tracking**: Manual entry and bulk import of financial data
- **Data Visualization**: Interactive charts and graphs for spending analytics
- **Budget Planning**: Set budgets and track spending against goals
- **Multi-Currency Support**: Handle different currencies and exchange rates
- **Mobile Responsive**: Optimized for desktop and mobile devices
- **Real-time Updates**: Live data synchronization across devices

## 🛠️ Technologies Used

### Frontend
- **Framework**: React 18
- **Language**: JavaScript/JSX
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Routing**: React Router DOM
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

### External APIs
- **Plaid API**: Bank account linking and transaction data
- **Currency API**: Exchange rate data (configurable)

### Infrastructure
- **Containerization**: Docker
- **Deployment**: AWS EC2 ready
- **Process Management**: PM2 (production)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB 5.0+
- Plaid Developer Account
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/personal-finance-tracker.git
   cd personal-finance-tracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your configuration
   
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if using local installation)
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update connection string in .env
   ```

### Environment Variables

Create a `.env` file in the backend directory:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/finance-tracker

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# Plaid API Configuration
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## 📱 Application Structure

### Frontend Components

```
frontend/src/
├── components/
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Main dashboard
│   ├── transactions/   # Transaction management
│   ├── accounts/       # Account management
│   ├── analytics/      # Charts and reports
│   ├── profile/        # User profile
│   └── layout/         # Navigation and layout
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── services/           # API services
└── utils/              # Utility functions
```

### Backend Structure

```
backend/
├── models/             # MongoDB schemas
├── routes/             # API endpoints
├── middleware/         # Custom middleware
├── services/           # Business logic
├── utils/              # Helper functions
└── config/             # Configuration files
```

## 🔐 Authentication & Security

### User Registration & Login
- Secure password hashing with bcrypt
- JWT token-based authentication
- Account lockout after failed attempts
- Password strength validation

### Security Features
- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation and sanitization
- SQL injection prevention

## 🏦 Plaid Integration

### Bank Account Linking
1. User initiates account linking
2. Redirected to Plaid Link
3. User selects bank and enters credentials
4. Plaid returns access token
5. Backend stores token securely
6. Automatic transaction sync begins

### Transaction Sync
- Real-time transaction updates
- Automatic categorization
- Merchant information enrichment
- Duplicate detection

## 📊 Analytics & Reporting

### Spending Analysis
- **Category Breakdown**: Visualize spending by category
- **Time Trends**: Monthly/weekly spending patterns
- **Budget Tracking**: Compare actual vs. planned spending
- **Income vs. Expenses**: Net cash flow analysis

### Charts & Visualizations
- Pie charts for category distribution
- Line charts for spending trends
- Bar charts for budget comparisons
- Heat maps for spending patterns

## 🚀 Deployment

### Docker Deployment

1. **Build the image**
   ```bash
   docker build -t personal-finance-tracker .
   ```

2. **Run the container**
   ```bash
   docker run -p 80:80 -p 5000:5000 personal-finance-tracker
   ```

### AWS EC2 Deployment

1. **Launch EC2 Instance**
   ```bash
   # Use Ubuntu 20.04 LTS
   # Minimum: t3.micro (free tier)
   # Recommended: t3.small or larger
   ```

2. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm mongodb docker.io
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/personal-finance-tracker.git
   
   # Build and run with Docker
   cd personal-finance-tracker
   docker-compose up -d
   ```

4. **Configure Nginx (Optional)**
   ```bash
   sudo apt install nginx
   # Configure nginx.conf for reverse proxy
   ```

### Environment Variables for Production

```bash
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-production-jwt-secret
PLAID_ENV=production
FRONTEND_URL=https://yourdomain.com
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
```bash
# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test protected endpoint
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📈 Performance & Scaling

### Database Optimization
- Indexed queries for common operations
- Aggregation pipelines for analytics
- Connection pooling
- Query optimization

### Caching Strategy
- Redis for session storage (optional)
- Browser caching for static assets
- API response caching

### Load Balancing
- Horizontal scaling with multiple instances
- Nginx reverse proxy
- Health checks and auto-scaling

## 🔧 Configuration

### MongoDB Settings
```javascript
// Connection options
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}
```

### Plaid Configuration
```javascript
// Plaid client configuration
const plaidClient = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: plaid.environments[process.env.PLAID_ENV],
  options: {
    version: '2020-09-14'
  }
});
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MongoDB service status
   - Verify connection string
   - Check network connectivity

2. **Plaid Integration Issues**
   - Verify API credentials
   - Check Plaid environment (sandbox/development)
   - Review Plaid API documentation

3. **JWT Token Errors**
   - Check JWT_SECRET environment variable
   - Verify token expiration
   - Check token format in headers

### Debug Mode

Enable debug logging:
```bash
DEBUG=* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write meaningful commit messages
- Include tests for new features
- Update documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Plaid team for financial data APIs
- MongoDB team for the excellent database
- React team for the amazing frontend framework
- Express.js team for the robust backend framework

## 📞 Support

- **Documentation**: Check the code comments and README
- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join community discussions
- **Email**: Contact maintainers for urgent issues

---

**Built with ❤️ for financial wellness and personal growth**
