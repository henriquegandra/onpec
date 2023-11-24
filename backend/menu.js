const { app, Menu, BrowserWindow } = require('electron');
const exec = require('child_process').exec;
const rootPath = app.getAppPath();

const urls = {
  home: '/src/index.html',
  pesagemGado: '/src/pesagem-gado.html',
}

const openNewWindow = (ref) => {
  let window = BrowserWindow.getFocusedWindow()
  let url = urls[ref]
  //console.log(url)

  if (
    ref == 'home' ||
    ref == 'pesagemGado'
  ) {
    window.loadURL('file:///' + rootPath + url)
  } else {
    window.loadURL(url)
  }
}

const template = [
  {
    label: 'Arquivo',
    submenu: [
      {
        label: 'Desfazer', accelerator: 'CommandOrControl+Z', role: 'undo',
      },
      {
        label: 'Refazer', accelerator: 'CommandOrControl+Y', role: 'redo',
      },
      {
        type: 'separator'
      },
      {
        label: 'Selecionar Tudo', accelerator: 'CommandOrControl+A', role: 'selectall',
      },
      {
        label: 'Cortar', accelerator: 'CommandOrControl+X', role: 'cut',
      },
      {
        label: 'Copiar', accelerator: 'CommandOrControl+C', role: 'copy',
      },
      {
        label: 'Colar', accelerator: 'CommandOrControl+V', role: 'paste',
      },
      {
        type: 'separator'
      },
      {
        label: 'DevTools', accelerator: 'F12', role: 'toggledevtools'
      },
      {
        label: 'Minimize', accelerator: 'CommandOrControl+M', role: 'minimize',
      },
      {
        label: 'Sair', accelerator: 'CommandOrControl+Q', role: 'quit'
      },
    ]
  },
  {
    label: 'Atualizar',
    submenu: [
      {
        label: 'Atualizar', accelerator: 'F5', role: 'reload',
      },
      {
        label: 'Atualizar (Sem Cache)', accelerator: 'CommandOrControl+F5', role: 'forceReload'
      }
    ],
  },
  {
    label: 'Páginas',
    submenu: [
      {
        label: 'Início',
        click () {
          openNewWindow('home')
        }
      },
      {
        label: 'Pesagem Gado',
        click () {
          openNewWindow('pesagemGado')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Atualizar', accelerator: 'F5', role: 'reload',
      },
      {
        label: 'Atualizar (Sem Cache)', accelerator: 'CommandOrControl+F5', role: 'forceReload'
      }
    ]
  },
]

if (process.platform === 'darwin') {
  const name = 'onPEC'
  template.unshift[{
    label: 'Arquivo',
    submenu: [
      {
        label: 'Desfazer', accelerator: 'Command+Z', role: 'undo',
      },
      {
        label: 'Refazer', accelerator: 'Shift+Command+Z', role: 'redo',
      },
      {
        label: 'Selecionar Tudo', accelerator: 'Command+A', role: 'selectall',
      },
      {
        label: 'Cortar', accelerator: 'Command+X', role: 'cut',
      },
      {
        label: 'Copiar', accelerator: 'Command+C', role: 'copy',
      },
      {
        label: 'Colar', accelerator: 'Command+V', role: 'paste',
      },
      {
        type: 'separator'
      },
      {
        label: 'DevTools', accelerator: 'Command+F12', role: 'toggledevtools'
      },
      {
        label: 'Minimize', accelerator: 'Command+M', role: 'minimize',
      },
      {
        label: `Quit ${name}`, accelerator: 'Command+Q',
        click() {
            app.quit()
        },
      },
    ],
  }]
}

module.exports = Menu.buildFromTemplate(template)
