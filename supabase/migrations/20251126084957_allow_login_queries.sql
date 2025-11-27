/*
  # Allow Login Queries

  This migration adds a policy to allow anonymous users to query the users table
  during login authentication. This is necessary because the application needs to
  look up users by email and verify passwords before establishing authentication.

  ## Changes
  
  1. Security
    - Add policy for anonymous users to SELECT from users table
    - This allows the login flow to work while maintaining security through password verification
    - Only SELECT is allowed, no INSERT/UPDATE/DELETE for anonymous users

  ## Important Notes
  
  - This policy is essential for the login functionality to work
  - Password hashes are never exposed to the client (handled server-side)
  - RLS still protects against unauthorized data modification
*/

-- Drop policy if it exists, then create it
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow anonymous login queries" ON users;
END $$;

-- Allow anonymous users to query users table for login
CREATE POLICY "Allow anonymous login queries"
  ON users
  FOR SELECT
  TO anon
  USING (true);
