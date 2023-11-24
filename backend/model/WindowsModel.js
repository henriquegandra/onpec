const app = require('electron').app;
const path = require('path');
const rootPath = app.getAppPath();

const winPrincipal = {
  show: false,
  width: 1600,
  minWidth: 480,
  height: 900,
  minHeight: 480,
  titleBarOverlay: {
    color: '#2f3241',
    symbolColor: '#74b1be',
    height: 40,
  },
  webPreferences: {
    sandbox: false,
    preload: path.join(rootPath, './splash.js'),
    nodeIntegration: true,
    contextIsolation: false,
    enableRemoteModule: true,
    devTools: true
  }
};

const winSplash = {
  width: 880,
  minWidth: 580,
  height: 480,
  transparent: true,
  autoHideMenuBar: true,
  show: false,
  frame: false,
  resizable: false,
  alwaysOnTop: false,
  webPreferences: {
    sandbox: false,
    preload: path.join(rootPath, './splash.js'),
    nodeIntegration: true,
    enableRemoteModule: true,
    contextIsolation: false,
    devTools: false
  }
};

module.exports = { winPrincipal, winSplash };
