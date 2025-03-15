const express = require("express");
const path = require("path");
const port = 3000;
const sqlite3 = require('sqlite3').verbose;

const app = express();

// let db = new sqlite3.Database('countries.json', (err) => {
//     if (err) {
//         return console.error(err.message);
//     }
//     console.log('Connected to SQLite Database boii');
// });

//serves files from public folder
app.use(express.static('public'));
//use ejs files to serve html files which typically are stores in the views folder
app.set('view engine', 'ejs');

app.get('/', (req,res) => {
    res.render("show")
});

app.get("/countries",  async(req, res) => {
    const response = await fetch("http://10.0.15.21:8000/countries"); // 🌍 Fetch API data
    const countries = await response.json();
    res.render("countries", { countries }); // ✅ Pass data to EJS
});

app.get("/get-countries", async (req, res) => {
    try {
        const response = await fetch("http://10.0.15.21:8000/countries");
        const countries = await response.json();
        res.json(countries); // ✅ Sends JSON response back to the client
    } catch (error) {
        console.error("Error fetching countries:", error);
        res.status(500).json({ error: "Failed to fetch countries" });
    }
});


app.listen(port, ()=> {
    console.log(`starting node.js server at port ${port}`);
});

