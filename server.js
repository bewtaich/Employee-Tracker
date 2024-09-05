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
  pool.query('SELECT id, department_name FROM departments', (err, res) => {
    if (err) {
      console.error('Error Retrieving Data')
    } else {
      console.table(res.rows)
    }
    init();
  })
}

//View all roles
function viewRoles() {
  console.log("Viewing Roles");
  pool.query('SELECT id, job_title, salary, department_id FROM roles', (err, res) => {
    if (err) {
      console.error('Error Retrieving Data')
    } else {
      console.table(res.rows)
    }
    init();
  })
}

//View all employees
function viewEmployees() {
  console.log("Viewing Employees");
  pool.query('SELECT first_name AS First, last_name AS Last, role_id, manager_id FROM employees', (err, res) => {
    if (err) {
      console.error('Error Retrieving Data')
    } else {
      console.table(res.rows)
    }
    init();
  })
}

//Add a role
function addRole() {
  console.log("Adding Role");
  const roleQ = {
    name: role,
    message: 'What Role would you like to add?'
  }
  inquirer.prompt(roleQ).then(response => {
    
  }

  ) 
}

//Add a department
function addDepartment() {
  console.log("Adding Department");
}

//Add an employee
function addEmployee() {
  console.log("Adding Employee");
}

//Update an employee role
function updateEmployeeRole() {
  console.log("Updating Employee Role");
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
      case "Update Employee Roles":
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
