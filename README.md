# GOMS - Genetic Optimization Management System

A comprehensive web application for tracking family health history, analyzing genetic risk factors, and discovering compatible genetic pairings.

## Features

### Core Modules

1. **User Management**
   - Secure registration and login
   - User profiles with optional demographic data (name, age, region)
   - Role-based access control (User, Admin)
   - Password hashing with bcrypt

2. **Family Health History**
   - Record hereditary conditions for family members
   - Track disease name, affected relative, and detailed notes
   - Full CRUD operations for health records
   - Organized by user with secure access

3. **Genetic Risk Prediction**
   - AI-powered risk score calculation (0-100)
   - Weighted algorithm based on disease severity and relative proximity
   - Risk level classification (Low, Medium, High)
   - Detailed condition summaries
   - Historical tracking of predictions

4. **Genetic Pairing Simulation**
   - Compatibility matching based on genetic diversity
   - Match scores (0-100) indicating optimal pairing
   - Diversity levels (low, medium, high)
   - Automatic pairing generation
   - Top 5 matches displayed

5. **Dashboard & Reports**
   - Overview of health records, risk scores, and pairings
   - Visual charts and statistics
   - Quick access to all features
   - Recent activity tracking

6. **Admin Panel**
   - User management
   - System statistics
   - Data cleanup tools
   - Full system oversight

## Technology Stack

- **Backend**: Node.js with Express
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT with httpOnly cookies
- **Frontend**: EJS templates with Tailwind CSS
- **Security**: Row Level Security (RLS), bcrypt password hashing

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   The `.env` file is already configured with Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://gmrhsilynbvbkfmcbboi.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbG...
   ```

3. **Database Setup**
   The database schema has been automatically created with migrations.

4. **Seed Demo Data** (Optional)
   ```bash
   node seed.js
   ```

## Running the Application

Start the server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Demo Accounts

After seeding, you can use these accounts:

**Admin Account:**
- Email: `admin@goms.com`
- Password: `password123`

**User Accounts:**
- Email: `john@example.com` / Password: `password123`
- Email: `jane@example.com` / Password: `password123`
- Email: `bob@example.com` / Password: `password123`

## Database Schema

### Users Table
- `id` (uuid) - Primary key
- `email` (text) - Unique email address
- `password_hash` (text) - Hashed password
- `name` (text) - Full name
- `age` (integer) - User age
- `region` (text) - Geographic region
- `role` (text) - User role (user/admin)
- `created_at` (timestamptz) - Account creation date

### Family History Table
- `id` (uuid) - Primary key
- `user_id` (uuid) - Foreign key to users
- `disease_name` (text) - Name of condition
- `relative` (text) - Affected family member
- `notes` (text) - Additional details
- `created_at` (timestamptz) - Record creation date

### Predictions Table
- `id` (uuid) - Primary key
- `user_id` (uuid) - Foreign key to users
- `risk_score` (integer) - Calculated risk (0-100)
- `condition_summary` (text) - Analysis summary
- `created_at` (timestamptz) - Prediction date
- `updated_at` (timestamptz) - Last update

### Pairings Table
- `id` (uuid) - Primary key
- `user1_id` (uuid) - First user
- `user2_id` (uuid) - Second user
- `match_score` (integer) - Compatibility (0-100)
- `diversity_level` (text) - Genetic diversity (low/medium/high)
- `created_at` (timestamptz) - Pairing creation date

## Security Features

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- JWT tokens stored in httpOnly cookies
- Password hashing with bcrypt (10 rounds)
- Admin-only routes protected with middleware
- SQL injection prevention via parameterized queries

## Risk Calculation Algorithm

The risk score is calculated using:
- **Disease Weights**: Different conditions have different hereditary risk levels
- **Relative Weights**: Closer relatives (parents) have higher weights than distant relatives (cousins)
- **Multiple Occurrences**: Multiple family members with the same condition increase risk

## Pairing Algorithm

Match scores are based on:
- **Genetic Diversity**: Higher scores for pairs with different family health patterns
- **Disease Overlap**: Lower scores when both partners share similar hereditary conditions
- **Randomization**: Slight random variation to simulate real-world complexity

## Project Structure

```
.
├── config/
│   └── supabase.js          # Supabase client configuration
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── dashboard.js         # Dashboard routes
│   ├── history.js           # Family history routes
│   ├── predictions.js       # Risk prediction routes
│   ├── pairings.js          # Pairing simulation routes
│   └── admin.js             # Admin panel routes
├── utils/
│   ├── riskCalculator.js    # Risk score calculation
│   └── pairingSimulator.js  # Pairing algorithm
├── views/
│   ├── layout.ejs           # Main layout template
│   ├── index.ejs            # Landing page
│   ├── register.ejs         # Registration page
│   ├── login.ejs            # Login page
│   ├── dashboard.ejs        # User dashboard
│   ├── history.ejs          # Family history page
│   ├── predictions.ejs      # Risk reports page
│   ├── pairings.ejs         # Pairings page
│   └── admin.ejs            # Admin panel
├── server.js                # Main application server
├── seed.js                  # Database seeding script
└── package.json             # Dependencies and scripts
```

## Usage Guide

### For Users

1. **Register/Login**: Create an account or sign in
2. **Add Family History**: Record hereditary conditions for family members
3. **Generate Risk Report**: Click to calculate your genetic risk score
4. **View Pairings**: Generate compatibility matches with other users
5. **Dashboard**: Monitor all your data in one place

### For Admins

1. **Access Admin Panel**: Navigate to `/admin`
2. **View Users**: See all registered users
3. **Manage Data**: Delete users or cleanup system data
4. **Monitor Statistics**: View system-wide metrics

## API Endpoints

- `GET /` - Landing page
- `GET /register` - Registration page
- `POST /register` - Create new account
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `GET /logout` - Sign out
- `GET /dashboard` - User dashboard (protected)
- `GET /history` - Family history page (protected)
- `POST /history/add` - Add health record (protected)
- `POST /history/delete/:id` - Delete record (protected)
- `GET /predictions` - Risk reports (protected)
- `POST /predictions/generate` - Generate risk score (protected)
- `GET /pairings` - Pairing matches (protected)
- `POST /pairings/generate` - Generate pairings (protected)
- `GET /admin` - Admin panel (admin only)
- `POST /admin/delete-user/:id` - Delete user (admin only)
- `POST /admin/cleanup-data` - Cleanup data (admin only)

## Important Notes

- This is a prototype system for educational purposes
- Risk scores should not replace professional medical advice
- Pairing simulations are for demonstration only
- Always consult healthcare professionals for genetic counseling
- Data privacy and security are top priorities

## License

This project is for educational and demonstration purposes.

---

Built with Node.js, Express, Supabase, and Tailwind CSS
