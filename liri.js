// load environment
require("dotenv").config();

// load keys
var keys = require("./keys.js");
//console.log(keys.spotify);

// usage
let usage = "Usage: node liri.js [concert-this|spotify-this-song|movie-this] search_item \n or node liri.js do-what-it-ways";

// Liri commands
liriCommands = {
    // concert-this
    "concert-this": (argList) => {
        if (argList.length < 4) {
            console.log("Need more arguments. \n" + usage);
        } else {
            artistName = "";
            for (let i = 3; i < argList.length-1; i++) {
                artistName += (argList[i] + " ");
            }
            artistName += argList[argList.length-1];
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
            console.log("spotify-this-song: " + argList[3]);
        }
    },

    // movie-this
    "movie-this": (argList) => {
        if (argList.length < 4) {
            console.log("Need more arguments. \n" + usage);
        } else {
            console.log("movie-this: " + argList[3]);
        }
    },

    // do-what-it-says
    "do-what-it-says": (argList) => {
        // ignore whatever after "do-what-it-ways" command
        console.log("do-what-it-says: " + argList[3]);
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
