const checkInternet = async () => {
  console.log('Verificando conexão com internet');
  if (document.querySelector('#status > i')) {
    const statusIcon = document.querySelector('#status > i');
    const statusText = document.querySelector('#status > p');

    await setInterval(async () => {
      const result = await ipcRenderer.invoke('getConnStatus');

      if (result) {
        statusIcon.style.display = 'block';
        statusText.style.color = '';
        statusText.style.fontWeight = '';
        statusText.textContent = 'Sincronizar';

        statusNetwork = true;
      } else {
        statusIcon.style.display = 'none';
        statusText.style.color = 'rgb(255, 204, 0)';
        statusText.style.fontWeight = 'bold';
        statusText.textContent = 'Você está offline';

        statusNetwork = false;
      }
    }, 3000); // 5 segundos
  }
}
      
(async () => { await checkInternet() })();
