
// Require modules for use in app
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend:true}));
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');
const MoviesDB = Models.Movie;
const Users = Models.User;
mongoose.connect('mongodb://localhost:27017/MoviesDB', { useNewUrlParser: true, useUnifiedTopology: true});

  // Middleware
  app.use(morgan('common'));
  app.use(express.static('public'));

  // GET request for '/' returns welcome text
  app.get ('/', (req, res) => {
    res.send('Welcome to the Movie data hub!');
  });  

  //GET request for /movies returns list of movies(CHECKED w/ POSTMAN)
  app.get('/movies/', (req, res) => {
    MoviesDB.find()
      .then((movies) => {
          res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error' + err);
    });
    });

  // GET Request for /movies/[title] (CHECKED w/ POSTMAN)
  app.get('/movies/:title', (req, res) => {
      MoviesDB.findOne({Title: req.params.title})
      .then((movies) => {
          res.status(201).json(movies);
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Error' + err);
      });
  });

  //GET Request for /genres/[genrename]
  app.get('/genres/:genrename', (req, res) => {
      MoviesDB.find({'Genre.Name': req.params.genre})
      .then((movies) => {
          res.status(201).json(movies.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error' + err);
    });
  })

// GET Request for /directors/[name]
app.get('/directors/:name', (req, res) => {
    MoviesDB.findOne({'Directors.Name': req.params.name})
    .then((movie) => {
        res.status(201).json(movie.director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error' + err);
    });
})

// POST request for user registration
app.post('/users/', (req, res) => {
    Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'is already taken!');
            } else {
                Users.create({
                    Username: req.body.Username,
                    Password: req.body.Password,
                    email: req.body.Email,
                    birthday: req.body.Birthday, 
                    City: req.body.City
                    })
                    .then((user) =>{
                        res.status(201).json(user);
                    })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                })
            }
        })
        .catch((error) => {
            console.errir(error);
            res.status(500).send('Error: ' + error);
        });
});

// PUT request for updating user details
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username}, { $set:
    {
        Username: req.body.Username,
        Password: req.body.Password,
        email: req.body.email,
        birthday: req.body.Birthday, 
        City: req.body.City
    }
},
{new: true},
(err, updatedUser) => {
    if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    } else {
        res.json(updatedUser);
    }
});
});

// POST request for adding a movies to favourites
app.post('/users/:username/addfavourite/:movietitle', (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username}, {
        $push: {FavouriteMovies: req.params.MovieID}
    },
    {new: true},
(err, updatedUser) => {
    if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    } else {
        res.json(updatedUser);
    }
});
});

// DELETE request for removing a movies from favourites
app.delete('/users/:username/removefavourite/:movietitle', (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username}, {
        $pull: {FavouriteMovies: req.params.MovieID}
    },
    {new: true},
(err, updatedUser) => {
    if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    } else {
        res.json(updatedUser);
    }
});
});

// DELETE request removing a user
app.delete('/users/:username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + " cannot be deleted as the user does not exist.");
      } else {
        res.status(200).send(req.params.username + " has deregistered.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
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