const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files

// Mock Data
const resources = [
  { id: 1, title: 'Introduction to Node.js', type: 'Article', author: 'Jane Doe' },
  { id: 2, title: 'Learning Express.js', type: 'Book', author: 'John Smith' },
  { id: 3, title: 'JavaScript Fundamentals', type: 'Article', author: 'Alice Brown' },
];

const users = [
  { id: 1, name: 'Rohan', email: 'rohan@example.com', password: 'password123' },
];

let loggedInUser = null;

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Resource Library' });
});

app.get('/browse', (req, res) => {
  res.render('browse', { title: 'Browse Resources', resources });
});

app.get('/account', (req, res) => {
  if (!loggedInUser) {
    return res.redirect('/login');
  }
  res.render('account', { title: 'Manage Account', user: loggedInUser });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    loggedInUser = user;
    return res.redirect('/account');
  }
  res.send('<h2>Invalid email or password. <a href="/login">Try again</a></h2>');
});

app.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (users.find(u => u.email === email)) {
    return res.send('<h2>Email already registered. <a href="/register">Try again</a></h2>');
  }

  const newUser = { id: users.length + 1, name, email, password };
  users.push(newUser);
  loggedInUser = newUser;

  res.redirect('/account');
});

// Resources Routes
app.get('/resources', (req, res) => {
  if (!loggedInUser) {
    return res.redirect('/login');
  }
  res.render('resources', { title: 'Manage Resources', resources });
});

app.post('/resources', (req, res) => {
  const { title, type, author } = req.body;
  const newResource = { id: resources.length + 1, title, type, author };
  resources.push(newResource);

  res.redirect('/resources');
});
app.get('/resources', (req, res) => {
    if (!loggedInUser) {
        return res.redirect('/login');
    }
    res.render('resources', { title: 'Manage Resources', resources });
});


// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
