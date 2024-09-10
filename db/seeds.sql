INSERT INTO departments (department_name)
VALUES
    ('Department 1'),
    ('Department 2'),
    ('Department 3'),
    ('Department 4'),
    ('Department 5');

INSERT INTO roles (job_title, salary, department_id)
VALUES
    ('CEO', 100000, 1),
    ('Manager', 80000, 2),
    ('Marketing', 55000, 3),
    ('Accounting', 60000, 4),
    ('Production', 65000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Brian', 'Taich', 1, NULL),
    ('Jeff', 'White', 2, 1),
    ('Sam', 'Howard', 3, 2),
    ('Ben', 'Stuart', 4, 2),
    ('Jordan', 'Maxwell', 5, 2);
    
