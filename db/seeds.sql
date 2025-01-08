INSERT INTO department (department_name) VALUES 
('HR'), 
('Project Management'), 
('Sales Team');


INSERT INTO roles (title, salary, department_id) VALUES 
('HR Manager', 60000, 1), 
('Project Manager', 80000, 2), 
('Sales Associate', 50000, 3);


INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('Jake', 'Sullivan', 2, NULL),    
('Sandra', 'Gilbert', 1, 1),   
('Mike', 'Kelly', 3, 2);   

SELECT * FROM department