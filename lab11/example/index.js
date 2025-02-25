const express = require("express");
const path = require("path");
const port = 3000;
const sqlite3 = require('sqlite3').verbose();

// Creating the Express server
const app = express();

// Connect to SQLite database
let db = new sqlite3.Database('employee.db', (err) => {    
  if (err) {
      return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});


// static resourse & templating engine
app.use(express.static('public'));
// Set EJS as templating engine
app.set('view engine', 'ejs');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.send("Hello! REST API");
});

app.get('/employees', (req, res) => {
  const query = 'SELECT * FROM employees ';
  db.all(query, (err, rows) => {
      if (err) {
          console.log(err.message);
      }
      console.log(rows);
      res.send(JSON.stringify(rows));
  });
});

app.listen(port, () => {
  console.log(`Starting node.js at port ${port}`);
});

app.get('/employees/:id', (req, res) => {
  const employeeId = req.params.id; // Get ID from URL
  const query = `SELECT * FROM employees WHERE EmployeeID = ?`;

  db.get(query, [employeeId], (err, row) => {
      if (err) {
          console.error(err.message);
          return res.status(500).send("Database error!");
      }
      if (!row) {
          return res.status(404).send("Employee not found!");
      }
      console.log(row);
      res.json(row);
  });
});


// app.post('/employees', (req, res) => {   
//   // process nothing   
//   res.send(`Add new employee ... completed.`)
// });

// app.put('/employees/:id', (req, res) => {
//   // req.params.id
//   res.send(`Update/PUT employee id : ${req.params.id} completed.`)
// });

app.delete('/employees/:id', (req, res) => {
  const query = `DELETE FROM employees WHERE EmployeeID = ?`;
  db.run(query, [req.params.id], function (err) {
      if (err) {
          return console.error(err.message);
      }
      if (this.changes === 0) {
          return res.status(404).send("Employee not found.");
      }
      console.log(`Employee ${req.params.id} deleted.`);
      res.send(`Delete employee ${req.params.id} completed.`);
  });
});
