// index.js
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config.js');
const discoverMovie = require('./discoverMovie.js');
const discoverParis = require('./discoverParis.js');

const app = express();
app.use(bodyParser.json());

const categoryGenres = [
  {id: 1, name: 'Festivity'},
  {id: 2, name: 'Exhibition'},
  {id: 2, name: 'museum'},
  {id: 3, name: 'Show'},
  {id: 3, name: 'Performance'},
  {id: 4, name: 'Concert'},
  {id: 4, name: 'music'},
  {id: 5, name: 'Entertainment'},
  {id: 6, name: 'Sport'},
  {id: 6, name: 'sport event'},
  {id: 6, name: 'sport contest'},
  {id: 11, name: 'Ball'},
  {id: 15, name: 'Art'},
  {id: 15, name: 'art exhibition'},
  {id: 17, name: 'History'},
  {id: 17, name: 'historical exhibition'},
  {id: 17, name: 'historical'},
  {id: 18, name: 'Sciences'},
  {id: 18, name: 'science exhibition'},
  {id: 20, name: 'Theatre'},
  {id: 21, name: 'Dance'},
  {id: 22, name: 'Humour'},
  {id: 22, name: 'laugh'},
  {id: 22, name: 'stand-up'},
  {id: 26, name: 'Classic'},
  {id: 27, name: 'Rock'},
  {id: 28, name: 'Jazz'},
  {id: 31, name: 'World'},
  {id: 32, name: 'Hip-Hop'},
  {id: 35, name: 'Workshop'},
  {id: 37, name: 'Conference'},
  {id: 38, name: 'Promenade'},
  {id: 39, name: 'Leisure'},
];

const tags = [
  {id: 1, name: 'Child'},
  {id: 2, name: 'Family'},
  {id: 3, name: 'Sport'},
  {id: 4, name: 'Open air'},
  {id: 4, name: 'air'},
  {id: 4, name: 'openair'},
  {id: 6, name: 'Expo'},
  {id: 8, name: 'Music'},
  {id: 12, name: 'English'},
  {id: 13, name: 'Teenager'},
  {id: 13, name: 'Teenagers'},
];

const movieGenres = [
    { id: 12, name: 'Adventure' },
    { id: 14, name: 'Fantasy' },
    { id: 16, name: 'Animated' },
    { id: 16, name: 'Animation' },
    { id: 18, name: 'Drama' },
    { id: 27, name: 'Horror' },
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 36, name: 'History' },
    { id: 37, name: 'Western' },
    { id: 53, name: 'Thriller' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 878, name: 'SF' },
    { id: 878, name: 'Sci Fi' },
    { id: 878, name: 'Sci-Fi' },
    { id: 878, name: 'Science Fiction' },
    { id: 9648, name: 'Mystery' },
    { id: 10402, name: 'Music' },
    { id: 10749, name: 'Romance' },
    { id: 10749, name: 'Romantic' },
    { id: 10751, name: 'Family' },
    { id: 10752, name: 'War' },
    { id: 10770, name: 'TV Movie' },
  ];
  
  // Find the moviedb id of a genre entity
  function getGenreId(genre, tab) {
    const row = tab.find(function(elem) {
      return elem.name.toLowerCase() === genre.toLowerCase();
    });
  
    if (row) {
      return row.id;
    }
    return null;
  }

// Recast will send a post request to /errors to notify important errors
// described in a json body
app.post('/errors', (req, res) => {
   console.error(req.body);
   res.sendStatus(200); 
});

app.post('/discover-movies', (req, res) => {
  console.log('[POST] /discover-movies');
  const memory = req.body.conversation.memory;
  const movie = memory.movie;
  const tv = memory.tv;
  const kind = movie ? 'movie' : 'tv';
  const genre = memory.genre;
  const genreId = getGenreId(genre.value, movieGenres);
  const language = memory.language;
  const nationality = memory.nationality;
  const isoCode = language
    ? language.short.toLowerCase()
    : nationality.short.toLowerCase();

  return discoverMovie(kind, genreId, isoCode)
    .then((carouselle) => res.json({
      replies: carouselle,
    }
  ))
  .catch((err) => console.error('movieApi::discoverMovie error: ', err));
  return [{
    type: 'text',
    content: 'Sorry, but I could not find any results for your request :('
  }];

});

function correct_tag(tag, genreId){
  let   tagIdtmp = getGenreId(tag.value, tags);
  
  if (genreId == 4 || (genreId >= 26 && genreId <= 32))
    tagIdtmp = 8;
  if (genreId == 6)
    tagIdtmp = 3;
  return (tagIdtmp);
}

app.post('/discover-paris', (req, res) => {
  console.log('[POST] /discover-paris');
  const memory = req.body.conversation.memory;
  const category = memory.category;
  const tag = memory.tag;
  const genreId = getGenreId(category.value, categoryGenres);
  const tagId = correct_tag(tag, genreId);

  return discoverParis(genreId, tagId)
  .then((list) => res.json({
      replies: list,
    }
  ))
  .catch((err) => console.error('movieApi::discoverParis error: ', err));
  return [{
    type: 'text',
    content: 'Sorry, but I could not find any results for your request :('
  }];
});

app.listen(config.PORT, () => console.log(`App started on port ${config.PORT}`));


// http://maps.google.co.uk/maps?q=X,Y