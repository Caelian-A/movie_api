
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

  // GET request for '/' returns welcome text
  app.get ('/', (req, res) => {
    res.send('Welcome to the Bond data hub!');
  });  

  // GET request for /movies returns list of movies
  app.get ('/movies', (req, res) => {
     res.json(bondMovies);
  });

  // GET Request for /movies/[title]
  app.get('/movies/:title', (req, res) => {
      res.send('Movie Information by title');
  });

  // GET Request for /genres/[genrename]
  app.get('/genres/:genrename', (req, res) => {
    res.send('List of all by movies in a given genre');
});

// GET Request for /directors/[name]
app.get('/directors/:name', (req, res) => {
    res.send('Data about a director by name');
});

// POST request for user registration
app.post('/users/add/:username', (req, res) => {
    res.send('Registration successful!');
});

// PUT request for updating user details
app.put('/users/update/:username', (req, res) => {
    res.send('User details updated!');
});

// POST request for adding a movies to favourites
app.post('/users/:username/addfavourite/:movietitle', (req, res) => {
    res.send('[title] added to favourites!');
});

// DELETE request for removing a movies from favourites
app.delete('/users/:username/removefavourite/:movietitle', (req, res) => {
    res.send('[title] removed from favourites!');
});

// DELETE request removing a user
app.delete('/users/remove/:username', (req, res) => {
    res.send('You have succesfully deregistered.');
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