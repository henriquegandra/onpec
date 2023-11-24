const processingLoad = async (action, text) => {
  const preloader = document.querySelector('.preloader');
  const preloaderText = preloader.querySelector('p').textContent
  const preloaderButton = preloader.querySelector('button');
  
  switch (action) {
    case true:
      preloader.style.display = '';
      preloader.setAttribute('style','z-index:999');
      preloader.classList.add('fade-in');
      preloader.classList.remove('fade-out');
      preloader.querySelector('p').textContent = 'Enviando informações ...';
      break;
      
    case false:
      preloader.setAttribute('style','z-index:0');
      preloader.classList.add('fade-out');
      preloader.classList.remove('fade-in');
      preloader.querySelector('p').textContent = preloaderText;
      break;

    case null:
      preloader.querySelector('p').textContent = text;
      preloaderButton.style.display = 'block';

    default:
      preloader.querySelector('p').textContent = text;
  }
}
