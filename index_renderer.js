const { ipcRenderer } = require('electron');
const settings = require('electron-settings');
const search = require('./mapzen-util/src/js/mapzenSearch');

const api_key = 'mapzen-fepXwQF';
let map;

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

  map.on('click', function (e) {
    lookupLocation(e.latlng.lat, e.latlng.lng);
  });
}

function lookupLocation(lat, lng) {
  console.log(lat, lng);

  const options = {
    host: 'https://search.mapzen.com',
    api_key: api_key,
    endpoint: 'reverse',
    params: {
      'point.lat': lat,
      'point.lon': lng,
      layers: 'region'
    }
  };
  search(options, function (err, results) {
    console.log(results);
  });
}