CREATE DATABASE STAFF_MANAGEMENT;
USE STAFF_MANAGEMENT;
CREATE TABLE staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    staffId VARCHAR(50) NOT NULL UNIQUE,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    mobile VARCHAR(15),
    dob DATE,
    joiningDate DATE,
    designation VARCHAR(100),
    qualification VARCHAR(255),
    specialization VARCHAR(100),
    address TEXT,
    photo VARCHAR(255),
    password VARCHAR(255)
);
ALTER TABLE staff
ADD COLUMN street VARCHAR(255),
ADD COLUMN city VARCHAR(100),
ADD COLUMN district VARCHAR(100),
ADD COLUMN state VARCHAR(50) DEFAULT 'Tamil Nadu',
ADD COLUMN pinCode VARCHAR(6);

ALTER TABLE staff ADD COLUMN otp VARCHAR(10) NULL;
ALTER TABLE staff
ADD COLUMN password VARCHAR(255);
ALTER TABLE staff
ADD COLUMN username VARCHAR(50);
UPDATE staff 
SET username = staffId;

DESC staff;
SELECT * FROM staff;
CREATE TABLE history_table (
  history_id INT AUTO_INCREMENT PRIMARY KEY,
  staffId VARCHAR(50),
  old_email VARCHAR(100),
  old_firstName VARCHAR(100),
  old_lastName VARCHAR(100),
  old_mobile VARCHAR(15),
  old_dob DATE,
  old_joiningDate DATE,
  old_designation VARCHAR(100),
  old_qualification VARCHAR(100),
  old_specialization VARCHAR(100),
  old_address TEXT,
  old_photo VARCHAR(255),

  old_academicDetails TEXT,
  old_experience TEXT,
  old_publications TEXT,
  old_honours TEXT,
  old_membership TEXT,
  old_awards TEXT,

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE history_table
ADD COLUMN old_street VARCHAR(255),
ADD COLUMN old_city VARCHAR(100),
ADD COLUMN old_district VARCHAR(100),
ADD COLUMN old_state VARCHAR(50),
ADD COLUMN old_pinCode VARCHAR(15);

DESC history_table;

ALTER TABLE staff ADD COLUMN isDeleted BOOLEAN DEFAULT 0;

SELECT staffId, firstName, isDeleted FROM staff;

CREATE TABLE admin (
		username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
        );
SELECT * FROM admin;
ALTER TABLE admin ADD COLUMN otp VARCHAR(10) NULL;
	
ALTER TABLE admin
ADD COLUMN email VARCHAR(100) UNIQUE;
SELECT * FROM history_table;

DELETE FROM staff;
UPDATE staff
SET password = 'staff14'
WHERE staffId = 14;

UPDATE staff
SET username = 'sugiit'
WHERE staffId = 14;

SELECT * FROM staff;
ALTER TABLE staff
ADD COLUMN id INT NOT NULL AUTO_INCREMENT PRIMARY KEY;


DESC staff;


CREATE TABLE designation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staffId VARCHAR(50) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    resolution_no VARCHAR(50),
    order_no VARCHAR(50),
    order_copy VARCHAR(255),
    remarks TEXT,
    flag TINYINT DEFAULT 0 COMMENT '0=Pending,1=Approved,2=Rejected',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_designation_staff
        FOREIGN KEY (staffId) REFERENCES staff(staffId)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
SELECT * FROM designation;

CREATE TABLE qualifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staffId INT NOT NULL,
  degree VARCHAR(100),
  major VARCHAR(100),
  completedYear INT,
  college VARCHAR(150),
  university VARCHAR(150),
  degreeCopy VARCHAR(255),
  status TINYINT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


SELECT * FROM qualifications;

CREATE TABLE additional_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staffId INT NOT NULL,
  post VARCHAR(100),
  fromDate DATE,
  toDate DATE,
  resolutionNo VARCHAR(100),
  orderNo VARCHAR(100),
  orderCopy VARCHAR(255),
  remarks TEXT,
  status TINYINT DEFAULT 0,   -- 0-awaiting, 1-approved, 2-disapproved
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



SELECT * FROM membership;

CREATE TABLE membership (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staffId VARCHAR(50) NOT NULL,
  membershipType VARCHAR(100) NOT NULL,
  institution VARCHAR(200) NOT NULL,
  membershipId VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE awards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staffId INT NOT NULL,
  award_name VARCHAR(255) NOT NULL,
  awarding_agent VARCHAR(255) NOT NULL,
  award_year INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE publications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staffId INT NOT NULL,
  scope ENUM('National', 'International') NOT NULL,
  published_month VARCHAR(20) NOT NULL,
  published_year INT NOT NULL,
  authors TEXT NOT NULL,
  paper_title VARCHAR(255) NOT NULL,
  journal_name VARCHAR(255) NOT NULL,
  volume_number VARCHAR(50),
  issue_number VARCHAR(50),
  publication_year_or_doi VARCHAR(100),
  page_from INT,
  page_to INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM qualifications;	
DELETE FROM publications;
select * FROM additional_posts;
ALTER TABLE designation 
MODIFY to_date DATE NULL;

CREATE TABLE additional_experience (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staffId INT NOT NULL,
  experience_type ENUM('Industry','Academic') NOT NULL,
  industry_worked VARCHAR(255),
  from_date DATE NOT NULL,
  to_date DATE,
  certificate VARCHAR(255),
  remarks TEXT,
  flag TINYINT DEFAULT 0, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
select * FROM additional_experience;
UPDATE additional_experience
SET flag = 0
WHERE flag IS NULL;

ALTER TABLE additional_experience
MODIFY COLUMN flag TINYINT NOT NULL DEFAULT 0 COMMENT '0=Pending,1=Approved,2=Rejected';
