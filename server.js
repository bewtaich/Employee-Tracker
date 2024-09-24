const express = require("express");
const inquirer = require("inquirer");
const { Pool } = require("pg");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Connect to DB
const pool = new Pool(
  {
    //PostgreSQL username
    user: "postgres",
    //PostgreSQL password
    password: "Troll571",
    host: "localhost",
    //PostgreSQL DB
    database: "employees_db",
  },
  console.log(`Connected to the database.`)
);

pool.connect();

const questions = [
  {
    type: "list",
    name: "actions",
    message: "What would you like to do?",
    choices: [
      "View Departments",
      "View Roles",
      "View Employees",
      "Add Department",
      "Add Role",
      "Add Employee",
      "Update Employee Role",
    ],
  },
];

//View all departments
function viewDepartments() {
  console.log("Viewing Departments");
  pool.query(
    `SELECT id AS "Department ID", 
    department_name AS "Department Name"
    FROM departments`,
    (err, res) => {
      if (err) {
        console.error("Error Retrieving Data", err);
      } else {
        console.table(res.rows);
      }
      init();
    }
  );
}

//View all roles
function viewRoles() {
  console.log("Viewing Roles");
  pool.query(
    `SELECT 
    roles.id AS "Role ID",
    roles.job_title AS "Title",
    roles.salary AS "Salary",
    departments.department_name AS "Department" 
    FROM roles 
    JOIN departments ON roles.department_id = departments.id`,
    (err, res) => {
      if (err) {
        console.error("Error Retrieving Data", err);
      } else {
        console.table(res.rows);
      }
      init();
    }
  );
}

//View all employees
function viewEmployees() {
  console.log("Viewing Employees");
  pool.query(
    `SELECT 
    employees.id AS "Employee ID",
    CONCAT(employees.first_name,' ',employees.last_name) AS "Employee Name", 
    roles.job_title AS "Role",
    roles.salary AS "Salary",
    departments.department_name AS "Department",
    CONCAT(manager.first_name, ' ', manager.last_name) AS "Manager Name"
    FROM employees
    JOIN roles ON employees.role_id = roles.id
    JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees AS manager ON employees.manager_id = manager.id`,

    (err, res) => {
      if (err) {
        console.error("Error Retrieving Data", err);
      } else {
        console.table(res.rows);
      }
      init();
    }
  );
}

//Add a role
async function addRole() {
  console.log("Adding Role");
  //Fetch departments
  const dept = await pool.query("SELECT id, department_name FROM departments");
  //Map for inquirer
  const departments = dept.rows.map((department) => ({
    name: department.department_name,
    value: department.id,
  }));
  

  const roleQ = [
    {
      name: "title",
      message: "What is the Title of the role you would like to add?",
    },
    {
      name: "salary",
      message: "What is the annual salary of this role?",
    },
    {
      type: "list",
      name: "department",
      message: "In what Department does this Role work?",
      choices: departments,
    },
  ];

  try {
    const response = await inquirer.prompt(roleQ);
    const { title, salary, department } = response;
    pool.query(
      "INSERT INTO roles (job_title, salary, department_id) VALUES ($1, $2, $3)",
      [title, salary, department]
    );
    console.log("Role Successfully Added");
  } catch (err) {
    console.error("Error Adding Role", err);
  }
  init();
}

//Add a department
async function addDepartment() {
  console.log("Adding Department");
  const dept = [
    {
      name: "department",
      message: "What is the name of the Department?",
    },
  ];
  try {
    const response = await inquirer.prompt(dept);
    const { department } = response;
    await pool.query("INSERT INTO departments (department_name) VALUES ($1)", [
      department,
    ]);
    console.log("Department Successfully Added");
  } catch (err) {
    console.error("Error Adding Department", err);
  }
  init();
}

//Add an employee
async function addEmployee() {
  console.log("Adding Employee");

  const rolesQuery = await pool.query("SELECT id, job_title FROM roles");
  const roles = rolesQuery.rows.map((role) => ({
    name: role.job_title,
    value: role.id,
  }));

  const managerQuery = await pool.query(
    "SELECT id, first_name, last_name FROM employees"
  );
  const managers = managerQuery.rows.map((manager) => ({
    name: `${manager.first_name} ${manager.last_name}`,
    value: manager.id,
  }));

  const employeeQ = [
    {
      name: "first",
      message: "What is the Employee's First Name?",
    },
    {
      name: "last",
      message: "What is the Employee's Last Name?",
    },
    {
      type: "list",
      name: "role",
      message: "What is the Employee's Role?",
      choices: roles,
    },
    {
      type: "list",
      name: "manager",
      message: "Who is this Employee's Manager?",
      choices: managers,
    },
  ];
  try {
    const response = await inquirer.prompt(employeeQ);
    const { first, last, role, manager } = response;
    await pool.query(
      "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1,$2,$3,$4)",
      [first, last, role, manager]
    );
    console.log("Employee Successfully Added");
  } catch (err) {
    console.error("Error Adding Employee", err);
  }

  init();
}

//Update an employee role
async function updateEmployeeRole() {
  console.log("Updating Employee Role");

  //Fetch employees and roles
  const employeeQuery = await pool.query(
    "SELECT id, first_name, last_name FROM employees"
  );
  const roleQuery = await pool.query("SELECT id, job_title FROM roles");

  //Map for inquirer
  const employee = employeeQuery.rows.map((employee) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));
  const role = roleQuery.rows.map((role) => ({
    name: role.job_title,
    value: role.id,
  }));

  const updateQ = [
    {
      type: "list",
      name: "employee",
      message: "Which employee would you like to update?",
      choices: employee,
    },
    {
      type: "list",
      name: "role",
      message: "Which role would like to give this employee?",
      choices: role,
    },
  ];
  try {
    const response = await inquirer.prompt(updateQ);
    const { employee, role } = response;
    pool.query("UPDATE employees SET role_id = $1 WHERE id = $2", [
      role,
      employee,
    ]);
    console.log("Employee Role Successfully Updated");
  } catch (err) {
    console.error("Error Updating Employee Role", err);
  }

  init();
}

function init() {
  inquirer.prompt(questions).then((response) => {
    switch (response.actions) {
      case "View Departments":
        viewDepartments();
        break;
      case "View Roles":
        viewRoles();
        break;
      case "View Employees":
        viewEmployees();
        break;
      case "Add Department":
        addDepartment();
        break;
      case "Add Role":
        addRole();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Update Employee Role":
        updateEmployeeRole();
        break;
    }
  });
}

init();

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
