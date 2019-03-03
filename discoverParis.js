// discoverParis.js
const axios = require('axios');
const config = require('./config.js');

function discoverParis(genreId, tagId) {
  return axios.get(`https://api.paris.fr/api/data/2.2/QueFaire/get_events/`, {
    params: {
      token: config.PARISDB_TOKEN,
      categories: genreId,
      tags: tagId,
      start: '0',
      end: '0',
      offset: '0',
      limit: '10',
    },
  }).then(results => {
    if (results.data.length === 0) {
      return [{
        type: 'text',
        content: 'Sorry, but I could not find any results for your request :('
      }];
    }
    const cards = {
        elements: results.data.data.map(activity => ({
            title: activity.title || activity.name,
            subtitle: activity.leadText,
            imageUrl: activity.image.url,
            buttons: [
                {
                    type: 'web_url',
                    value: activity.shortenedUrl,
                    title: 'View More',
                },
            ],
        })),
        buttons: [{
            title: 'Other',
            type: 'web_url',
            value: 'https://quefaire.paris.fr/'
        }]
      };
    return [
      {
        type: 'text',
        content: "Here's what I found for you!",
      },
      { type: 'list', content: cards },
    ];
  })
  .catch((err) => {
    console.error('movieApi::discoverParis error: ', err)
    return [{
      type: 'text',
      content: 'Sorry, but I could not find any results for your request :('
    }];
  });
  ;
}

module.exports = discoverParis;