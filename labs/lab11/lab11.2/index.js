const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const db = new sqlite3.Database("todo.db");

app.set("view engine", "ejs"); // Use EJS for rendering
app.set("views", path.join(__dirname, "views")); // Ensure views folder is used
app.use(express.static("public"));
app.use(bodyParser.json());

// ✅ Create To-Do Table (Ensures `todolist` exists)
db.run(`CREATE TABLE IF NOT EXISTS todolist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    deadline TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0
)`);

// ✅ Route to Render `show.ejs` and Pass Data
app.get("/", (req, res) => {
    db.all("SELECT * FROM todolist", [], (err, rows) => {
        if (err) return res.status(500).send("Database error");
        res.render("show", { todos: rows }); // ✅ Pass `todolist` data to show.ejs
    });
});

// ✅ Add To-Do (Fixed Table Name)
app.post("/add-todo", (req, res) => {
    db.run(`INSERT INTO todolist (title, deadline) VALUES (?, ?)`,
        [req.body.title, req.body.deadline],
        function (err) {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ id: this.lastID });
        }
    );
});

// ✅ Get To-Dos (For AJAX Requests)
app.get("/get-todos", (req, res) => {
    db.all("SELECT * FROM todolist", [], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(rows);
    });
});

// Start Server
app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
