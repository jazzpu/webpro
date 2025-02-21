// dbconn.js

const mysql = require('mysql');
const conn = mysql.createConnection({
    host: "10.0.15.21",
    user: "s66070246",
    password: "XN6NLGHR", 
    database: "d66070246"
});

// open the MySQL connection
conn.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

module.exports = conn;