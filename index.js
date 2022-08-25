const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');
const movies = Models.Movie;
const users = Models.User;
const genres = Models.Genre;
const directors = Models.Director;
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

// mongoose.connect('mongodb://localhost:27017/Cinemachannel', { useNewUrlParser: true, useUnifiedTopology: true }); // to connect to local 
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(morgan('common'));

const cors = require('cors'); // lets cors be implamented so my site can link with all sites
app.use(cors());
// let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];  // to allow my site to only link with select sites.
// app.use(cors({
//   origin: (origin, callback) => {
//     if(!origin) return callback(null, true);
//    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
//       let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
//       return callback(new Error(message ), false);
//     }
//     return callback(null, true);
//   }
// }));
let Auth = require('./Auth')(app); // linking auth file and making it required
const passport = require('passport');  // linking passport file and making it required
require('./passport');

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to Cinemachannel!');
});
// Add new user
app.post('/users',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = users.hashPassword(req.body.Password);
    users.findOne({ Username: req.body.Username }) // searchs to see if a select username already exist.
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + " " + 'already exists');
        } else {
          users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user) })
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
// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});
// Remove a movie from a user's list of favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.MovieID }
  },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});
// Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//Update user information
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  users.findOneAndUpdate({ Username: req.params.Username }, {
    $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthdate: req.body.Birthdate
    }
  },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});
//Get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// gets genre by name
app.get('/genre/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  genres.findOne({ ".Name": req.params.Name })
    .then((genre) => {
      res.status(201).json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// Gets a director by name
app.get('/director/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  directors.findOne({ ".Name": req.params.Name })
    .then((director) => {
      res.status(201).json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// Get movies by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// Gets all directors
app.get("/director", passport.authenticate('jwt', { session: false }), (req, res) => {
  directors.find()
    .then((director) => {
      res.json(director.Name);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
