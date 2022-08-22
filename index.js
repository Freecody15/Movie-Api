const express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    uuid = require('uuid'),
    path = require('path');

const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Director = Models.Director;

mongoose.connect('mongodb://localhost:27017/Cinemachannel', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(morgan("common"));
// log requests to server
app.use(bodyParser.json());




// Create a write stream (in appen mode)
// A "log.txt" file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

let User = [
    {
        "id": "1",
        "name": "John",
        "favouritemovie": []
    },
    {
        "id": "2",
        "name": "Doe",
        "favouritemovies": ['Naruto']
    }
]

let Movie = [
    {
        "Title": "Prison Break",
        "Description": "#",
        "Director": {
            "name": "#",
            "Birth Year": "#",
            "Bio": "#"
        },
        "Genre": {
            "Name": "Serial drama, Crime drama, Action thriller",
            "Description": "#",
            "Total Episodes": "90"
        }
    },

    {
        "Title": "Banshee",
        "Description": "#",
        "Director": {
            "name": "#",
            "Birth Year": "#",
            "Bio": "#"
        },
        "Genre": {
            "Name": "Action, Drama, Crime thriller",
            "Description": "#",
            "Total Episodes": "38"
        }
    },

    {
        "Title": "Jujutsu kaisen",
        "Description": "#",
        "Director": {
            "name": "#",
            "Birth Year": "#",
            "Bio": "#"
        },
        "Genre": {
            "Name": "Adventure fiction, Dark fantasy, Supernatural fiction",
            "Description": "#",
            "Total Episodes": "24"
        }
    },

    {
        "Title": "One Piece",
        "Description": "#",
        "Director": {
            "name": "#",
            "Birth Year": "#",
            "Bio": "#"
        },
        "Genre": {
            "Name": "Adventure, fantasy",
            "Description": "#",
            "Total Episodes": "1014"
        }
    },

    {
        "Title": "Hunter X Hunter",
        "Description": "#",
        "Director": {
            "name": "#",
            "Birth Year": "#",
            "Bio": "#"
        },
        "Genre": {
            "Name": "Adventure, Fantasy, Martial arts",
            "Description": "#",
            "Total Episodes": "62"
        }
    },

    {
        "Title": "Baki the Grappler",
        "Description": "#",
        "Director": {
            "name": "#",
            "Birth Year": "#",
            "Bio": "#"
        },
        "Genre": {
            "Name": "Martial arts",
            "Description": "#",
            "Total Episodes": "39 Current"
        }
    },

    {
        "Title": "Demon Slayer",
        "Decription": "#",
        "Director": {
            "name": "#",
            "Birth Year": "#",
            "Bio": "#"
        },
        "Genre": {
            "Name": "Drama",
            "Description": "#",
            "Total Episodes": "26 Current"
        }
    },

    {
        "Title": "Naruto Shippuuden",
        "Decription": "#",
        "Director": {
            "name": "#",
            "Birth Year": "#",
            "Bio": "#"
        },
        "Genre": {
            "Name": "Adventure, Fantasy, Comedy, Martial arts",
            "Description": "#",
            "Total Episodes": "500"
        }
    },

    {
        "Title": "Supernatural",
        "Decription": "#",
        "Director": {
            "name": "#",
            "Birth Year": "#",
            "Bio": "#"
        },
        "Genre": {
            "Name": "Action, Adventure, Drama, Fantasy, Horror",
            "Description": "#",
            "Total Episodes": "320"
        }
    },

    {
        "Title": "Sword Art Online: Alicization",
        "Description": "#",
        "Director": {
            "name": "#",
            "Birth Year": "#",
            "Bio": "#"
        },
        "Genre": {
            "Name": "Adventure, Science fiction",
            "Description": "#",
            "Total Episodes": "24"
        }
    },

    {
        "Title": "Naruto",
        "Description": "Naruto is a ninja-in-training whose wild antics amuse his teammates. But he's completely serious about one thing: becoming the world's greatest ninja! As the battle against the Tailed Beast-targeting Akatsuki rages on, the heroic sibling battle between Sasuke and Itachi eventually concludes..",
        "Director": {
            "name": "Hayato Date",
            "Birth Year": "1962",
            "Bio": "Hayato Date, born May 22, 1962) is a Japanese animation director most known for the anime adaptations of Saiyuki and Naruto."
        },
        "Genre": {
            "Name": "Adventure, Fantasy, Comedy, Martial arts",
            "Description": "Naruto is a ninja-in-training whose wild antics amuse his teammates. But he's completely serious about one thing: becoming the world's greatest ninja! As the battle against the Tailed Beast-targeting Akatsuki rages on, the heroic sibling battle between Sasuke and Itachi eventually concludes.  ",
            "Total Episodes": "220"
        }
    }
];

//Read all movies
app.get('/movies', (req, res) => {
    Movies.find()
        .than((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console, error(err);
            res.status(500).send("Error: " + err);
        });
});
// gets all users
app.get('/users', function (req, res) {
    Users.find()
        .than(function (users) {
            res.status(201).json(users);
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});
//Read specific movie
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movies = .find(movies => movies.Title === title)

    if (movies) {
        res.status(200).json(movies);
    } else {
        res.status(400).send("No such movies");
    }

});

//Read genre
app.get('//genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = .find(movies => movies.Genre.Name === genreName).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send("No such genre movies");
    }

});

//Read director details
app.get('//directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const directors = .find(movies => movies.Director.name === directorName).Director;

    if (directors) {
        res.status(200).json(directors);
    } else {
        res.status(400).send("No such directors");
    }

});

//create new user
app.post('/users', (req, res) => {
    const newUser = req.body;
    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send("users need name");
    }
});

//update user
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id);
    if (user) {
        user.name = updatedUser;
        res.status(200).json(user);
    } else {
        res.status(400).send("No such user")
    }
});

//post - add movies to favoritemovies list
app.post('/users/:id/:moviesTitle', (req, res) => {
    const { id, moviesTitle } = req.params;

    let user = users.find(user => user.id == id);
    if (user) {
        user.favouritemoviess.push(moviesTitle);
        res.status(200).send(`${moviesTitle} has been added to user ${id}'s array`);
    } else {
        res.status(400).send("No such user");
    }
})

//Delete movies from user's favoritemovies list
app.delete('/users/:id/:moviesTitle', (req, res) => {
    const { id, moviesTitle } = req.params;

    let user = users.find(user => user.id == id);
    if (user) {
        user.favouritemoviess = user.favouritemoviess.filter(title => title !== moviesTitle);
        res.status(200).send(`${moviesTitle} has been removed from user ${id}'s array`);
    } else {
        res.status(400).send("No such user");
    }
});

//Delete user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find(user => user.id == id);
    if (user) {
        users = users.filter(user => user.id !== id);
        res.status(200).send(`user email with ${id} is removed`);
    } else {
        res.status(400).send("No such user");
    }
});

// Get requests
app.get('/', (req, res) => {
    res.send('Welcome to Cinema channel');
});

app.get('/movies', (req, res) => {
    Movies.find()
        .than((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console, error(err);
            res.status(500).send("Error: " + err);
        });
});

// Setup the logger middleware
app.use(morgan('combined', { stream: accessLogStream }));

// Sends static files to log.txt
app.use(express.static('public'));

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Listen for requests
app.listen(8080, () => {
    console.log("I'm running!");
});