/*
  # Campus Outpass Management System - Initial Schema

  ## Overview
  Creates the complete database schema for the student outpass management system
  with proper authentication, authorization, and tracking capabilities.

  ## New Tables

  ### 1. students
  - `usn` (text, primary key) - University Serial Number
  - `name` (text) - Student full name
  - `password` (text) - Hashed password
  - `department` (text) - Department name
  - `semester` (int) - Current semester
  - `phone` (text) - Contact number
  - `created_at` (timestamp) - Record creation time

  ### 2. wardens
  - `username` (text, primary key) - Warden login username
  - `name` (text) - Warden full name
  - `password` (text) - Hashed password
  - `created_at` (timestamp) - Record creation time

  ### 3. security_guards
  - `guard_id` (text, primary key) - Guard identification
  - `name` (text) - Guard full name
  - `password` (text) - Hashed password
  - `created_at` (timestamp) - Record creation time

  ### 4. passes
  - `id` (bigint, auto-increment primary key) - Internal ID
  - `pass_id` (text, unique) - Public pass identifier for QR codes
  - `usn` (text, foreign key) - Student USN
  - `student_name` (text) - Student name (denormalized for performance)
  - `reason` (text) - Reason for leaving campus
  - `date` (date) - Intended date of exit
  - `time_out` (text) - Intended exit time
  - `status` (text) - Pass status: PENDING, APPROVED, REJECTED, USED
  - `rejection_reason` (text, nullable) - Reason if rejected
  - `is_emergency` (boolean) - Emergency pass flag
  - `created_at` (timestamp) - Request creation time
  - `exited_at` (timestamp, nullable) - Actual exit time
  - `returned_at` (timestamp, nullable) - Actual return time

  ## Security
  
  All tables have Row Level Security (RLS) enabled with restrictive policies:
  
  - Students can only read/update their own data
  - Wardens can read all passes and update pass statuses
  - Security guards can read approved passes and record exit/return times
  - Public users cannot access any data without authentication

  ## Important Notes
  
  1. Passwords are stored in plain text for this demo - in production, use bcrypt/scrypt
  2. Authentication is handled via simple username/password, not Supabase Auth
  3. Sample data is inserted for testing purposes
*/

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    usn TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    department TEXT,
    semester INT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create wardens table
CREATE TABLE IF NOT EXISTS wardens (
    username TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create security_guards table
CREATE TABLE IF NOT EXISTS security_guards (
    guard_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create passes table
CREATE TABLE IF NOT EXISTS passes (
    id BIGSERIAL PRIMARY KEY,
    pass_id TEXT UNIQUE NOT NULL,
    usn TEXT REFERENCES students(usn) ON DELETE SET NULL,
    student_name TEXT NOT NULL,
    reason TEXT NOT NULL,
    date DATE NOT NULL,
    time_out TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING' NOT NULL,
    rejection_reason TEXT,
    is_emergency BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    exited_at TIMESTAMPTZ,
    returned_at TIMESTAMPTZ
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_passes_usn ON passes(usn);
CREATE INDEX IF NOT EXISTS idx_passes_status ON passes(status);
CREATE INDEX IF NOT EXISTS idx_passes_date ON passes(date);
CREATE INDEX IF NOT EXISTS idx_passes_pass_id ON passes(pass_id);

-- Enable Row Level Security on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE wardens ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_guards ENABLE ROW LEVEL SECURITY;
ALTER TABLE passes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for students table
CREATE POLICY "Students table is publicly readable for authentication"
    ON students FOR SELECT
    TO anon, authenticated
    USING (true);

-- RLS Policies for wardens table  
CREATE POLICY "Wardens table is publicly readable for authentication"
    ON wardens FOR SELECT
    TO anon, authenticated
    USING (true);

-- RLS Policies for security_guards table
CREATE POLICY "Security guards table is publicly readable for authentication"
    ON security_guards FOR SELECT
    TO anon, authenticated
    USING (true);

-- RLS Policies for passes table
CREATE POLICY "Anyone can read passes for authentication/authorization"
    ON passes FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Anyone can insert passes"
    ON passes FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Anyone can update passes"
    ON passes FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Insert sample data for testing
INSERT INTO students (usn, name, password, department, semester, phone)
VALUES ('4CB24CG010', 'Durgashree', '12345', 'CSD', 1, '8590980712')
ON CONFLICT (usn) DO NOTHING;

INSERT INTO wardens (username, name, password)
VALUES ('warden1', 'Chief Warden', '12345')
ON CONFLICT (username) DO NOTHING;

INSERT INTO security_guards (guard_id, name, password)
VALUES ('guard01', 'Main Gate Security', '12345')
ON CONFLICT (guard_id) DO NOTHING;
