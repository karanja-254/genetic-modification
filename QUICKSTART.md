# GOMS Quick Start Guide

## Get Started in 3 Steps

### 1. Start the Server

```bash
npm start
```

The application will be available at **http://localhost:3000**

### 2. Login with Demo Account

**Admin Account:**
- Email: `admin@goms.com`
- Password: `password123`

**Or create a new account** by clicking "Get Started" on the homepage.

### 3. Explore Features

1. **Add Family Health History** - Record hereditary conditions
2. **Generate Risk Report** - Get AI-powered risk analysis
3. **View Pairings** - See genetic compatibility matches
4. **Admin Panel** - Manage users (admin only)

## Common Tasks

### Add a New User
1. Go to http://localhost:3000
2. Click "Get Started"
3. Fill in email and password (name, age, region optional)
4. Click "Create Account"

### Record Family Health History
1. Login to your account
2. Navigate to "Family History"
3. Fill in disease name, relative, and notes
4. Click "Add Record"

### Generate Risk Assessment
1. Add at least one family health record
2. Navigate to "Risk Reports"
3. Click "Generate New Risk Report"
4. View your risk score and analysis

### Generate Pairing Matches
1. Add family health history
2. Navigate to "Pairings"
3. Click "Generate Pairing Recommendations"
4. View compatibility matches

## Troubleshooting

**Can't login?**
- Make sure you've created an account first
- Check that you're using the correct email/password
- Try the demo accounts listed above

**No data showing?**
- Add family health records first
- Generate predictions after adding history
- Pairings require multiple users with health records

**Port already in use?**
- Stop any existing Node.js processes
- Change PORT in .env file
- Or use: `PORT=3001 npm start`

## Tech Stack Reference

- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT + bcrypt
- **Frontend**: EJS + Tailwind CSS

## Support

For detailed information, see the [full README](./README.md)
