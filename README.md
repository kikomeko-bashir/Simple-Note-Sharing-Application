# Simple Note-Sharing Application

A full-stack note-taking application built with React (frontend) and Django REST Framework (backend), featuring real-time collaboration, advanced search, and secure authentication.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure JWT-based login/registration with email or username
- **Note Management**: Create, read, update, and delete notes with rich markdown support
- **Real-time Collaboration**: View notes from all users while maintaining ownership controls
- **Advanced Search**: Full-text search with PostgreSQL ranking (fallback to basic search)
- **Smart Filtering**: Filter notes by author ("Mine" button) and other criteria
- **Responsive Design**: Mobile-first design with dark/light theme support

### User Experience
- **Sticky Navigation**: Header and search bar remain visible while scrolling
- **Note Cards**: Uniform-sized cards with truncated content preview
- **Modal Viewing**: Click any note to view full content in a popup modal
- **Owner Controls**: Edit/delete buttons only visible to note authors
- **Keyboard Shortcuts**: Quick actions for power users
- **Loading States**: Skeleton screens and smooth transitions

### Security Features
- **JWT Authentication**: Secure token-based authentication with automatic refresh
- **Rate Limiting**: API throttling to prevent abuse (10/min for auth, 120/min for notes)
- **Input Validation**: Comprehensive server-side validation and sanitization
- **Password Security**: bcrypt hashing with strong password requirements
- **CORS Protection**: Controlled cross-origin access
- **Security Headers**: XSS protection, secure cookies, HSTS in production

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with Vite for fast development
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context API for global state
- **Routing**: React Router for navigation
- **HTTP Client**: Axios with automatic token handling
- **Markdown**: React Markdown with syntax highlighting

### Backend (Django + DRF)
- **Framework**: Django 5.2 with Django REST Framework
- **Database**: PostgreSQL (production) / SQLite (development)
- **Authentication**: JWT tokens with SimpleJWT
- **API Documentation**: drf-spectacular with Swagger UI
- **Search**: PostgreSQL full-text search with ranking
- **Security**: Rate limiting, input validation, secure headers

## 📁 Project Structure

```
Simple Note-Sharing Application/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── common/       # Shared components
│   │   │   └── notes/        # Note-specific components
│   │   ├── context/          # React Context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components
│   │   └── services/         # API client and utilities
│   └── package.json
├── backend/                  # Django backend API
│   ├── accounts/             # Authentication app
│   ├── notes/                # Notes management app
│   ├── notes_backend/        # Django project settings
│   └── requirements.txt
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL (optional, SQLite works for development)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment configuration**
   Create `.env` file in backend directory:
   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   USE_POSTGRES=False
   # For PostgreSQL (optional)
   # USE_POSTGRES=True
   # DB_NAME=notes_db
   # DB_USER=postgres
   # DB_PASSWORD=your-password
   # DB_HOST=localhost
   # DB_PORT=5432
   ```

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/api/docs/

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Django settings
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (optional)
USE_POSTGRES=False
DB_NAME=notes_db
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432

# JWT settings
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

# CORS settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login (email or username)
- `POST /api/auth/refresh/` - Refresh JWT token
- `GET /api/auth/verify/` - Verify token validity
- `POST /api/auth/logout/` - Logout and blacklist token

### Notes Endpoints
- `GET /api/notes/` - List notes (with search, filter, pagination)
- `POST /api/notes/` - Create new note
- `GET /api/notes/{id}/` - Get specific note
- `PUT /api/notes/{id}/` - Update note (owner only)
- `DELETE /api/notes/{id}/` - Delete note (owner only)

### Query Parameters
- `q` - Search query (full-text search)
- `user__id` - Filter by author ID
- `user__username` - Filter by author username
- `ordering` - Sort by field (e.g., `-updated_at`, `title`)
- `page` - Page number for pagination
- `page_size` - Number of items per page

## 🔒 Security Features

### Authentication & Authorization
- JWT tokens with configurable expiration
- Token blacklisting after refresh
- User ownership enforcement for note operations
- Secure password hashing with bcrypt

### Rate Limiting
- Authentication endpoints: 10 requests/minute
- Notes endpoints: 120 requests/minute
- Anonymous users: 100 requests/hour
- Authenticated users: 1000 requests/hour

### Input Validation
- Comprehensive serializer validation
- SQL injection prevention via ORM
- XSS protection through React and security headers
- CORS configuration for controlled access

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Production Checklist
1. Set `DEBUG=False` in environment
2. Configure production database (PostgreSQL recommended)
3. Set secure `SECRET_KEY`
4. Configure `ALLOWED_HOSTS` for your domain
5. Set up HTTPS and update CORS origins
6. Configure static file serving
7. Set up proper logging and monitoring

### Docker Deployment (Optional)
```dockerfile
# Example Dockerfile for backend
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the API documentation at `/api/docs/`
- Review the test files for usage examples
- Open an issue on GitHub

## 🔄 Version History

- **v1.0.0** - Initial release with core note-sharing functionality
- Features: JWT auth, CRUD operations, search, filtering, responsive design
- Security: Rate limiting, input validation, secure headers
- Documentation: Swagger UI, comprehensive README
