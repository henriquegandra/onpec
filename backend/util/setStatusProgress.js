const sleep = require("./sleepDelay");

const setStatusProgress = async (mwContent, type, step, message) => {
  mwContent.send(type, { step: step, message: message } );
  await sleep(750);
  return;
}

module.exports = { setStatusProgress };
