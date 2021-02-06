CREATE DATABASE emp_trackerDB;

USE emp_trackerDB;

CREATE TABLE employees (
    e_id INTEGER(10) AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER(10),
    manager_id INTEGER(10),
    PRIMARY KEY (e_id)
);

CREATE TABLE role(
    r_id INTEGER(10) AUTO_INCREMENT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INTEGER(10),
    PRIMARY KEY (r_id)
);

CREATE TABLE department(
    d_id INTEGER(10) AUTO_INCREMENT NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY (d_id)
);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("James", "Holden", 1), ("Naomi", "Nagata", 2), ("Alex", "Kamal", 3), ("Amos", "Burton", 4);

INSERT INTO role (title, salary)
VALUES ("Captain", 300000.00), ("Engineer", 200000.00), ("Pilot", 200000.00), ("Mechanic", 180000.00); 
select * from role;

INSERT INTO department (name)
VALUES ("Rocinante"), ("Tycho Station"), ("Martian Navy");


UPDATE role 
SET  department_id = 1
WHERE r_id = 4;

DELETE FROM role
WHERE r_id = 7;