# Notes App - Frontend

A simple note-sharing application built with React, featuring authentication and note management capabilities.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🎯 Current Features (Phase 1A)

### ✅ Authentication System
- **User Registration** - Create new accounts with email/password
- **User Login** - Sign in with existing credentials
- **JWT Token Management** - Secure token-based authentication
- **Protected Routes** - Automatic redirect to login for unauthenticated users
- **Form Validation** - Client-side validation with error messages
- **Mock Data** - Fully functional with mock API (no backend required)

### 🎨 UI/UX Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Theme** - Toggle between themes (ready for implementation)
- **Loading States** - Smooth loading indicators and skeleton screens
- **Error Handling** - User-friendly error messages with validation
- **Toast Notifications** - Success and error feedback
- **Modern UI** - Clean, professional design with Tailwind CSS
- **Keyboard Shortcuts** - Quick navigation (Ctrl+N, Ctrl+F, Ctrl+/, Esc)
- **Accessibility** - Full ARIA support, screen reader compatibility
- **Performance** - Lazy loading, optimized rendering
- **Animations** - Smooth page transitions and micro-interactions

## ⌨️ Keyboard Shortcuts

- **Ctrl+N** / **Cmd+N** - Create new note
- **Ctrl+F** / **Cmd+F** - Focus search bar
- **Ctrl+K** / **Cmd+K** - Open command palette (coming soon)
- **Ctrl+/** / **Cmd+/** - Show keyboard shortcuts
- **Esc** - Close modal/dialog

## 🧪 Development Mode

**Any email and password combination will work for login!**

Just enter any email (e.g., `test@example.com`) and any password (e.g., `password123`) to login. The app will automatically create a user account for you.

### Examples:
- **Email:** `myemail@test.com` | **Password:** `anything`
- **Email:** `user@example.com` | **Password:** `123456`
- **Email:** `admin@test.com` | **Password:** `admin`

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   └── common/         # Reusable UI components
├── context/            # React Context providers
├── data/              # Mock data and services
├── pages/             # Page components
├── services/          # API services (mock)
├── styles/            # Global styles
└── utils/             # Utility functions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Styling

This project uses **Tailwind CSS** for styling with:
- Custom color palette
- Dark mode support
- Responsive design utilities
- Component-based styling approach

## 🔐 Authentication Flow

1. **Login/Register** - Users can sign in or create new accounts
2. **Token Storage** - JWT tokens stored in localStorage
3. **Route Protection** - Automatic redirect to login for protected routes
4. **Token Verification** - Mock token validation on app load
5. **Logout** - Clear tokens and redirect to login

## 🚧 Upcoming Features (Phase 1B)

- Notes Dashboard
- Create/Edit/Delete Notes
- Search and Filter
- Markdown Support
- Advanced UI Features

## 🛠️ Development Notes

- **Mock API** - All data is simulated with realistic delays
- **No Backend Required** - Frontend runs independently
- **Easy Integration** - Ready to connect to real backend API
- **TypeScript Ready** - Can be easily migrated to TypeScript

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

**Phase 1A Complete!** 🎉 The authentication system is fully functional with mock data. Ready to move on to Phase 1B (Notes Dashboard).
