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
    let formdata = {
        username: req.body.username,
        passwd: req.body.passwd,
        email: req.body.email,
        fname: req.body.fname,
        lname: req.body.lname,
        age: req.body.age,
        address: req.body.address,
        phone: req.body.phone
    };

    console.log("Received data:", formdata);

    // ตรวจสอบข้อมูลที่รับมา
    if (!formdata.username || !formdata.passwd || !formdata.email) {
        return res.status(400).send("Missing required fields!");
    }

    // ใช้ SQL statement ที่ถูกต้อง
    let sql = `INSERT INTO users(username, passwd, email, fname, lname, age, address, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    let values = [formdata.username, formdata.passwd, formdata.email, formdata.fname, formdata.lname, formdata.age, formdata.address, formdata.phone];

    // บันทึกข้อมูลลง MySQL
    conn.query(sql, values, function (err, result) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error: " + err.message);
        }
        console.log("A record inserted");
        res.send("Data inserted successfully!");
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
