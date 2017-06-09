const { ipcRenderer } = require('electron');
const settings = require('electron-settings');

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
}