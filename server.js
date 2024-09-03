const express = require('express');
const inquirer = require('inquirer');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Connect to DB
const pool = new Pool(
  {
    //PostgreSQL username
    user: 'postgres',
    //PostgreSQL password
    password: 'Troll571',
    host: 'localhost',
    //PostgreSQL DB
    database: 'employees_db'
  },
  console.log(`Connected to the database.`)
)

pool.connect();

const questions = [
    {type: "list",
    name: "actions",
    message: "What would you like to do?",
    choices: ['View Departments', 'View Roles', 'View Employees',
      'Add Department', 'Add Role', 'Add Employee', "Update Employee's Role"
    ]},
]

//View all departments
function viewDepartments () {

}

//View all roles
function viewRoles () {
  
}

//View all employees
function viewEmployees () {
  
}

//Add a role
function addRole () {
  
}

//Add a department
function addDepartment () {
  
}

//Add an employee
function addEmployee () {
  
}

//Update an employee role
function updateEmployee () {

}


function init() {
  inquirer
    .prompt(questions)
    .then((response) =>
      console.log('Hi')
    )};


init();

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  