# 🚀 GoBarber - Comprehensive Setup Guide

## ✅ Prerequisites

Before starting, ensure you have installed:

- **Node.js**: v14+ (recommended v16 or v18)
- **npm**: v6+ or **yarn** v1.22+
- **PostgreSQL**: v11+ (for production database)
- **Git**: Latest version
- **Android Studio** (for mobile development) OR **Xcode** (for iOS development)

---

## 📋 Environment Setup Files Created

All three applications now have `.env` and `.env.example` files for environment configuration:

- ✅ `GoBarberAPI/.env` - Backend API configuration
- ✅ `GoBarberAPI/.env.example` - Backend API template
- ✅ `GoBarberFront/gobarberweb/.env` - Frontend Web configuration
- ✅ `GoBarberFront/gobarberweb/.env.example` - Frontend Web template
- ✅ `GoBarberApp/GoBarberMobile/.env` - Mobile App configuration
- ✅ `GoBarberApp/GoBarberMobile/.env.example` - Mobile App template

---

## 🔧 Step 1: Backend API Setup

### 1.1 Navigate to Backend Directory

```bash
cd GoBarberAPI
```

### 1.2 Install Dependencies

```bash
npm install
# or
yarn install
```

### 1.3 Configure Environment Variables

Edit `GoBarberAPI/.env` with your database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres          # Your PostgreSQL username
DB_PASS=postgres          # Your PostgreSQL password
DB_NAME=gobarber

# JWT Configuration (CHANGE IN PRODUCTION!)
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Storage
STORAGE_TYPE=disk
UPLOAD_FOLDER=tmp/uploads

# Environment
NODE_ENV=development
```

### 1.4 Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE gobarber;

# Exit
\q
```

> **Tip**: If you don't have PostgreSQL installed, use Docker:
> ```bash
> docker run --name postgres-gobarber -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:latest
> ```

### 1.5 Run Database Migrations

```bash
npm run migrations:run
```

> **Note**: This will create all necessary tables in the PostgreSQL database.

### 1.6 Start the Backend Server

```bash
npm run dev:server
```

✅ **Expected output**: `Server started on port 3333`

**Access API Documentation**:
- Base URL: `http://localhost:3333`
- Health Check: `http://localhost:3333` (should respond with 200)

---

## 🎨 Step 2: Frontend Web Setup

### 2.1 Navigate to Frontend Directory

```bash
cd GoBarberFront/gobarberweb
```

### 2.2 Install Dependencies

```bash
npm install
# or
yarn install
```

> **Note**: This may show warnings about react-scripts version. These are normal and expected.

### 2.3 Configure Environment Variables

The `.env` file is already configured for local development:

```env
REACT_APP_API_URL=http://localhost:3333
REACT_APP_ENV=development
```

**For production deployment**, change it to your production URL:
```env
REACT_APP_API_URL=https://api.gobarber.com
REACT_APP_ENV=production
```

### 2.4 Start the Frontend Server

```bash
npm start
```

✅ **Expected behavior**: 
- Browser opens automatically to `http://localhost:3000`
- If not, go to `http://localhost:3000` manually
- You should see the GoBarber login page

### 2.5 Test the Frontend

1. Go to **Signup** page
2. Create a test account with:
   - Email: `test@example.com`
   - Password: `123456`
3. Login with the created account
4. You should see the Dashboard

---

## 📱 Step 3: Mobile App Setup

### 3.1 Navigate to Mobile Directory

```bash
cd GoBarberApp/GoBarberMobile
```

### 3.2 Install Dependencies

```bash
npm install
# or
yarn install
```

### 3.3 Configure Environment Variables

Edit `GoBarberApp/GoBarberMobile/.env`:

**For Local Development** (using Android Emulator or iOS Simulator):
```env
API_URL=http://localhost:3333
REACTOTRON_HOST=localhost
```

**For Physical Device on Local Network**:
```env
API_URL=http://YOUR_MACHINE_IP:3333
REACTOTRON_HOST=YOUR_MACHINE_IP
```

> **How to find your machine IP**:
> - **Windows**: Run `ipconfig` in cmd → look for "IPv4 Address"
> - **Mac/Linux**: Run `ifconfig` → look for inet address (usually starts with 192.168 or 10.x)

### 3.4 Install react-native-config (if not already installed)

```bash
npm install react-native-config
```

### 3.5 Start Metro Bundler

```bash
npm start
```

✅ **Expected output**: Your terminal shows the Metro Bundler running

### 3.6 Run on Android (in another terminal)

```bash
npm run android
```

**Requirements:**
- Android Studio installed
- Android Virtual Device (AVD) running or physical device connected
- `ANDROID_HOME` environment variable configured

### 3.7 Run on iOS (in another terminal, macOS only)

```bash
npm run ios
```

**Requirements:**
- Xcode installed
- iOS Simulator running or physical device connected

---

## 🧪 Step 4: Test All Applications

### 4.1 Test Backend API

```bash
# Open another terminal and test endpoints:

# Health check
curl http://localhost:3333

# Create user (signup)
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "123456"
  }'

# Login
curl -X POST http://localhost:3333/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

### 4.2 Test Frontend Web

1. Open `http://localhost:3000`
2. Go to **Signup** tab
3. Create account with: `test@example.com` / `123456`
4. Login with the account
5. Verify you can see the Dashboard

### 4.3 Test Mobile App

1. Open the app on emulator/simulator
2. Go to **Signup** tab
3. Create account
4. Login
5. Verify you can see the Dashboard

---

## 🔐 Security Checklist

### ✅ What's Protected Now

- [x] `.env` files added to `.gitignore` (credentials won't be exposed)
- [x] JWT secret moved to environment variables
- [x] Database credentials in environment variables
- [x] API URLs configurable per environment
- [x] Hardcoded IPs removed from mobile app
- [x] Error handling improved for security

### 🔑 Production Security Checklist

Before deploying to production:

- [ ] Change all `JWT_SECRET` to a strong, random value
- [ ] Update `DB_USER` and `DB_PASS` with production credentials
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS URLs for all API endpoints
- [ ] Enable CORS with specific origins only
- [ ] Set strong database passwords
- [ ] Use environment-specific database (never use local)
- [ ] Enable SSL/TLS for database connections
- [ ] Set up proper logging and monitoring
- [ ] Configure backups for production database

---

## 📚 API Endpoints

### Authentication
```
POST   /sessions              → Login with email/password
POST   /users                 → Create new user account

GET    /profile               → Get user profile (auth required)
PATCH  /profile               → Update user profile (auth required)
PATCH  /users/avatar          → Upload profile avatar (auth required)

POST   /password/forgot       → Request password reset
POST   /password/reset        → Reset password with token
```

### Appointments
```
GET    /appointments/me       → Get user's appointments (auth required)
GET    /providers             → Get list of service providers
POST   /appointments          → Create appointment (auth required)
DELETE /appointments/:id      → Cancel appointment (auth required)
```

### Providers
```
GET    /appointments/:provider_id/available  → Check provider availability
```

---

## 🐛 Troubleshooting

### Backend won't start

**Error**: `Database connection failed`
- ✅ Verify PostgreSQL is running
- ✅ Check DB_HOST, DB_USER, DB_PASS in `.env`
- ✅ Ensure database `gobarber` exists
- ✅ Run migrations: `npm run migrations:run`

**Error**: `Cannot find module` or `ENOENT`
- ✅ Run `npm install` again
- ✅ Delete `node_modules` and `package-lock.json`, then reinstall
- ✅ Clear npm cache: `npm cache clean --force`

### Frontend won't start

**Error**: `REACT_APP_API_URL is not defined`
- ✅ Check `.env` file exists in `GoBarberFront/gobarberweb/`
- ✅ Restart development server: Stop and run `npm start` again
- ✅ Ensure backend is running on `http://localhost:3333`

**Error**: Module warnings about react-scripts
- ✅ These are normal and safe to ignore for development
- ✅ The app will still work correctly

### Mobile app won't connect to backend

**Error**: Network request timeout
- ✅ Verify backend is running: `npm run dev:server`
- ✅ Check `API_URL` in `.env` - should be `http://YOUR_IP:3333` for devices
- ✅ Ensure phone/emulator is on same network as backend
- ✅ Check firewall settings allow port 3333

**Error**: ` __DEV__` is not defined
- ✅ This has been fixed in the latest code
- ✅ Run `npm install` again to update
- ✅ Clear Metro cache: `npm start -- --reset-cache`

---

## 🚀 Running Everything Together

### Terminal 1: Backend API
```bash
cd GoBarberAPI
npm install
npm run dev:server
# API running on http://localhost:3333
```

### Terminal 2: Frontend Web
```bash
cd GoBarberFront/gobarberweb
npm install
npm start
# Web running on http://localhost:3000
```

### Terminal 3: Mobile App (optional)
```bash
cd GoBarberApp/GoBarberMobile
npm install
npm start
# In another terminal: npm run android (or npm run ios)
```

---

## 📖 Next Steps

1. ✅ Follow the setup steps above in order
2. ✅ Test each application as instructed
3. ✅ Refer to [MELHORIAS_IMPLEMENTADAS.md](MELHORIAS_IMPLEMENTADAS.md) for code improvements
4. ✅ Check [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) for architecture and patterns
5. ✅ Deploy to production following Security Checklist above

---

## 💡 Tips

- Use a terminal multiplexer like `tmux` or `screen` to run all three services together
- Install VS Code extensions:
  - ES7+ React/Redux/React-Native snippets
  - Thunder Client (for API testing)
  - SQLTools (for database management)
- Keep the browser console open to see frontend errors
- Check backend logs for API errors
- Use Postman or Thunder Client for API testing

---

## 📞 Support

If you encounter issues not covered in the Troubleshooting section:

1. Check the console/terminal error messages carefully
2. Verify all prerequisites are installed
3. Ensure all three applications are properly configured with `.env` files
4. Check that database is running and accessible
5. Restart all services and try again

Good luck! 🎉
