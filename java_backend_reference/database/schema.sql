CREATE DATABASE IF NOT EXISTS campuspass;
USE campuspass;

CREATE TABLE students (
    usn VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(50),
    semester INT,
    phone VARCHAR(20)
);

CREATE TABLE wardens (
    username VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE security_guards (
    guard_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE passes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pass_id VARCHAR(30) UNIQUE,
    usn VARCHAR(20),
    student_name VARCHAR(100),
    reason VARCHAR(500),
    date DATE,
    time_out VARCHAR(20),
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING / APPROVED / REJECTED / USED
    rejection_reason VARCHAR(500),
    is_emergency BOOLEAN DEFAULT FALSE,
    qr_base64 LONGTEXT,
    used_flag BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exited_at TIMESTAMP NULL,
    returned_at TIMESTAMP NULL,
    FOREIGN KEY (usn) REFERENCES students(usn) ON DELETE SET NULL
);

INSERT INTO students (usn, name, password, department, semester, phone)
VALUES ('4CB24CG010', 'Durgashree', '12345', 'CSD', 1, '8590980712');

INSERT INTO wardens VALUES ('warden1', 'Chief Warden', '12345');

INSERT INTO security_guards VALUES ('guard01', 'Main Gate Security', '12345');
