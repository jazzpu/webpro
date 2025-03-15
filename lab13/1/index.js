const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true
}));
app.use(cookieParser());

// Set EJS as the templating engine
app.set('view engine', 'ejs');



// Serve EJS form
app.get('/', (req, res) => {
    res.render('employee_form', { employee: req.session.employee || {} });
});

app.post('/save', (req, res) => {
    console.log("Saving data:", req.body); // Check what's received
    req.session.employee = req.body;
    console.log("Session now contains:", req.session); // See what's stored
    res.redirect('/');
});

app.get('/show', (req, res) => {
    console.log("Current session data:", req.session);
    res.render('employee_form', { employee: req.session.employee || {} });
});

app.get('/clear', (req, res) => {
    console.log("Clearing session...");
    req.session.destroy();
    res.redirect('/');
});


// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
