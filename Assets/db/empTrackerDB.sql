CREATE DATABASE emp_trackerDB;

USE emp_trackerDB;

CREATE TABLE employees (
    id INTEGER(10) AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER(10),
    manager_id INTEGER(10),
    PRIMARY KEY (id)
);

CREATE TABLE role(
    id INTEGER(10) AUTO_INCREMENT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INTEGER(10),
    PRIMARY KEY (id)
);

CREATE TABLE department(
    id INTEGER(10) AUTO_INCREMENT NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

UPDATE role 
SET  department_id = 1
WHERE id = 4;

INSERT INTO role (title, salary)
VALUES ("Captain", 300000.00), ("Engineer", 200000.00), ("Pilot", 200000.00), ("Mechanic", 180000.00); 
select * from role;

INSERT INTO department (name)
VALUES ("Rocinante"), ("Tycho Station"), ("Martian Navy");