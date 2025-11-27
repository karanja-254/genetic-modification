-- ============================================================================
-- GOMS - Genetic Optimization Management System
-- MySQL Database Schema
-- ============================================================================
--
-- This schema is designed for use with XAMPP/phpMyAdmin
--
-- INSTALLATION INSTRUCTIONS:
-- 1. Open phpMyAdmin in XAMPP
-- 2. Create a new database called "goms"
-- 3. Click on the "goms" database
-- 4. Go to the SQL tab
-- 5. Copy and paste this entire file
-- 6. Click "Go" to execute
-- ============================================================================

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS goms
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE goms;

-- ============================================================================
-- Table: users
-- Description: Stores user account information
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) DEFAULT '',
  age INT DEFAULT 0,
  region VARCHAR(255) DEFAULT '',
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: family_history
-- Description: Stores family medical history for genetic risk analysis
-- ============================================================================
CREATE TABLE IF NOT EXISTS family_history (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  disease_name VARCHAR(255) NOT NULL,
  relative VARCHAR(100) NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_family_history_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: predictions
-- Description: Stores genetic risk predictions for users
-- ============================================================================
CREATE TABLE IF NOT EXISTS predictions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  risk_score INT NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  condition_summary TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_predictions_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: pairings
-- Description: Stores genetic pairing simulations between users
-- ============================================================================
CREATE TABLE IF NOT EXISTS pairings (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user1_id CHAR(36) NOT NULL,
  user2_id CHAR(36) NOT NULL,
  match_score INT NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  diversity_level ENUM('low', 'medium', 'high') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_pairings_user1_id (user1_id),
  INDEX idx_pairings_user2_id (user2_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Sample Data
-- Default login accounts (password for all: password123)
-- ============================================================================

-- Admin user (email: admin@goms.com, password: password123)
INSERT INTO users (email, password_hash, name, age, region, role) VALUES
('admin@goms.com', '$2a$10$rQ6LzJXLbzJ7YZFVQCJRzO5qKxK5VfkKqmZz5fOWmJXLQKJZXJQXC', 'Admin User', 35, 'USA', 'admin');

-- Regular users (password: password123 for all)
INSERT INTO users (email, password_hash, name, age, region, role) VALUES
('john@example.com', '$2a$10$rQ6LzJXLbzJ7YZFVQCJRzO5qKxK5VfkKqmZz5fOWmJXLQKJZXJQXC', 'John Doe', 28, 'USA', 'user'),
('jane@example.com', '$2a$10$rQ6LzJXLbzJ7YZFVQCJRzO5qKxK5VfkKqmZz5fOWmJXLQKJZXJQXC', 'Jane Smith', 32, 'UK', 'user'),
('bob@example.com', '$2a$10$rQ6LzJXLbzJ7YZFVQCJRzO5qKxK5VfkKqmZz5fOWmJXLQKJZXJQXC', 'Bob Johnson', 45, 'Canada', 'user'),
('alice@example.com', '$2a$10$rQ6LzJXLbzJ7YZFVQCJRzO5qKxK5VfkKqmZz5fOWmJXLQKJZXJQXC', 'Alice Williams', 29, 'Australia', 'user');

-- ============================================================================
-- Login Credentials
-- ============================================================================
-- Admin Account:
--   Email: admin@goms.com
--   Password: password123
--
-- User Accounts (all use password: password123):
--   john@example.com
--   jane@example.com
--   bob@example.com
--   alice@example.com
-- ============================================================================

-- ============================================================================
-- End of Schema
-- ============================================================================
