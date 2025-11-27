/*
  # Fix User Registration RLS Policy

  This migration adds a policy to allow user registration (INSERT operations)
  without authentication, which is necessary for the signup process.
*/

-- Allow anyone to create a user account (for registration)
CREATE POLICY "Anyone can create an account"
  ON users FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
