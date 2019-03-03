// discoverMovie.js
const axios = require('axios');
const config = require('./config.js');

function discoverMovie(kind, genreId, language) {
  return axios.get(`https://api.themoviedb.org/3/discover/${kind}`, {
    params: {
      api_key: config.MOVIEDB_TOKEN,
      sort_by: 'popularity.desc',
      include_adult: false,
      with_genres: genreId,
      with_original_language: language,
    },
  }).then(results => {
    if (results.data.total_results === 0) {
      return [{
        type: 'quickReplies',
        content: {
          title: 'Sorry, but I could not find any results for your request :(',
          buttons: [{ title: 'Start over', value: 'Start over' }],
        },
      }];
    }
    const cards = results.data.results.slice(0, 10).map(movie => ({
      title: movie.title || movie.name,
      subtitle: movie.overview,
      imageUrl: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
      buttons: [
        {
          type: 'web_url',
          value: `https://www.themoviedb.org/movie/${movie.id}`,
          title: 'View More',
        },
      ],
    }));
    return [
      {
        type: 'text',
        content: "Here's what I found for you!",
      },
      { type: 'carousel', content: cards },
    ];
  })
  .catch((err) => {
    console.error('movieApi::discoverMovie error: ', err)
    return [{
      type: 'text',
      content: 'Sorry, but I could not find any results for your request :('
    }];
  });  ;
}

module.exports = discoverMovie;