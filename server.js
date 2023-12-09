// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sessions = require('express-session');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const mysql = require('mysql2');
const cookieParser = require("cookie-parser");
require('dotenv').config();
// my module:
const utilsDB = require('./utils/db');
// Connect MySQL
const db = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'wpr',
  password: 'fit2023',
  database: 'wpr2023'
});

const useDB = utilsDB.utilsDB(db);



const app = express();
const port = 8000 || process.env.PORT;
app.use(bodyParser.json());
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// creating 24 hours from milliseconds
//session middleware
app.use(sessions({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  resave: false
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Allow access fetch API:
app.use(cors());




// Set up Multer to process files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
// Create the multer instance
const upload = multer({ storage: storage });

module.exports = upload;


// a variable to save a session
var session = {};
// Routes
app.get("/", (req, res) => {
  if (!session.user) {
    return res.redirect('/sign-in')
  }
  console.log(session);
  if (session.user) {
    const listEmailsQuery = 'SELECT * FROM emails WHERE receiver_id = ?';
    const values = [session.user.id];
    db.query(listEmailsQuery, values, (error, results) => {
      if (error) throw error;
      else {
        console.log(results);
        session = {
          ...session,
          listReciver: [
            ...results
          ]
        }
      }
    });
  }
  return res.render('home', {
    ...session
  })
})

// Sign In
app.get('/sign-in', (req, res) => {
  // Check if the user is already signed in
  if (req.session.user) {
    res.redirect('/inbox');
  } else {
    res.render('signin');
  }
});


app.post('/sign-in', async (req, res) => {
  const data = req.body;

  try {
    const results = await useDB.getUser(data.email, data.password)

    if (results) {
      session.user = results
    } else {
    }

  } catch (error) {
    // Handle database error
    console.error(error);
  }
  res.redirect('/');
});
//


app.get('/sign-up', (req, res) => {
  return res.render('signup');
});

app.post('/sign-up', async (req, res) => {
  const data = req.body;

  if (data.password === data.reEnterPassword) {
    try {

      const createUser = await useDB.createUser(data.email, data.fullName, data.password)
      const results = await useDB.getUser(data.email, data.password);

      if (results.length > 0) {
        req.session.user = { ...results[0] };
      } else {
        // Handle invalid credentials
      }

    } catch (error) {
      // Handle database error
      console.error(error);
    }
  }
  return res.redirect('/');
});




app.get('/detail', (req, res) => {
  return res.render('detail');
});
app.get('/home', (req, res) => {
  return res.render('home');
});

app.get('/outbox', (req, res) => {
  return res.render('outbox');
});

app.get('/inbox', (req, res) => {
  return res.render('inbox');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
