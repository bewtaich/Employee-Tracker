const express = require('express');
const inquirer = require('inquirer');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const pool = new Pool(
  {
    //PostgreSQL username
    user: 'postgres',
    //PostgreSQL password
    password: 'Troll571',
    host: 'localhost',
    //PostgreSQL DB
    database: 'books_db'
  },
  console.log(`Connected to the database.`)
)

pool.connect();

const questions = {
  {
    type: "list",
    name: "actions",
    message: "What would you like to do?",
    choices: [],
  },
}
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  