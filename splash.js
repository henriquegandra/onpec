(async () => {
    const os = require('os')
    const username = os.userInfo().username
    const computerName = os.hostname()

    const replaceText = (selector, text, version) => {
        const element = document.getElementById(selector);
        version = version.toUpperCase();
        if (element) element.innerText = `${text} ${version}`;
    }

    window.addEventListener('DOMContentLoaded', () => {
        const user = username.split('.');
        
        replaceText('usuario', '', user[0]);
        replaceText('maquina', '', computerName);
    })
})()
