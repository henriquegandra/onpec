const upsertPesagem = async () => {
  const campoBrinco = document.getElementById('campo-brinco-pesagem-gado');
  const campoSexo = document.getElementById('campo-sexo-pesagem-gado');
  const campoRaca = document.getElementById('campo-raca-pesagem-gado');
  const campoLote = document.getElementById('campo-lote-pesagem-gado');
  const campoPasto = document.getElementById('campo-pasto-pesagem-gado');
  const campoFase = document.getElementById('campo-fase-pesagem-gado');
  const campoNovoPeso = document.getElementById('campo-novo-peso-pesagem-gado');
  const logReturn = document.querySelector('#log-return');
  
  // Verifica se todos os campos estão preenchidos
  if (!/^[A-Za-z0-9]{4,20}$/.test(campoBrinco.value) || campoBrinco.value.length < 4){
    console.log('Preencha o valor de BRINCO corretamente.');
    mostrarAviso(logReturn, 'Preencha o valor de BRINCO corretamente.', true);
    return;
  }
  
  if (!campoSexo.value || !campoLote.value || !campoPasto.value /* || !campoFase.value */ || !campoNovoPeso.value) {
    console.log('Todos os campos devem ser preenchidos.');
    mostrarAviso(logReturn, 'Todos os campos devem ser preenchidos.', true);
    return;
  }

  if (campoSexo.value === '0' || campoRaca.value === '0' || campoLote.value === '0' || campoPasto.value === '0' || campoNovoPeso.length < 2) {
    console.log('Campo pasto não foi preenchido.');
    mostrarAviso(logReturn, 'Todos os campos devem ser preenchidos.', true);
    return;
  }
  
  const campoDataManualValue = null/* await formatDateToPostgres(campoDataManual.value) */;
  await processingLoad(true);

  // Cria um objeto com os dados preenchidos
  const data = {
    type: 'upsert',
    data: {
      id: (sinal !== false) ? sinal : null,
      brinco: campoBrinco.value,
      sexo: campoSexo.value,
      raca: campoRaca.value,
      lote: campoLote.value,
      pasto: campoPasto.value,
      data: new Date(),
      peso: campoNovoPeso.value,
      fase: campoFase.value,
    }
  };

  const resultPesagem = await ipcRenderer.invoke('upsertBrinco', data);
  /* console.log('RES PESAGEM', resultPesagem); */

  await getBrinco(campoBrinco.value, true);

  if (
    resultPesagem.result === 'UPDATEDAT/LT' ||
    resultPesagem.result === 'SYNC/LT'
  ) {
    await processingLoad(null, `${resultPesagem.data}`);

  } else {
    campoBrinco.focus();
    await processingLoad(false);
  
    if (resultPesagem.result === true) {
      await mostrarAviso(logReturn, 'Dados gravados ONLINE', true);
  
    } else if (resultPesagem.result === 'connection') {
      await mostrarAviso(logReturn, 'Dados salvos OFFLINE', true);
    
    } else {
      await processingLoad(null, 'Erro ao inserir os dados, tente novamente');
    }
  }
}
