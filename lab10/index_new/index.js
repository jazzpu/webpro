const express = require("express");
const path = require("path");
const port = 3000;
const sqlite3 = require('sqlite3').verbose();

// Creating the Express server
const app = express();

// Connect to SQLite database
let db = new sqlite3.Database('userdata.db', (err) => {    
  if (err) {
      return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});


// static resourse & templating engine
app.use(express.static('public'));
// Set EJS as templating engine
app.set('view engine', 'ejs');


// routing path
app.get('/show', function (req, res) {
    const query = 'SELECT * FROM users ';
    db.all(query, (err, rows) => {
        if (err) {
            console.log(err.message);
        }
        console.log(rows);
        res.render('shows', { data: rows });
    });
});
app.get('/detail', function (req, res) {
    const query = `SELECT * FROM users WHERE id = ${req.query.id}`;
    db.get(query, (err, rows) => {
        if (err) {
        return console.log(err.message);
        }
        console.log(rows);
        res.render('detail', { data: rows });
    });
});


// Starting the server
app.listen(port, () => {
   console.log("Server started.");
 });