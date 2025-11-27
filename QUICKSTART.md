# GOMS Quick Start Guide

## IMPORTANT: Login Credentials

After importing the database, use these accounts to login:

### Admin Account
- **Email:** admin@goms.com
- **Password:** password123
- **Access:** Full admin panel, manage all users

### Demo User Accounts
All users have password: **password123**
- john@example.com (John Doe - USA)
- jane@example.com (Jane Smith - UK)
- bob@example.com (Bob Johnson - Canada)
- alice@example.com (Alice Williams - Australia)

## Get Started in 3 Steps

### 1. Setup Database (XAMPP)

```
1. Start MySQL in XAMPP Control Panel
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Click "SQL" tab
4. Copy/paste contents of goms_mysql_schema.sql
5. Click "Go" - this creates database AND demo users
```

### 2. Start the Server

```bash
npm install
npm start
```

The application will be available at **http://localhost:3000**

### 3. Login

Use any of the demo accounts listed above, or create a new account.

## Explore Features

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
- **Database**: MySQL (XAMPP)
- **Auth**: JWT + bcrypt
- **Frontend**: EJS + Tailwind CSS

## Alternative: Run Seed Script

If you already have the database but need to add demo users:

```bash
node seed.js
```

This will add all the demo accounts listed above.

## Support

For detailed information, see the [full README](./README.md)
