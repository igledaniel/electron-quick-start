const { ipcRenderer } = require('electron');
const settings = require('electron-settings');
const search = require('./mapzen-util/src/js/mapzenSearch');
const whosonfirst = require('./mapzen-util/src/js/whosonfirst');

let map;
let highlight;

// let main process know that you're interested in key update events
ipcRenderer.send('waiting_for_key_updates');
// listen for key update event and refresh the map and avatar
ipcRenderer.on('api_key_updated', updateKey);

function showUserProfile() {
  // this is how you get the user profile window to be created and shown
  ipcRenderer.send('user');
}

/**
 * Update the avatar and map using new user information
 */
function updateKey() {
  initUserAvatar();
  initMap();
}

// if you have a user avatar on this page, this will bring up the user profile window
// when avatar is clicked on
function initUserAvatar() {
  const defaultAvatar = './mapzen-util/public/img/mapzen-logo.png';
  document.getElementById('user-avatar').src =  settings.get('user_avatar') || defaultAvatar;
  document.getElementById('user-avatar').addEventListener('click', showUserProfile);
}

// handle window loading event
document.getElementById('body').onload = function () {
  console.log('good news: index window is loading!');  

  // if we don't have an avatar, show the user profile for login
  // and wait for the api_key_updated event to come through
  if (!settings.get('user_avatar')) {
    return showUserProfile();
  }

  updateKey();
};

function initMap() {
  // clear map if previously existed
  if (map) {
    // if previous highlight was drawn, remove it
    if (highlight) {
      map.removeLayer(highlight);
      highlight = null;
    }
    document.getElementById('map-container').innerHTML = '<div id="map"></div>';    
  }  

  // Add a Mapzen API key
  L.Mapzen.apiKey = settings.get('current_api_key');
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
    api_key: settings.get('current_api_key'),
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

      addToMap(results.features[0], region);
    });
  });
}

// Draw the polygon(s) in the given geojson on the map.
function addToMap(searchResult, wofResult) {
  // if previous highlight was drawn, remove it
  if (highlight) {
    map.removeLayer(highlight);
  }

  highlight = L.geoJson(wofResult, {
    style: function (feature) {
      return {
        weight: 1,
        color: 'purple',
        opacity: '0.7'
      };
    }
  }).addTo(map);
  
  highlight.bindPopup(searchResult.properties.label).openPopup();
}