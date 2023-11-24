const preloader = document.querySelector('.preloader');
const preloaderText = preloader.querySelector('p').textContent
preloader.querySelector('p').style.fontWeight = 'normal';

ipcRenderer.on('logEvent', async (event, log) => {
  preloader.querySelector('p').innerText = log;
})

const syncDados = async () => {
  try {
    preloader.setAttribute('style','z-index:999');
    preloader.classList.add('fade-in');
    preloader.classList.remove('fade-out');

    // Chama o processo principal para sincronizar os dados
    const result = await ipcRenderer.invoke('syncCloud');

    // Se a sincronização foi bem-sucedida, atualize o status na página
    const statusIcon = document.querySelector('#status > i');
    const statusText = document.querySelector('#status > p');

    if (result === true) {
      preloader.querySelector('p').textContent = 'Dados sincronizados com sucesso!';
      await delay(2000);

      statusIcon.style.display = 'block';
      statusText.textContent = 'Concluído';
      
    } else {
      console.log(result);

      statusIcon.style.display = 'none';
      statusText.textContent = 'Erro, verificando conexão . . .';
    }
  } catch (error) {
    console.error('Erro ao sincronizar dados:', error);
    console.log(result);
  }

  preloader.querySelector('p').textContent = preloaderText;
  preloader.classList.add('fade-out');
  preloader.classList.remove('fade-in');
  preloader.removeAttribute('style');
};
