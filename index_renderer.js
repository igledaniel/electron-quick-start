const { ipcRenderer } = require('electron');
const settings = require('electron-settings');

// handle window loading event
document.getElementById('body').onload = function () {
  console.log('good news: index window is loading!');
};
