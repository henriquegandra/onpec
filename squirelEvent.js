const ChildProcess = require('child_process');
const path = require('path');
const appFolder = path.resolve(process.execPath, '..');
const rootAtomFolder = path.resolve(appFolder, '..');
const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
const exeName = path.basename(process.execPath);

const handleSquirrelEvent = (application) => {
  if (process.argv.length === 1) {
    return false;
  }

  const spawn = (command, args) => {
    let spawnedProcess, error;
    try {
      spawnedProcess = ChildProcess.spawn(command, args, {
          detached: true
      });
    } catch (error) {}
    return spawnedProcess;
  }

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  }

  const squirrelEvent = process.argv[1];

  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      spawnUpdate(['--createShortcut', exeName]);
      setTimeout(application.quit, 1000);
      return true;
    case '--squirrel-uninstall':
      spawnUpdate(['--removeShortcut', exeName]);
      setTimeout(application.quit, 1000);
      return true;
    case '--squirrel-obsolete':
      application.quit();
      return true;
  }
}

module.exports = { handleSquirrelEvent };
