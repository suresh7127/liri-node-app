
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

var type = process.argv[2];
var term = process.argv.slice(3).join(" ");

function findConcerts(search) {
  console.log("Finding your concerts...");
  // default ACL
  if (!search) {
    search = "ACL"
  };

  var queryURL = "https://rest.bandsintown.com/artists/" + search + "/events?apikey=trilogy";

  axios({
    method: 'get',
    url: queryURL
  })
    .then(function (res) {
      console.log("=========NEW SHOW LIST=========\n");
      console.log(`Catch ${search} at: \n`);
      for (var i = 0; i < res.data.length; i++) {
        var venue = res.data[i].venue.name;
        var location = res.data[i].venue.city + ", " + res.data[i].venue.region;
        var date = moment(res.data[i].datetime).format("MMMM DD, YYYY");
        console.log(`${venue} in ${location} on ${date}`);
      }
      console.log("\n===============================");
    });
}

function findSongs(search) {
  console.log("Finding your song...");
  // default The Sign
  if (!search) {
    search = "The Sign, Ace of Base";
  }

  spotify.search({
    type: 'track',
    query: search
  },
    function (err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
      var track = data.tracks.items[0].name;
      var artist = data.tracks.items[0].album.artists[0].name;
      var album = data.tracks.items[0].album.name;
      var preview = data.tracks.items[0].preview_url;
      console.log("=========NEW SONG=========\n");
      console.log(`Check out "${track}" off of the album '${album}' by '${artist}' here: ${preview}`);
      console.log("\n==========================");
    });
}

function findMovies(search) {
  console.log("Finding your movie...");

  if (!search) {
    search = "Mr. Nobody";
  };

  var queryURL = "https://www.omdbapi.com/?apikey=6bb89f2b&t=" + search;

  axios({
    method: 'get',
    url: queryURL
  })
    .then(function (res) {
      var title = res.data.Title;
      var year = res.data.Year;
      var imdb = res.data.Ratings[0].Value;
      var rotten = res.data.Ratings[1].Value;
      var country = res.data.Country;
      var language = res.data.Language;
      var plot = res.data.Plot;
      var actors = res.data.Actors;
      console.log("=========NEW MOVIE=========\n");
      console.log(`${title} (${year}): ${plot}. \nThe film was produced in ${country} and available in ${language}. Rated ${imdb} on IMDB and ${rotten} on Rotten Tomatoes. \nStarring: ${actors}. `)
      console.log("\n===========================");
    });
}


if (type === "concert-this") {
  findConcerts(term);

} else if (type === "spotify-this-song") {
  findSongs(term);

} else if (type === "movie-this") {
  findMovies(term);

} else if (type === "do-what-it-says") {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    };

    var dataArr = data.split(",");
    var dataAction = dataArr[0];
    var dataTerm = dataArr[1]
    if (dataAction === "concert-this") {
      findConcerts(dataTerm);
    } else if (dataAction === "spotify-this-song") {
      findSongs(dataTerm);
    } else if (dataAction === "movie-this") {
      findMovies(dataTerm);
    } else {
      console.log("Can't understand that file");
    }
  });
}
else {
  console.log('concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says')
};