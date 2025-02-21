const express = require("express");
const path = require("path");
const port = 3000;
const sqlite3 = require('sqlite3').verbose();

// Creating the Express server
const app = express();

// Connect to SQLite database
let db = new sqlite3.Database('questions.db', (err) => {    
  if (err) {
      return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});

app.post("/submit-quiz", (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
      return res.send("<h1>Error: No answers submitted. Please select answers before submitting.</h1><br><a href='/show'>Try Again</a>");
  }

  let score = 0;
  const userAnswers = req.body; // Now, req.body is checked to exist

  const query = 'SELECT QID, "Correct" FROM questions'; 

  db.all(query, [], (err, rows) => {
      if (err) {
          console.error("Database Query Error:", err.message);
          return res.status(500).send("Database Query Failed.");
      }

      rows.forEach((question) => {
          const userAnswer = userAnswers[`q${question.QID}`]; // Get user's answer
          if (userAnswer && userAnswer.trim() === question["Correct"].trim()) { 
              score++; 
          }
      });

      res.send(`
          <h1>Your Score: ${score}/${rows.length}</h1>
          <br>
          <a href="/show" class="btn btn-primary">Try Again</a>
      `);
  });
});




// static resourse & templating engine
app.use(express.static('public'));
// Set EJS as templating engine
app.set('view engine', 'ejs');


// routing path
app.get('/show', function (req, res) {
  const query = 'SELECT * FROM questions';  // Make sure the table name is correct!

  db.all(query, (err, rows) => {
      if (err) {
          console.error("Database error:", err.message);
          return res.status(500).send("Database error.");
      }
      
      console.log("Fetched data:", rows);  // Debugging line to check if data is returned

      res.render('show', { data: rows || [] }); // Ensure data is always an array
  });
});


// Starting the server
app.listen(port, () => {
   console.log("Server started.");
 });