const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');

const app = express();

// Create a write stream (in appen mode)
// A "log.txt" file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

let Favshows = [
    {
        title: 'Naruto',
        genre: 'Adventure, Fantasy, Comedy, Martial arts',
        total_episodes: '220'
    },
    {
        title: 'Sword Art Online: Alicization',
        genre: 'Adventure, Science fiction',
        total_episodes: '24'
    },
    {
        title: 'Supernatural',
        genre: 'Action, Adventure, Drama, Fantasy, Horror',
        total_episodes: '320'
    },
    {
        title: 'Naruto Shippuuden',
        genre: 'Adventure, Fantasy, Comedy, Martial arts',
        total_episodes: '500'
    },
    {
        title: 'Demon Slayer',
        genre: 'Adventure, Dark fantasy, Martial arts',
        total_episodes: '26 Currently'
    },
    {
        title: 'Baki the Grappler',
        genre: 'Martial arts',
        total_episodes: '39 Currently'
    },
    {
        title: 'Hunter X Hunter',
        genre: 'Adventure, Fantasy, Martial arts',
        total_episodes: '62'
    },
    {
        title: 'One Piece',
        genre: 'Adventure, fantasy',
        total_episodes: '1014'
    },
    {
        title: 'Jujutsu kaisen',
        genre: 'Adventure fiction, Dark fantasy, Supernatural fiction',
        total_episodes: '24'
    },
    {
        title: 'Banshee',
        genre: 'Action; Drama; Crime thriller',
        total_episodes: '38'
    },
    {
        title: 'Prison break',
        genre: 'Serial drama, Crime drama, Action thriller',
        total_episodes: '90'
    },
];

// Get requests
app.get('/', (req, res) => {
    res.send('Cinema channel coming soon!');
});

app.get('/Favshows', (req, res) => {
    res.json(Favshows);
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