console.log('this is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};
exports.OMDB = {
  id: process.env.OMDB_ID,
};
exports.bandsintown = {
  id: process.env.bandsintown_ID,
};