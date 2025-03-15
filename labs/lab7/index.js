const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// create directory 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home route for "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/home.html'));
  });
app.get('/home', (req, res) => {
res.sendFile(path.join(__dirname, '/public/home.html'));
});
// Dynamic route for other pages
app.get('/:page', (req, res) => {
    const page = req.params.page;
    const validPages = ['about', 'cats', 'dogs', 'birds'];
    if (validPages.includes(page)) {
      res.sendFile(path.join(__dirname, `/public/${page}.html`));
    } else {
      res.status(404).sendFile(path.join(__dirname, '/public/404.html'));
    }
  });

// POST route
app.post('/hello', (req, res) => {
    res.send(`Hello, ${req.body.name || 'Guest'}!`);
  });



  // Error handling for undefined routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/public/404.html'));
  });
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  });

