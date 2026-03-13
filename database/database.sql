-- Database: gestion_utilisateurs
create database gestion_utilisateurs;

-- Tables: users, sites, user_sites
CREATE TABLE users (
 id INT IDENTITY(1,1) PRIMARY KEY,
 login VARCHAR(100),
 email VARCHAR(150),
 prenom VARCHAR(100),
 nom VARCHAR(100),
 typeAcces VARCHAR(20),
 dateCreation DATETIME DEFAULT GETDATE()
);

CREATE TABLE sites (
 id INT IDENTITY(1,1) PRIMARY KEY,
 nom VARCHAR(100),
 code VARCHAR(20)
);

CREATE TABLE user_sites (
 userId INT,
 siteId INT,
 FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY (siteId) REFERENCES sites(id) ON DELETE CASCADE
);

-- Insert sample data into sites
INSERT INTO sites (nom, code) VALUES
('Salé','S001'),
('Rabat','S002'),
('Casablanca','S003'),
('Agadir','S004'),
('Tanger','S005'),
('Safi','S006'),
('Oujda','S007'),
('Marrakech','S008'),
('Tétouan','S009'),
('Fès','S010');