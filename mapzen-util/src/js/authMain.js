const path = require('path');
const url = require('url');
const { BrowserWindow } = require('electron');

const settings = require('electron-settings');

const { loadPage } = require('./windowManip');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let authWindow;
let userWindow;

module.exports.init = function init(ipcMain) {
  /**
   * Handles the login event sent from the authentication page
   * Creates new browser window and allows user to authenticate
   *
   * @param {object} event
   * @param {string} url
   */
  ipcMain.on('login', (event, url) => {
    console.log('got a login message')
    authWindow = new BrowserWindow({ width: 800, height: 600 });
    authWindow.on('closed', function () {
      authWindow = null
    });

    authWindow.loadURL(url);
  });

  /**
   * Automatically close the authentication window after a successful callback
   */
  ipcMain.on('login-success', (event) => {
    console.log('closing auth window');
    authWindow.close();
  });

  /**
   * Create user profile window and allow user to select key
   */
  ipcMain.on('user', loadUserProfileWindow);
  
  ipcMain.on('user-success', (event) => {
    console.log('closing user profile window');
    userWindow.close();
  });

  ipcMain.on('waiting_for_key_updates', (waitingEvent) => {
    console.log('waiting on a key update...');  
    
    ipcMain.on('user:api_key_updated', (event) => {
      console.log('api key updated');
      waitingEvent.sender.send('api_key_updated');
    });
  });
};

function loadUserProfileWindow() {
  console.log('received user profile event');
  userWindow = new BrowserWindow({ width: 600, height: 1000 });
  userWindow.on('closed', function () {
    userWindow = null
  });

  loadPage(userWindow, 'user');
}

