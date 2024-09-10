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
    "SELECT id as department_id, department_name FROM departments",
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
    "SELECT id, job_title, salary, department_id FROM roles",
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
    "SELECT first_name, last_name, role_id, manager_id FROM employees",
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
function addRole() {
  console.log("Adding Role");
  //Getting departments to choose from
  pool.query("SELECT id, department_name FROM departments", (err, res) => {
    if (err) {
      console.error("Error Retrieving Data", err);
      return;
    }

    //Displaying name for prompt but capturing value of id
    const departments = res.rows.map((department) => ({
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

    inquirer.prompt(roleQ).then((response) => {
      const { title, salary, department } = response;
      console.log(response)
      pool.query(
        "INSERT INTO roles (job_title, salary, department_id) VALUES ($1, $2, $3)",
        [title, salary, department],
        (err, res) => {
          if (err) {
            console.error("Error Adding Role", err);
          } else {
            console.log("Role Successfully Added");
          }
        }
      );
    });
  });
  init();
}
//Add a department
function addDepartment() {
  console.log("Adding Department");
  const dept = [{
    name:'department',
    message:'What is the name of the Department?'
  }]
  inquirer.prompt(dept).then((response)=>{
    const {department} = response;
    pool.query(
        "INSERT INTO departments (department_name) VALUES ($1)",
        [department],
        (err,res)=>{
          if (err){
            console.error("Error Adding Department",err)
          } else {
            console.log("Department Successfully Added")
          }
        })
  })
  init();
}

//Add an employee
async function addEmployee() {
  console.log("Adding Employee");

  const rolesQuery = await pool.query("SELECT id, job_title FROM roles");
  const roles = rolesQuery.rows.map(role=>({
    name: role.job_title,
    value: role.id,
  }))

  const managerQuery = await pool.query("SELECT id, first_name, last_name FROM employees");
  const managers = managerQuery.rows.map(manager=>({
    name:`${manager.first_name} ${manager.last_name}`,
    value: manager.id,
  }))

  const employeeQ = [
    {
      name:'first',
      message:"What is the Employee's First Name?"
    },
    {
      name:'last',
      message:"What is the Employee's Last Name?"
    },
    {
      type:'list',
      name:'role',
      message:"What is the Employee's Role?",
      choices:roles
    },
    {
      type:'list',
      name:'manager',
      message:"Who is this Employee's Manager?",
      choices:managers
    }
  ]
  inquirer.prompt(employeeQ).then((response)=>{
    const {first, last, role, manager} = response;
    pool.query(
      "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1,$2,$3,$4)",
        [first, last, role, manager],
        (err,res)=>{
          if (err){
            console.error("Error Adding Department",err)
          } else {
            console.log("Employee Successfully Added")
          }
        })
  })
  init();
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
