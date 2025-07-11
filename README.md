# Car Rental Admin Dashboard

A comprehensive Next.js 15+ application for managing car rental listings with authentication, CRUD operations, and audit trails.

## Features

- **Authentication**: Secure login/logout with JWT tokens
- **Dashboard**: Paginated listings table with filtering and search
- **CRUD Operations**: Approve, reject, and edit listings
- **Audit Trail**: Track all administrative actions
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **SQLite Database**: Local database with automatic seeding
- **Server-Side Rendering**: Optimized performance with SSR

## Tech Stack

- **Next.js 15+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **SQLite** for database
- **JWT** for authentication
- **Lucide React** for icons

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Open [http://localhost:3000](http://localhost:3000)
   - Login with default credentials: `admin` / `admin123`

## Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   ├── dashboard/           # Dashboard pages
│   ├── login/              # Login page
│   └── layout.tsx          # Root layout
├── components/             # Reusable components
├── context/               # React Context providers
├── lib/                   # Utilities and database
└── types/                 # TypeScript types
```

## Database Schema

The application uses SQLite with three main tables:
- `listings`: Car rental listings
- `users`: Admin users
- `audit_logs`: Action tracking

## Features Implemented

### Core Features
-  Login page with authentication
-  Dashboard with paginated listings table
-  Approve/Reject/Edit actions
-  Edit form with pre-filled data
-  Next.js API routes for backend logic
-  Server-side rendering for dashboard
-  Route protection with middleware
-  React Context for notifications
-  Tailwind CSS styling

### Stretch Goals
-  Filtering by listing status
-  Search functionality
-  Audit trail/logging view
-  Performance optimizations
-  Responsive design
-  Error handling and notifications

## API Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `PUT /api/listings/[id]` - Update listing
- `POST /api/listings/[id]/approve` - Approve listing
- `POST /api/listings/[id]/reject` - Reject listing

## Deployment

The application is ready for deployment on Vercel or any Node.js hosting platform. The SQLite database file will be created automatically on first run.

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Route protection middleware
- Input validation
- CSRF protection with SameSite cookies

## Performance Optimizations

- Server-side rendering for initial page load
- Efficient database queries with pagination
- Optimized re-renders listing
- Image lazy loading and error handling
- Minimal bundle size with tree shaking