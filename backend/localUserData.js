const os = require('os');

const localUserData = async () => {
  return {
    dispositivo: `${os.hostname()}`,
    usuario: `${os.userInfo().username}`,
    modulo: 'ON PEC',
  };
}

module.exports = localUserData;
