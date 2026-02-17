CREATE DATABASE IF NOT EXISTS law_virtualization;
USE law_virtualization;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS laws (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content LONGTEXT,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    law_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (law_id) REFERENCES laws(id) ON DELETE CASCADE,
    UNIQUE(user_id, law_id)
);

-- Internal notes: 
-- Initial categories seeding could depend on specific law domains mentioned in prompt "All Possible Law Domains"
-- e.g. Criminal, Civil, Corporate, Family, Constitutional
INSERT INTO categories (name, description) VALUES 
('Constitutional Law', 'Laws relating to the formulation and interpretation of the constitution'),
('Criminal Law', 'Laws concerned with punishment of individuals who commit crimes'),
('Civil Law', 'Laws concerned with private relations between members of a community'),
('Corporate Law', 'Laws governing the formation and conduct of corporations'),
('Family Law', 'Laws dealing with family matters and domestic relations')
ON DUPLICATE KEY UPDATE description=description;
