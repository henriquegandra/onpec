require('dotenv').config();
const { app, BrowserWindow, ipcMain, Menu, nativeTheme } = require('electron');
const path = require('path');
const menu = require('./backend/menu');
const sequelize = require('./base/db');

const { calls } = require('./backend/api');
const { winPrincipal, winSplash } = require('./backend/model/WindowsModel');
const { init } = require('./backend/init');
const { handleSquirrelEvent } = require('./squirelEvent');

// === Definições Gerais
const rootPath = path.resolve(__dirname);
const rootMode = `${process.env.ONPEC_MODE}` || 'prod';

const url = (rootMode.includes('prod'))
  ? 'http://on.roncador.com.br:7117'
  : 'http://on.roncador.com.br:5115';
  
if (rootMode.includes('dev')) {

  console.log('================================');
  console.log(process.env.NODE_ENV);
  console.log(url);
  console.log('================================');
}

let win = null;

calls();

const createWindow = () => {
  nativeTheme.themeSource = 'dark';
  Menu.setApplicationMenu(menu);
  win = new BrowserWindow(winPrincipal);

  app.on('before-quit', async () => {
    await sequelize.close();
    console.log('Conexão com o banco de dados fechada.');
  });
}

app.whenReady().then(() => {
  const splash = new BrowserWindow(winSplash);
  splash.setProgressBar(0);

  splash.setIcon(path.join(rootPath, 'src/img/logo.ico'));
  splash.once('show', async () => {
    createWindow();

    win.once('ready-to-show', async () => {
      try {
        const initialization = await init(splash, rootPath);

        if (initialization === true) {
          win.show();
          splash.destroy();
        }

        if (initialization === null){
          // Fechar a aplicação se o banco de dados local não inicializar
          app.quit();
        }
        
      } catch(error) {
        console.log(error);
      }
    })

    win.setIcon(path.join(rootPath, 'src/img/logo.ico'));
    win.setBackgroundColor('rgba(0, 0, 0, 0)');
    win.loadFile(path.join(rootPath, 'src/index.html'));
  })

  splash.loadURL(path.join(rootPath, 'src/loading.html'));
  splash.show();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})

app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') app.quit();
})

if (handleSquirrelEvent(app)) { return }

ipcMain.handle('app-ready', async () => {
  return new Promise(resolve => {
    app.whenReady().then(resolve);
  });
});
