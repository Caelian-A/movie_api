
// Require modules for use in app
const express = require('express');
const app = express();
const morgan = require('morgan');

// Define JSON Object
let bondMovies = [
    {
        title: 'Dr. No',
        director: ['Terence Young'],
        bondActor: ['Sean Connery'],
        year: 1962
    },
    {
        title: 'From Russia with Love',
        director: ['Terence Young'],
        bondActor: ['Sean Connery'],
        year: 1963
    },
    {
        title: 'Goldfinger',
        director: ['Guy Hamilton'],
        bondActor: ['Sean Connery'],
        year: 1964
    },
    {
        title: 'Thunderball',
        director: ['Terence Young'],
        bondActor: ['Sean Connery'],
        year: 1965
    },
    {
        title: 'You Only Live Twice',
        director: ['Lewis Gilbert'],
        bondActor: ['Sean Connery'],
        year: 1967
    },
    {
        title: 'On Her Majesty\'s Secret Service',
        director: ['Peter Roger Hunt'],
        bondActor: ['George Lazenby'],
        year: 1969
    },
    {
        title: 'Diamonds Are Forever',
        director: ['Guy Hamilton'],
        bondActor: ['Sean Connery'],
        year: 1971
    },
    {
        title: 'Live and Let Die',
        director: ['Guy Hamilton'],
        bondActor: ['Roger Moore'],
        year: 1973
    },
    {
        title: 'The Man with the Golden Gun',
        director: ['Guy Hamilton'],
        bondActor: ['Roger Moore'],
        year: 1974
    },
    {
        title: 'The Spy Who Loved Me',
        director: ['Lewis Gilbert'],
        bondActor: ['Roger Moore'],
        year: 1977
    },
    {
        title: 'Moonraker',
        director: ['Lewis Gilbert'],
        bondActor: ['Roger Moore'],
        year: 1979
    },
    {
        title: 'For Your Eyes Only',
        director: ['John Glen'],
        bondActor: ['Roger Moore'],
        year: 1981
    },
    {
        title: 'Octopussy',
        director: ['John Glen'],
        bondActor: ['Roger Moore'],
        year: 1983
    },
    {
        title: 'A View to a Kill',
        director: ['John Glen'],
        bondActor: ['Roger Moore'],
        year: 1985
    },
    {
        title: 'The Living Daylights',
        director: ['John Glen'],
        bondActor: ['Timothy Dalton'],
        year: 1987
    },
    {
        title: 'Licence to Kill',
        director: ['John Glen'],
        bondActor: ['Timothy Dalton'],
        year: 1989
    },
    {
        title: 'GoldenEye',
        director: ['Martin Campbell	'],
        bondActor: ['Pierce Brosnan'],
        year: 1995
    },
    {
        title: 'Tomorrow Never Dies',
        director: ['Roger Spottiswoode'],
        bondActor: ['Pierce Brosnan'],
        year: 1997
    },
    {
        title: 'The World Is Not Enough',
        director: ['Michael Apted'],
        bondActor: ['Pierce Brosnan'],
        year: 1999
    },
    {
        title: 'Die Another Day',
        director: ['Lee Tamahori'],
        bondActor: ['Pierce Brosnan'],
        year: 2002
    },
    {
        title: 'Casino Royale',
        director: ['Martin Campbell'],
        bondActor: ['Daniel Craig'],
        year: 2006
    },
    {
        title: 'Quantum of Solace',
        director: ['Marc Forster'],
        bondActor: ['Daniel Craig'],
        year: 2008
    },
    {
        title: 'Skyfall',
        director: ['Sam Mendes'],
        bondActor: ['Daniel Craig'],
        year: 2012
    },
    {
        title: 'Spectre',
        director: ['Sam Mendes'],
        bondActor: ['Daniel Craig'],
        year: 2015
    },
    {
        title: 'No Time to Die',
        director: ['Cary Joji Fukunaga'],
        bondActor: ['Daniel Craig'],
        year: 2021
    }
  ];

  // Middleware
  app.use(express.static('public'));
  app.use(morgan('common'));

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