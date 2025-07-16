# KaamSathi - Full Stack Job Marketplace

> **Empowering India's 450+ Million Daily Wage Workers with Digital Employment Solutions**

A comprehensive job marketplace platform designed to revolutionize how India's daily wage workforce connects with employment opportunities.

## 📁 Project Structure

```
kaamSathi-fullstack/
├── frontend/           # Next.js React Application
│   ├── app/           # Next.js App Router pages
│   ├── components/    # Reusable UI components
│   ├── contexts/      # React contexts
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
├── backend/           # Node.js Express API Server
│   ├── src/           # Source code
│   ├── config/        # Configuration files
│   ├── middleware/    # Express middleware
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── controllers/   # Route controllers
│   ├── utils/         # Utility functions
│   └── package.json   # Backend dependencies
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB (local or Atlas)
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd kaamSathi-fullstack
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```
Frontend will run on: http://localhost:3000

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```
Backend will run on: http://localhost:5001

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.2.4** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 3.4.17** - Utility-first CSS
- **Radix UI** - Accessible UI primitives
- **Shadcn/ui** - Modern component library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Nodemailer** - Email service

## 📋 Development Workflow

### Frontend Development
```bash
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Backend Development
```bash
cd backend
npm run dev        # Start development server with nodemon
npm run start      # Start production server
npm run test       # Run tests
npm run seed       # Seed database with sample data
```


## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/send-otp` - Send OTP to phone number
- `POST /api/auth/verify-otp` - Verify OTP and login/register
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile

### Job Endpoints
- `GET /api/jobs` - Get all jobs with filtering
- `POST /api/jobs` - Create new job (employer only)
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job (employer only)
- `DELETE /api/jobs/:id` - Delete job (employer only)

### Application Endpoints
- `POST /api/applications` - Apply for a job
- `GET /api/applications` - Get user's applications
- `PUT /api/applications/:id/status` - Update application status

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload-avatar` - Upload profile picture

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt with salt rounds
- **Input Validation** - Joi/Zod schema validation
- **Rate Limiting** - Prevent API abuse
- **CORS Protection** - Cross-origin request security
- **Helmet** - Security headers
- **Data Sanitization** - Prevent XSS and injection

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Railway/Heroku)
```bash
cd backend
# Deploy to Railway/Heroku with MongoDB Atlas
```

## 📱 Features

### For Workers
- Smart job matching based on skills and location
- One-click job applications
- Real-time messaging with employers
- Earnings tracking and history
- Profile management with skill verification

### For Employers
- Post jobs with detailed requirements
- Browse and filter worker profiles
- Application management system
- Direct messaging with candidates
- Payment processing and tracking

### Platform Features
- Bilingual interface (Hindi/English)
- Mobile-first responsive design
- Real-time notifications
- Secure payment processing
- Advanced search and filtering
- Analytics and reporting

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@kaamsathi.com or join our Slack channel. # kaamsathi-fullstack-Description-
