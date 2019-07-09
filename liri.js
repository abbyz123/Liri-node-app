// load environment
require("dotenv").config();

// load keys
var keys = require("./keys.js");
//console.log(keys.spotify);

// usage
let usage = "Usage: node liri.js [concert-this|spotify-this-song|movie-this] search_item \n or node liri.js do-what-it-ways";

// Build name from arg list
function buildNameFromArgList(argList) {
    nameRes = "";
    for (let i = 3; i < argList.length - 1; i++) {
        nameRes += (argList[i] + " ");
    }
    nameRes += argList[argList.length - 1];

    return nameRes;
}

// Liri commands
liriCommands = {
    // concert-this
    "concert-this": (argList) => {
        if (argList.length < 4) {
            console.log("Need more arguments. \n" + usage);
        } else {
            artistName = buildNameFromArgList(argList);
            console.log("artist name: " + artistName);

            // use axios to call bands-in-town API
            const axios = require('axios');

            axios.get("https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp")
                .then(function (response) {
                    // handle the API response
                    concertInfo = response.data[0];
                    venueName = concertInfo.venue.name;
                    venueLoc = concertInfo.venue.city + ", " + concertInfo.venue.region + ", " + concertInfo.venue.country;
                    datetime = concertInfo.datetime;

                    // output result
                    console.log("venue name: " + venueName);
                    console.log("venue location: " + venueLoc);

                    let moment = require("moment");
                    console.log("concert time: " + moment(datetime).format('MM/DD/YYYY'));
                })
                .catch(function (error) {
                    // handle error
                    console.log("Fail to load concert info. Maybe another artist?")
                })
                .finally(function () {
                    // always executed
                });
        }
    },

    // spotify-this-song
    "spotify-this-song": (argList) => {
        if (argList.length < 4) {
            console.log("Need more arguments. \n" + usage);
        } else {
            songName = buildNameFromArgList(argList);
            console.log("song name: " + songName);

            // call spotify api
            var Spotify = require('node-spotify-api');
            var spotify = new Spotify(keys.spotify);
            //console.log(keys.spotify);

            spotify
                .search({ type: 'track', query: songName, limit: 1 })
                .then(function (response) {
                    songInfo = response.tracks.items[0];
                    console.log('Artist(s): ' + songInfo.artists[0].name);
                    console.log("Song's name: " + songInfo.name);
                    console.log("Preview link: " + songInfo.external_urls.spotify);
                    console.log("Album name: " + songInfo.album.name);
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
    },

    // movie-this
    "movie-this": (argList) => {
        let movieName;
        if (argList.length < 4) {
            console.log("Don't have an idea? Let me give you one.");
            movieName = "Mr. Nobody"
        } else {
            // get movie name from argument list
            movieName = buildNameFromArgList(argList);
        }

        const axios = require('axios');
        axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + movieName)
            .then(function (response) {
                movieInfo = response.data;
                console.log("Title: " + movieInfo.Title);
                console.log("Year: " + movieInfo.Year);
                console.log("IMDB rating: " + movieInfo.imdbRating);
                console.log("Other ratings: ");
                movieInfo.Ratings.forEach(ratingInfo => {
                    console.log(ratingInfo.Source + ": " + ratingInfo.Value);
                });
                console.log("Country: " + movieInfo.Country);
                console.log("Language: " + movieInfo.Language);
                console.log("Plot: " + movieInfo.Plot);
                console.log("Actor(s): " + movieInfo.Actors);
            })
            .catch(function (error) {
                // handle error
                console.log("Fail to load movie info. Maybe another movie?")
            })
            .finally(function () {
                // always executed
            });

    },

    // do-what-it-says
    "do-what-it-says": (argList) => {
        // ignore whatever after "do-what-it-ways" command
        let fs = require('fs');

        fs.readFile('random.txt', 'utf8', (err, data) => {
            if (err) throw err;
            //console.log(data);
            let commandArgs = data.split(",");
            if ("do-what-it-says" === commandArgs[0]) {
                console.log("I don't do what it says!");
            } else if (commandArgs[0] in liriCommands) {
                let argListNew = ["", "", commandArgs[0], commandArgs[1]];
                liriCommands[commandArgs[0]](argListNew);
            } else {
                console.log("random command not recognized.");
            }
        });
    }
};

// main program
argList = process.argv;
if (argList.length < 3) {
    console.log("Not enough arguments. \n" + usage);
} else {
    if (argList[2] in liriCommands) {
        liriCommands[argList[2]](argList);
    } else {
        console.log("Command not recognized. \n" + usage);
    }
}
