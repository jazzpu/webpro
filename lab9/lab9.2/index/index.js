// index.js

const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// เพิ่มใช้งานไฟล์
const conn = require('./dbconn.js');

// static resourse
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Set EJS as templating engine
app.set('view engine', 'ejs');

// routing 
app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/form.html')); // ส่งฟอร์ม HTML
});

app.post('/process_form', function (req, res) {
    let { username, passwd } = req.body;

    if (!username || !passwd) {
        return res.status(400).send("❌ Missing username or password!");
    }

    let sql = `SELECT * FROM users WHERE username = ?`;

    conn.query(sql, [username], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("⚠️ Database error!");
        }

        if (results.length === 0) {
            return res.status(401).send("❌ User does not exist!"); // ✅ THIS LINE TRIGGERS THE RED TEXT FIELD
        }

        let user = results[0];

        if (user.passwd !== passwd) {
            return res.status(401).send("❌ Incorrect password!");
        }

        res.send("✅ Login successful!");
    });
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});