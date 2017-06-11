const { ipcRenderer } = require('electron');
const settings = require('electron-settings');
const search = require('./mapzen-util/src/js/mapzenSearch');
const whosonfirst = require('./mapzen-util/src/js/whosonfirst');

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

  addClickHandler();
}

// Add click event handling to perform the reverse geocoding and draw the results on the map.
function addClickHandler() {
  map.on('click', function (e) {
    lookupLocation(e.latlng.lat, e.latlng.lng);
  });
}

function lookupLocation(lat, lng) {
  console.log(lat, lng);

  const options = {
    api_key: api_key,
    endpoint: 'reverse',
    params: {
      'point.lat': lat,
      'point.lon': lng,
      layers: 'region'
    }
  };
  search(options, function (err, results) {
    console.log('reverse geocoding results', results);

    if (results.features.length < 1) {
      console.log('no reverse geocoding results');
      return;
    }    

    const wofOptions = {
      id: results.features[0].properties.source_id
    };
    whosonfirst(wofOptions, function (err, region) {
      console.log('region details', region);
    });
  });
}