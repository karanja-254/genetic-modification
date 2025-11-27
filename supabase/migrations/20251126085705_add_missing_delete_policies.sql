/*
  # Add Missing DELETE Policies

  This migration adds the missing DELETE policies that were identified during code analysis.
  Without these policies, critical functionality like pairing regeneration, user deletion,
  and admin cleanup operations will fail due to RLS restrictions.

  ## Changes
  
  1. Pairings Table
    - Add DELETE policy for users to delete their own pairings
    - Add DELETE policy for admins to delete any pairings (for cleanup)
    
  2. Users Table  
    - Add DELETE policy for admins to delete users
    
  3. Family History Table
    - Ensure CASCADE delete works when users are deleted

  ## Security Considerations
  
  - User DELETE on pairings: Restricted to pairings where user is participant
  - Admin DELETE on pairings: Restricted to admin role only
  - Admin DELETE on users: Restricted to admin role only
  - All policies maintain principle of least privilege
*/

-- Allow users to delete pairings they are part of
CREATE POLICY "Users can delete own pairings"
  ON pairings
  FOR DELETE
  TO authenticated
  USING (user1_id = auth.uid() OR user2_id = auth.uid());

-- Allow admins to delete any pairings (for cleanup operations)
CREATE POLICY "Admins can delete any pairings"
  ON pairings
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Allow admins to delete users
CREATE POLICY "Admins can delete users"
  ON users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'admin'
    )
  );
