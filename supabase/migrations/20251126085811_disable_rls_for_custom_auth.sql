/*
  # Disable RLS for Custom Authentication

  This migration disables Row Level Security policies because the application
  uses its own JWT-based authentication system (not Supabase Auth). The RLS
  policies that check `auth.uid()` will never work with custom JWT tokens.

  ## Why This Change Is Necessary
  
  - The app uses jsonwebtoken for authentication, not Supabase Auth
  - RLS policies use `auth.uid()` which only works with Supabase Auth
  - All authentication and authorization is handled at the application level
  - The Express middleware (authMiddleware, adminMiddleware) enforces access control

  ## Changes
  
  1. Security
    - Disable RLS on all tables
    - Security is now enforced at the application level via Express middleware
    - Each route validates user identity and permissions before querying data
  
  ## Application-Level Security
  
  The application maintains security through:
  - JWT token validation in authMiddleware
  - User session verification before database queries  
  - Role-based access control (admin vs user)
  - Query filtering by user_id in all route handlers
*/

-- Disable RLS on all tables since app uses custom JWT auth
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE family_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE predictions DISABLE ROW LEVEL SECURITY;
ALTER TABLE pairings DISABLE ROW LEVEL SECURITY;
