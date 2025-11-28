-- Database: campus_pass_db

CREATE DATABASE IF NOT EXISTS campus_pass_db;
USE campus_pass_db;

-- 1. Students Table
CREATE TABLE students (
    usn VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL, -- In production, store hashed passwords
    dept VARCHAR(50),
    semester INT,
    phone VARCHAR(15)
);

-- 2. Wardens Table
CREATE TABLE wardens (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(100)
);

-- 3. Security Guards Table
CREATE TABLE security (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(100)
);

-- 4. Outpass Requests Table
CREATE TABLE outpass_requests (
    pass_id VARCHAR(20) PRIMARY KEY,
    usn VARCHAR(20),
    reason TEXT,
    date DATE,
    time_out TIME,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'USED') DEFAULT 'PENDING',
    rejection_reason TEXT,
    qr_code LONGTEXT, -- Base64 string of the QR code image (optional, or generate on fly)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usn) REFERENCES students(usn)
);

-- Insert Mock Data
INSERT INTO students (usn, name, password, dept, semester, phone) VALUES 
('4CE23CS045', 'Rahul Sharma', 'password123', 'CSE', 5, '9876543210'),
('4CE23CS099', 'Amit Verma', 'password123', 'ISE', 5, '9876543211');

INSERT INTO wardens (username, password, name) VALUES 
('warden_admin', 'admin123', 'Dr. Patil');

INSERT INTO security (username, password, name) VALUES 
('SEC001', 'secure123', 'Main Gate Guard');
