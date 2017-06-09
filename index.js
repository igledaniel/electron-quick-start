const { ipcRenderer } = require('electron');
const settings = require('electron-settings');
const config = require('./config.json');

let map;


if (config.auth) {
  // let main process know that you're interested in key update events
  ipcRenderer.send('waiting_for_key_updates');
  // listen for key update event and refresh the map and avatar
  ipcRenderer.on('api_key_updated', updateKey);
}

// handle window loading event
document.getElementById('body').onload = function () {

  // if we don't have an avatar, show the user profile for login
  // and wait for the api_key_updated event to come through
  if (!settings.get('user_avatar')) {
    return showUserProfile();
  }

  updateKey();
};

function showUserProfile() {
  // this is how you get the user profile window to be created and shown
  ipcRenderer.send('user');
}

/**
 * Update the avatar and map using new user information
 */
function updateKey() {
  setupUserAvatar();
  initMap();
}

// if you have a user avatar on this page, this will bring up the user profile window
// when avatar is clicked on
function setupUserAvatar() {
  const defaultAvatar = './mapzen-util/public/img/mapzen-logo.png';

  document.getElementById('user-avatar').src =  settings.get('user_avatar') || defaultAvatar;

  document.getElementById('user-avatar').addEventListener('click', showUserProfile);
}
 
function initMap() {
  // clear map if previously existed
  if (map) {
    document.getElementById('map-container').innerHTML = '<div id="map"></div>';
  }  

  // Add a Mapzen API key
  L.Mapzen.apiKey = settings.get('current_api_key');
  map = L.Mapzen.map('map', { maxZoom: 18, minZoom: 2 });
  
  // Set the center of the map to be the San Francisco Bay Area at zoom level 12
  map.setView([0, 0], 2);

  var geocoder = L.Mapzen.geocoder();
  geocoder.addTo(map);
}