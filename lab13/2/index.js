const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve EJS form
app.get('/', (req, res) => {
    // Get employee data from cookies instead of session
    const employee = req.cookies.employee ? JSON.parse(req.cookies.employee) : {};
    res.render('employee_form', { employee });
});

app.post('/save', (req, res) => {
    console.log("Saving data:", req.body);
    // Store employee data in cookies
    res.cookie('employee', JSON.stringify(req.body), {
        maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 24 hours
        httpOnly: false,  // Changed to false to make it visible in DevTools
        secure: false     // Allow cookie over non-HTTPS
    });
    console.log("Cookie set with data:", req.body);
    res.redirect('/');
});

app.get('/show', (req, res) => {
    const employee = req.cookies.employee ? JSON.parse(req.cookies.employee) : {};
    console.log("Current cookie data:", employee);
    res.render('employee_form', { employee });
});

app.get('/clear', (req, res) => {
    console.log("Clearing cookies...");
    res.clearCookie('employee');
    res.redirect('/');
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});