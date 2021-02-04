CREATE emp_trackerDB;

USE emp_trackerDB;

CREATE employee (
    id INTEGER(10) AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER(10), --foreign key
    manager_id INTEGER(10),
    PRIMARY KEY (id)
);

CREATE role(
    id INTEGER(10) AUTO_INCREMENT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INTEGER(10),
    PRIMARY KEY (id)
);

CREATE department(
    id INTEGER(10) AUTO_INCREMENT NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY (id)
);