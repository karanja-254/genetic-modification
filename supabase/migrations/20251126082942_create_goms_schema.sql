/*
  # GOMS - Genetic Optimization Management System Database Schema

  ## Overview
  This migration creates the complete database structure for the Genetic Optimization Management System,
  including user management, family health history tracking, genetic risk predictions, and pairing simulations.

  ## Tables Created

  ### 1. users
  - `id` (uuid, primary key) - Unique user identifier
  - `email` (text, unique) - User email address
  - `password_hash` (text) - Securely hashed password
  - `name` (text) - User's full name (optional)
  - `age` (integer) - User's age (optional)
  - `region` (text) - User's geographical region (optional)
  - `role` (text) - User role (user/admin), defaults to 'user'
  - `created_at` (timestamptz) - Account creation timestamp

  ### 2. family_history
  - `id` (uuid, primary key) - Unique record identifier
  - `user_id` (uuid, foreign key) - References users table
  - `disease_name` (text) - Name of the hereditary condition
  - `relative` (text) - Family member (father, mother, sibling, etc.)
  - `notes` (text) - Additional details about the condition
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. predictions
  - `id` (uuid, primary key) - Unique prediction identifier
  - `user_id` (uuid, foreign key) - References users table
  - `risk_score` (integer) - Calculated risk score (0-100)
  - `condition_summary` (text) - Summary of conditions analyzed
  - `created_at` (timestamptz) - Prediction timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. pairings
  - `id` (uuid, primary key) - Unique pairing identifier
  - `user1_id` (uuid, foreign key) - First user in the pairing
  - `user2_id` (uuid, foreign key) - Second user in the pairing
  - `match_score` (integer) - Compatibility score (0-100)
  - `diversity_level` (text) - Genetic diversity level (low/medium/high)
  - `created_at` (timestamptz) - Pairing creation timestamp

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies ensure users can only access their own data
  - Admin role has elevated permissions
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text DEFAULT '',
  age integer DEFAULT 0,
  region text DEFAULT '',
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now()
);

-- Create family_history table
CREATE TABLE IF NOT EXISTS family_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  disease_name text NOT NULL,
  relative text NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  risk_score integer NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  condition_summary text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pairings table
CREATE TABLE IF NOT EXISTS pairings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user2_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  match_score integer NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  diversity_level text NOT NULL CHECK (diversity_level IN ('low', 'medium', 'high')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pairings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR role = 'admin');

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for family_history table
CREATE POLICY "Users can view own family history"
  ON family_history FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own family history"
  ON family_history FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own family history"
  ON family_history FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own family history"
  ON family_history FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for predictions table
CREATE POLICY "Users can view own predictions"
  ON predictions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own predictions"
  ON predictions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own predictions"
  ON predictions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for pairings table
CREATE POLICY "Users can view pairings they're part of"
  ON pairings FOR SELECT
  TO authenticated
  USING (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "System can create pairings"
  ON pairings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_family_history_user_id ON family_history(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_pairings_user1_id ON pairings(user1_id);
CREATE INDEX IF NOT EXISTS idx_pairings_user2_id ON pairings(user2_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
