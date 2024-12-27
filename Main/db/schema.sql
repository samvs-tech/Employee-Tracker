DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

\c employee_db;

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    department_name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTERGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCAHR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);