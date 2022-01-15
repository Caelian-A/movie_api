
// Require modules for use in app
const bodyParser = require('body-parser');
const express = require('express');
const { check, validationResult } = require('express-validator');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend:true}));
const morgan = require('morgan');
const mongoose = require('mongoose');
const models = require('./models.js');
const moviesDB = models.movie;
const users = models.user;
const cors = require('cors');
app.use(cors());
//mongoose.connect('mongodb://localhost:27017/MoviesDB', { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true});

  // Middleware
  app.use(morgan('common'));
  app.use(express.static('public'));
  
  //Authentication
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

  // GET request for '/' returns welcome text
  app.get ('/', (req, res) => {
    res.send('Welcome to the Movie data hub!');
  });  

  //GET request for /movies returns list of movies(CHECKED w/ POSTMAN)
  app.get('/movies/', passport.authenticate('jwt', {session: false}), (req, res) => {
    moviesDB.find()
      .then((movies) => {
          res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error' + err);
    });
    });

  // GET Request for /movies/[title] (CHECKED w/ POSTMAN)
  app.get('/movies/:title', passport.authenticate('jwt', {session: false}), (req, res) => {
      moviesDB.findOne({Title: req.params.title})
      .then((movies) => {
          res.status(201).json(movies);
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Error' + err);
      });
  });

  //GET Request for /genres/[genrename] (CHECKED w/ POSTMAN)
  app.get('/genres/:genrename', passport.authenticate('jwt', {session: false}), (req, res) => {
      moviesDB.findOne({'Genre.Name': req.params.genrename})
      .then((movies) => {
          res.status(201).json(movies.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error' + err);
    });
  })

// GET Request for /directors/[name]  (CHECKED w/ POSTMAN)
app.get('/directors/:name', passport.authenticate('jwt', {session: false}), (req, res) => {
    moviesDB.findOne({'Directors.Name': req.params.name})
    .then((movie) => {
        res.status(201).json(movie.Directors.find(director => director.Name === req.params.name)); 
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error' + err);
    });
})

// POST request for user registration (CHECKED w/ POSTMAN)
app.post('/users', [
    check('Username', 'Username must be at least 5 characters long').isLength({min: 4}),
    check('Username', 'Username must contain only alphanumeric characters').isAlphanumeric(),
    check('Password', 'Password must be at least 8 charactes long, contain at least 1 Uppercase and 1 lowercase character. Password must also contain at least 1 number and 1 symbol.').isStrongPassword(),
    check('Email', 'Email is not valid').isEmail(),
    check('Birthday', 'Birthday is invalid, please input your birthday as YYYY-MM-DD').isDate(),
    check('City', 'City can contain only letters').isAlpha()
    ], (req, res) => {
        //Check for Validation errors
        let errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(422).json({errors: errors.array() });
        } 
    let hashedPassword = users.hashPassword(req.body.Password)
    users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' is already taken!');
            } else {
                users.create({
                    Username: req.body.Username,
                    Password: hashedPassword,
                    Email: req.body.Email,
                    Birth: req.body.Birthday,
                    City: req.body.City
                    })
                    .then((user) =>{
                        res.status(201).json(user)
                    })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// PUT request for updating user details (CHECKED w/ POSTMAN)
app.put('/users/:username', [
    check('Username', 'Username must be at least 5 characters long').isLength({min: 4}),
    check('Username', 'Username must contain only alphanumeric characters').isAlphanumeric(),
    check('Password', 'Password must be at least 8 charactes long, contain at least 1 Uppercase and 1 lowercase character. Password must also contain at least 1 number and 1 symbol.').isStrongPassword(),
    check('Email', 'Email is not valid').isEmail(),
    check('Birthday', 'Birthday is invalid, please input your birthday as YYYY-MM-DD').isDate(),
    check('City', 'City can contain only letters').isAlpha()
    ], passport.authenticate('jwt', {session: false}), (req, res) => {
        //Check for Validation errors
        let errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(422).json({errors: errors.array() });
        } 
    let hashedPassword = users.hashPassword(req.body.Password)
    users.findOneAndUpdate({Username: req.params.username}, { $set:
    {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birth: req.body.Birthday, 
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

// POST request for adding a movies to favourites (CHECKED w/ POSTMAN)
app.post('/users/:username/addfavourite/:movieID', passport.authenticate('jwt', {session: false}), (req, res) => {
    users.findOneAndUpdate({Username: req.params.username}, {
        $push: {FavouriteMovies: req.params.movieID}
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

// DELETE request for removing a movies from favourites (CHECKED w/ POSTMAN)
app.delete('/users/:username/removefavourite/:movieID', passport.authenticate('jwt', {session: false}), (req, res) => {
    users.findOneAndUpdate({Username: req.params.username}, {
        $pull: {FavouriteMovies: req.params.movieID}
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

// DELETE request removing a user (CHECKED w/ POSTMAN)
app.delete('/users/:username', passport.authenticate('jwt', {session: false}), (req, res) => {
    users.findOneAndRemove({ Username: req.params.username })
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
  const port = process.env.PORT || 8080;
  app.listen(port, '0.0.0.0',() => {
      console.log('Listening on port ' + port);
  });