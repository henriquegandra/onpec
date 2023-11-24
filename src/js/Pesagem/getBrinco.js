const getBrinco = async (brinco, notLog) => {
  const table = document.getElementById('lista');
  const campoBrinco = document.getElementById('campo-brinco-pesagem-gado');
  const campoSexo = document.getElementById('campo-sexo-pesagem-gado');
  const campoPeso = document.getElementById('campo-novo-peso-pesagem-gado');
  const btnPesagem = document.getElementById('botao-pesquisar');
  const logReturn = document.querySelector('#log-return');
  const labelBrinco = document.querySelector('label[for="campo-brinco-pesagem-gado"]');

  try {
    // Preencher os campos com os dados do brinco mais recente
    table.innerHTML = '';
    if (brinco.length < 3 || brinco.length > 20) {
      labelBrinco.textContent = 'Brinco';
      campoBrinco.focus();
      table.innerHTML = '';
      await cleanFields();
      await createGraph(false);
      return;

    } else {
      if (/^[A-Za-z0-9]{4,20}$/.test(brinco)) {
        
        const dadosBrinco = await ipcRenderer.invoke('getBrinco', brinco);
        
        if (dadosBrinco.length > 0) {
          await formatTable(dadosBrinco);
          await createGraph();
          campoPeso.focus();
          labelBrinco.textContent = 'Brinco';
          if (!notLog) await mostrarAviso(logReturn, 'Dados encontrados', true);
          return;

        } else {
          if (document.querySelector('#botao-destroy')) document.querySelector('#botao-destroy').remove();

          labelBrinco.textContent = 'Novo';
          btnPesagem.textContent = 'Novo Brinco';
          campoSexo.focus();

          await cleanFields();
          await createGraph(false);
          await mostrarAviso(logReturn, 'Brinco não cadastrado, a ação será de NOVO BRINCO.', true);

          console.info('Brinco não cadastrado');
          return;
        }

      } else {
        labelBrinco.textContent = 'Brinco';
        await cleanFields();
        await createGraph(false);
        await mostrarAviso(logReturn, 'Brinco inválido.', true);
        console.warn('Brinco inválido');
        campoBrinco.focus();
        return;
      }
    }
      
  } catch (error) {
    await cleanFields();
    await createGraph(false);
    console.error(error);
    return;
    
  }
}
