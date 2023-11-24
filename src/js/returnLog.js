// ====== Funções de Efeito ======

const fadeIn = async (elemento) => {
  elemento.classList.remove('hide','fade-out');
  elemento.classList.add('fade-in');
}

// FadeOut
const fadeOut = (elemento) => {
  elemento.classList.remove('fade-in');
  elemento.classList.add('fade-out');
  
  setTimeout(function(){
    elemento.classList.add('hide');
  }, 600) // Note that this interval matches the timing of CSS animation
}

// mostrarAviso(logReturn, 'Busca concluída.')

const mostrarAviso = async (elemento, text, temp) => {
  if (text) {
    elemento.innerHTML = text;
  }

  await fadeIn(elemento, 600);
  if (temp) {
    await delay(3000);
    fadeOut(elemento);
  }
}

const esconderAviso = async (elemento) => {
  await fadeOut(elemento, 600);
  elemento.innerHTML = '';
}
