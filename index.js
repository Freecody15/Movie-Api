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

mongoose.connect('mongodb://localhost:27017/Cinemachannel', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(morgan('common'));

let Auth = require('./Auth')(app); // linking auth file and making it required
const passport = require('passport');  // linking passport file and making it required
require('./passport');

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to Cinemachannel!');
});
// Add new user
app.post('/users', (req, res) => {
  users.findOne({ name: req.body.name })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.name + 'already exists');
      } else {
        users
          .create({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            birthday: req.body.birthday
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
app.post('/users/:name/movies/:MovieID', (req, res) => {
  users.findOneAndUpdate({ name: req.body.name }, {
    $push: { favoriteMovies: req.body.MovieID }
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
// Remove a movie to a user's list of favorites
app.delete('/users/:name/movies/:MovieID', (req, res) => {
  users.findOneAndUpdate({ name: req.params.name }, {
    $pull: { favoriteMovies: req.params.MovieID }
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
app.get('/users', (req, res) => {
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
app.get('/users/:Username', (req, res) => {
  users.findOne({ name: req.params.name })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//Update user information
app.put('/users/:Username', (req, res) => {
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
app.get('/genre/:name', (req, res) => {
  genres.findOne({ ".name": req.params.name })
    .then((genre) => {
      res.status(201).json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// Gets a director by name
app.get('/director/:name', (req, res) => {
  directors.findOne({ ".name": req.params.name })
    .then((director) => {
      res.status(201).json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// Get movies by title
app.get('/movies/:Title', (req, res) => {
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
app.get("/director", (req, res) => {
  directors.find()
    .then((director) => {
      res.json(director.name);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// Delete a user by username
app.delete('/users/:name', (req, res) => {
  users.findOneAndRemove({ name: req.params.name })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.name + ' was not found');
      } else {
        res.status(200).send(req.params.name + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
