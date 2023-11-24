const app = require('electron').app;

const checkMode = async () => {
  if (
    process.env.NODE_ENV === undefined ||
    process.env.NODE_ENV === false ||
    process.env.NODE_ENV === null ||
    `${process.env.NODE_ENV}` !== 'dev'
  ) {
    return { mode: 'PROD', path: app.getAppPath() };
  } else {
    return { mode: 'dev', path: app.getAppPath() };
  }
}

module.exports = checkMode;
