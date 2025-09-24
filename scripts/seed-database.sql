-- Create sample books for the library system
-- This script will populate the database with initial book data

-- Note: In a real MongoDB setup, this would be JavaScript/JSON, but showing SQL structure for reference

-- Sample Books Data
INSERT INTO books (title, author, isbn, category, totalCopies, availableCopies, description, publishedYear) VALUES
('Introduction to Computer Science', 'John Smith', '978-0123456789', 'Computer Science', 3, 3, 'A comprehensive introduction to computer science fundamentals', 2023),
('Data Structures and Algorithms', 'Jane Doe', '978-0987654321', 'Computer Science', 2, 2, 'Essential data structures and algorithms for programming', 2022),
('Database Management Systems', 'Robert Johnson', '978-0456789123', 'Computer Science', 4, 4, 'Complete guide to database design and management', 2023),
('Web Development Fundamentals', 'Sarah Wilson', '978-0789123456', 'Web Development', 3, 3, 'Learn HTML, CSS, JavaScript and modern web frameworks', 2024),
('Machine Learning Basics', 'Michael Brown', '978-0321654987', 'Artificial Intelligence', 2, 2, 'Introduction to machine learning concepts and applications', 2023),
('Network Security', 'Emily Davis', '978-0654321789', 'Cybersecurity', 3, 3, 'Comprehensive guide to network security principles', 2022),
('Software Engineering', 'David Miller', '978-0147258369', 'Software Engineering', 4, 4, 'Best practices in software development and project management', 2023),
('Mobile App Development', 'Lisa Anderson', '978-0963852741', 'Mobile Development', 2, 2, 'Build native and cross-platform mobile applications', 2024);

-- Sample Users Data
INSERT INTO users (name, matricNo, password, role, faceId) VALUES
('Library Administrator', 'admin', 'admin123', 'admin', NULL),
('John Doe', '20/1234/CS', 'student123', 'student', NULL),
('Jane Smith', '20/5678/CS', 'password123', 'student', NULL),
('Mike Johnson', '20/9012/CS', 'password123', 'student', NULL);
