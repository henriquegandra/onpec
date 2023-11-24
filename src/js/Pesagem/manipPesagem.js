const manipPesagem = async (dadosBrinco) => {
  const lastBrinco = dadosBrinco[0].dataValues;

  const campoBrinco = document.getElementById('campo-brinco-pesagem-gado');
  const campoSexo = document.getElementById('campo-sexo-pesagem-gado');
  const campoRaca = document.getElementById('campo-raca-pesagem-gado');
  const campoLote = document.getElementById('campo-lote-pesagem-gado');
  const campoPasto = document.getElementById('campo-pasto-pesagem-gado');
  const campoFase = document.getElementById('campo-fase-pesagem-gado');
  const campoNovoPeso = document.getElementById('campo-novo-peso-pesagem-gado');
  const btnPesagem = document.getElementById('botao-pesquisar');
  const divSubmit = document.querySelector('#submit-pesagem-gado');

  campoSexo.value = lastBrinco.sexo;
  campoRaca.value = lastBrinco.raca;
  campoLote.value = lastBrinco.lote;
  campoPasto.value = lastBrinco.pasto;
  campoFase.value = lastBrinco.fase;
  campoNovoPeso.value = '';

  const dataBrincoAtual = lastBrinco.data ? 
    new Date(lastBrinco.data + 'T00:00:00-03:00') : null;

  //console.log(lastBrinco.data, dataBrincoAtual.setHours(0, 0, 0, 0), new Date().setHours(0, 0, 0, 0));
  // Se data do último brinco for igual a data atual, destacar e permitir alterar ou remover
  if (dataBrincoAtual.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
    manip = {
      brinco: lastBrinco.brinco,
      sexo: lastBrinco.sexo,
      raca: lastBrinco.raca,
      lote: lastBrinco.lote,
      pasto: lastBrinco.pasto,
      data: lastBrinco.data,
      peso: lastBrinco.peso,
      fase: lastBrinco.fase,
    };

    if (!document.querySelector('#botao-destroy')) {
        const btnDestroy = document.createElement('button');
        const icon = document.createElement('i');
        icon.classList.add('fa-solid');
        icon.classList.add('fa-trash');
        
        btnDestroy.setAttribute('id', 'botao-destroy');
        btnDestroy.onclick = destroyBrinco;
        
        btnDestroy.appendChild(icon);
        divSubmit.appendChild(btnDestroy);
    }

    btnPesagem.textContent = 'Refazer Pesagem';
    btnPesagem.style.background = '#B88600';

    sinal = lastBrinco.id;
    
  } else {
    manip = null;

    if (document.querySelector('#botao-destroy')) document.querySelector('#botao-destroy').remove();

    btnPesagem.textContent = 'Adicionar Pesagem';
    btnPesagem.style.background = '';
    campoBrinco.background = '';
    sinal = false;
  }
}
