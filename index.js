
// Require modules for use in app
const express = require('express');
const app = express();
const morgan = require('morgan');
let data = require('./data.js');
let bondMovies = data.bondMovies

// Define JSON Object


  // Middleware
  app.use(morgan('common'));
  app.use(express.static('public'));
  

  // GET request for /movies returns list of movies
  app.get ('/movies', (req, res) => {
     res.json(bondMovies);
  });

  // GET request for '/' returns welcome text
  app.get ('/', (req, res) => {
      res.send('Welcome to the Bond data hub!');
  });

  // GET request for documentation.html
  app.get ('/documentation.html', (req, res) => {
      res.sendFile('public/documentation.html', {root: __dirname});
  });

  // Error handling
  app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something went wrong');
  });

  // Listen for requests
  app.listen(8080, () => {
      console.log('This app listens on port 8080');
  });