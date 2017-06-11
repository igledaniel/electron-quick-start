const { ipcRenderer } = require('electron');
const settings = require('electron-settings');
const mapzenSearch = require('./mapzen-util/src/js/mapzenSearch');

const api_key = 'mapzen-fepXwQF';

let map;
let search;

// handle window loading event
document.getElementById('body').onload = function () {
  console.log('good news: index window is loading!');  

  initMap();
};

function initMap() {
  // Add a Mapzen API key
  L.Mapzen.apiKey = api_key;
  map = L.Mapzen.map('map', { maxZoom: 18, minZoom: 2 });
  
  // Set the center of the map to be the San Francisco Bay Area at zoom level 12
  map.setView([40, -90], 4);

  var geocoder = L.Mapzen.geocoder();
  geocoder.addTo(map);

  addClickHandler();
}

// Add click event handling to perform the reverse geocoding and draw the results on the map.
function addClickHandler() {
  map.on('click', function (e) {

    // configuration for the reverse geocoding query
    const reverseOptions = {
      host: config.search.host,
      api_key: api_key,
      endpoint: 'reverse',
      params: {
        "point.lat": e.latlng.lat,
        "point.lon": e.latlng.lng,
        "layers": "region"
      }
    };

    // query mapzen search asynchronously and handle results as desired
    mapzenSearch(reverseOptions, (err, results) => {
      console.log('search results', results);
    });
  });
}