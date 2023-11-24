preloaderButton.addEventListener('click', async () => {
  await processingLoad(false);
});

campoBrinco.addEventListener('blur', async () => {
  await getBrinco(campoBrinco.value);
});
campoBrinco.addEventListener('input', async () => {
  campoBrinco.value = campoBrinco.value.toUpperCase();
});
campoBrinco.addEventListener('keydown', async (event) => {
  if (event.keyCode === 13 || event.keyCode === 9) {
    event.preventDefault();
    campoBrinco.blur();
  }
});

campoRaca.addEventListener('input', async () => {
  campoRaca.value = campoRaca.value.toUpperCase();
});

campoLote.addEventListener('input', async () => {
  campoLote.value = campoLote.value.toUpperCase();
});

campoPasto.addEventListener('input', async () => {
  campoPasto.value = campoPasto.value.toUpperCase();
});

campoPeso.addEventListener('input', async () => { await validarCampoPesagem(campoPeso); });
campoPeso.addEventListener('keydown', async (event) => {
  if (event.keyCode == 13 && !document.querySelector('#botao-pesquisar').disabled) {
    event.preventDefault();
    document.querySelector('#botao-pesquisar').focus();
  }
});

btnPesagem.addEventListener('keydown', async (event) => {
  if (event.keyCode == 13 && !document.querySelector('#botao-pesquisar').disabled) {
    event.preventDefault();
    upsertPesagem();
  }
});
btnPesagem.addEventListener('click', async (event) => {
  upsertPesagem();
});

document.addEventListener('DOMContentLoaded', async () => {
  const res = await listFields('gadopesagem');

  if (res !== false || res !== 'false') {
    for (const field in res) {
      const select = document.getElementById(`campo-${field}-pesagem-gado`);

      for (const item of res[field]) {
        //console.log(item.dataValues);
        const data = item.dataValues;
        const option = document.createElement('option');

        option.value = data[Object.keys(data)[0]];
        option.text = `${data[Object.keys(data)[0]]} - ${data[Object.keys(data)[1]]}`;
        
        select.appendChild(option);
      }
    }
  } else {
    console.error(`Erro ao carregar opções para as caixa de seleção.`);
  }

  campoBrinco.focus();
});
