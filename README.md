# GLA Admin Dashboard

A modern Next.js admin dashboard for managing podcasts, built with TypeScript, Tailwind CSS, and Zustand for state management.

## Features

✅ **Admin Authentication**
- Login with JWT token-based authentication
- Role verification (admin-only access)
- Persistent session management with localStorage

✅ **Podcast Management**
- Upload new podcasts with metadata (title, artist, album, language)
- Upload cover images and audio files
- View all uploaded podcasts
- Delete podcasts
- Filter by language and album

✅ **Dashboard**
- Real-time podcast list with audio player
- File upload with drag-and-drop support
- Loading states and error handling
- Toast notifications

✅ **Admin Features**
- User management endpoints (ready for integration)
- Logout functionality
- Protected routes with middleware

## Tech Stack

- **Frontend Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with localStorage persistence
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Image Handling**: Next.js Image component

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Running GLA backend on `http://localhost:5005/api`

### Installation

```bash
cd admin
npm install
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5005/api
```

### Running the Dashboard

Development mode:
```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Login

1. Navigate to `http://localhost:3000/login`
2. Enter admin credentials:
   - **Email**: `admin@gla.com`
   - **Password**: `admin123`
3. Click Login and you'll be redirected to the dashboard

### Upload Podcast

1. Click the "Upload New" tab
2. Fill in podcast details:
   - **Title** (required) - Podcast name
   - **Language** - Choose English, French, or Swahili
   - **Album** - Auto-populated based on selected language
   - **Artist** (optional) - Defaults to "GLA"
3. Select podcast cover image (PNG, JPG, GIF)
4. Select audio file (MP3, WAV, M4A)
5. Click "Upload Podcast"

### Manage Podcasts

1. Click the "My Podcasts" tab
2. View all uploaded podcasts with:
   - Cover image preview
   - Title, artist, album, language tags
   - Built-in audio player
   - Upload date
   - Delete button for each podcast

## Project Structure

```
admin/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── page.tsx             # Home (auto-redirect)
│   │   ├── login/
│   │   │   └── page.tsx         # Admin login page
│   │   └── dashboard/
│   │       └── page.tsx         # Main dashboard
│   ├── components/
│   │   ├── Navbar.tsx           # Navigation bar
│   │   ├── PodcastList.tsx      # Podcast grid display
│   │   ├── UploadForm.tsx       # Podcast upload form
│   │   └── ToastProvider.tsx    # Toast notification system
│   ├── lib/
│   │   ├── api.ts              # Axios API client & methods
│   │   └── store.ts            # Zustand auth store
│   └── middleware.ts            # Route protection middleware
├── .env.local                   # Environment variables
├── tailwind.config.ts           # Tailwind CSS config
├── next.config.ts              # Next.js configuration
└── package.json
```

## API Integration

All API calls use JWT token authentication via `x-auth-token` header.

### Available Endpoints

**Authentication**
- `POST /api/users/login` - Admin login
- `POST /api/users/logout` - Logout
- `GET /api/users/profile` - Get current user profile

**Podcast Management**
- `POST /api/audio/upload` - Upload podcast (multipart form)
- `GET /api/audio` - List all podcasts (supports filters)
- `GET /api/audio/:id` - Get podcast details
- `DELETE /api/audio/:id` - Delete podcast

**User Management** (Admin endpoints)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Authentication Flow

1. Admin logs in with email/password
2. Backend validates and returns JWT token + user info with role
3. Dashboard checks if user role is "admin"
4. Token stored in Zustand store AND localStorage
5. Token automatically included in all API requests
6. Session persists across page reloads/browser restarts

## State Management

Using Zustand with localStorage persistence:

```typescript
import { useAuthStore } from '@/lib/store';

const { user, token, isAuthenticated, setAuth, logout } = useAuthStore();
```

## Error Handling

- ✅ Login validation with error toasts
- ✅ API error messages displayed to user
- ✅ File upload validation (type, size)
- ✅ Confirmation dialog for destructive actions
- ✅ Loading states during async operations

## Commands

```bash
# Development with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type checking
npx tsc --noEmit
```

## Deployment

### Vercel (Recommended)

```bash
# Login to Vercel
vercel login

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### Login Issues
- Verify backend running: `curl http://localhost:5005/api/health`
- Check credentials: `admin@gla.com` / `admin123`
- Check browser DevTools → Network tab for API errors

### Upload Fails
- Verify both image and audio files selected
- Check file sizes (image: <10MB, audio: <100MB)
- Check backend logs for errors
- Verify `.env.local` has correct `NEXT_PUBLIC_API_URL`

### Podcasts Not Showing
- Clear browser cache or force refresh (Ctrl+Shift+R)
- Check browser console for errors
- Verify JWT token is valid (check Network tab)

## Future Enhancements

- [ ] Edit podcast metadata
- [ ] Bulk upload support
- [ ] Podcast analytics (views, downloads)
- [ ] User management UI
- [ ] Advanced search and filtering
- [ ] Podcast series/episodes support
- [ ] Admin notifications
- [ ] Scheduled publishing

## License

MIT

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
