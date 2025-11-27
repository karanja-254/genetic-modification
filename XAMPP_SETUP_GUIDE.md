# GOMS - XAMPP Setup Guide

This guide will help you set up the GOMS (Genetic Optimization Management System) project on XAMPP for your school project.

## Prerequisites

- XAMPP installed on your computer
- Node.js installed (for running the application)

## Step 1: Install XAMPP

1. Download XAMPP from https://www.apachefriends.org/
2. Install XAMPP following the installation wizard
3. Start the XAMPP Control Panel

## Step 2: Start MySQL

1. Open XAMPP Control Panel
2. Click "Start" next to Apache (optional, for phpMyAdmin)
3. Click "Start" next to MySQL
4. Once MySQL is running, click "Admin" next to MySQL to open phpMyAdmin

## Step 3: Create the Database

### Option A: Using phpMyAdmin (Recommended)

1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Click on "SQL" tab at the top
3. Open the file `goms_mysql_schema.sql` (included in this project)
4. Copy the entire contents
5. Paste it into the SQL query box
6. Click "Go" to execute
7. You should see a success message and a new database called "goms"

### Option B: Using MySQL Command Line

1. Open Command Prompt/Terminal
2. Navigate to XAMPP's MySQL bin directory:
   ```
   cd C:\xampp\mysql\bin
   ```
3. Run MySQL:
   ```
   mysql -u root -p
   ```
4. When prompted for password, just press Enter (default is no password)
5. Import the schema:
   ```
   source C:\path\to\your\project\goms_mysql_schema.sql
   ```

## Step 4: Configure the Application

The `.env` file has already been configured with default XAMPP settings:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=goms
JWT_SECRET=goms-secret-key-change-in-production
```

If your XAMPP MySQL has a different configuration:
- Open `.env` file
- Modify DB_USER, DB_PASSWORD, or DB_HOST as needed

## Step 5: Install Node.js Dependencies

1. Open Command Prompt/Terminal
2. Navigate to the project directory
3. Run:
   ```
   npm install
   ```

## Step 6: Run the Application

1. In the project directory, run:
   ```
   npm start
   ```
2. Open your browser and go to: http://localhost:3000
3. You should see the GOMS homepage

## Step 7: Create an Admin Account (Optional)

1. Register a new account through the web interface
2. Open phpMyAdmin
3. Go to the "goms" database
4. Click on the "users" table
5. Find your user and click "Edit"
6. Change the "role" field from "user" to "admin"
7. Click "Go" to save
8. Log out and log back in to access admin features

## Troubleshooting

### MySQL Connection Error

If you see "ECONNREFUSED" error:
- Make sure MySQL is running in XAMPP Control Panel
- Check that the database "goms" exists in phpMyAdmin
- Verify .env settings match your XAMPP configuration

### Port Already in Use

If port 3000 is already in use:
- Open `index.js`
- Change the port number:
  ```javascript
  const PORT = 3001; // or any other available port
  ```

### Cannot Find Module Errors

Run:
```
npm install
```

## Database Schema

The database includes 4 main tables:

1. **users** - User accounts (email, password, profile)
2. **family_history** - Family medical history records
3. **predictions** - Genetic risk predictions
4. **pairings** - Genetic pairing simulations

## Project Structure

```
goms/
├── config/
│   └── database.js          # MySQL connection
├── middleware/
│   └── auth.js              # Authentication
├── routes/
│   ├── auth.js              # Login/Register
│   ├── dashboard.js         # Dashboard
│   ├── history.js           # Family history
│   ├── predictions.js       # Risk predictions
│   ├── pairings.js          # Pairing simulations
│   └── admin.js             # Admin panel
├── views/                    # EJS templates
├── utils/                    # Utility functions
├── .env                      # Configuration
├── goms_mysql_schema.sql     # Database schema
└── index.js                  # Main application
```

## Features

- User registration and authentication
- Family medical history tracking
- Genetic risk prediction calculation
- Genetic pairing simulation
- Admin dashboard for user management

## Support

For issues or questions, check:
1. XAMPP MySQL is running
2. Database "goms" exists and has tables
3. .env file has correct database credentials
4. All npm packages are installed

## Exporting the Database

To export your database for submission:

1. Open phpMyAdmin
2. Click on "goms" database
3. Click "Export" tab
4. Select "Quick" export method
5. Select "SQL" format
6. Click "Go"
7. Save the exported file

This will create a backup of your database with all data.
