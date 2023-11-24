(async () => {

  const { ipcRenderer } = require('electron');
  const os = require('os');
  const username = os.userInfo().username;
  const computerName = os.hostname();
  const name = username.split('.');
  const chrome = process.versions['chrome'];
  const node = process.versions['node'];
  const e = process.versions['electron'];

  console.log('Versoes: ' + chrome, node, e);
  
  window.addEventListener('DOMContentLoaded', async () => {
    
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector);
      if (element) element.innerText = text;
    }

    replaceText('usuario', username);
    replaceText('maquina', computerName);
    replaceText('nomeusuario', `${name[0]} ${name[1]}`);
    replaceText('nomemaquina', computerName);
    replaceText('chrome', chrome);
    replaceText('node', node);
    replaceText('electron', e);

    await ipcRenderer.invoke('app-ready');
  });
})();
