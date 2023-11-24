const processDataPending = require("./ProcessDataPending");
const sleep = require("../util/sleepDelay");

const checkDataPending = async (proc, render, step, table) => {
  try {
    const Service = require(`./${table.model}Service`);

    // Verifica se existem dados pendentes para sincronizar com a nuvem
    switch (proc) {
      case 'main':
        render.setProgressBar(0.4);
        statusProgress = { step: step++, message: `Verificando dados pendentes de ${table.name}` };
        render.webContents.send('updateStep', statusProgress);
        break;
      case 'index':
        render.send('logEvent', `Verificando dados pendentes de ${table.name}`);
    }

    const pendingList = await Service.findAll();
    console.log('\nDados pendentes:', pendingList.length);

    // Método para subir os dados para a nuvem
    const modelTarget = `${table.model}`.toLowerCase().split('queued')[0];
    const resultPending = await processDataPending(proc, render, step, pendingList, modelTarget);
    
    if (resultPending) {
      switch (proc) {
        case 'main':
          statusProgress = { step: step++, message: `Dados pendentes de ${table.name} sincronizados.` };
          render.webContents.send('updateStep', statusProgress);
          break;
        case 'index':
          render.send('logEvent', `Dados pendentes de ${table.name} sincronizados.`);
      }
      await sleep(1000);
      return;
    }

    if (resultPending === null) {
      switch (proc) {
        case 'main':
          statusProgress = {
            step: step++,
            message: `Erro na sincronização dos dados pendentes de ${table.name}.\nContate o Administrador.`
          };
          render.webContents.send('updateStep', statusProgress);
          break;
        case 'index':
          render.send(
            'logEvent',
            `Erro na sincronização dos dados pendentes de ${table.name}.\nContate o Administrador`
          );
      }
      await sleep(2000);
      throw new Error(`Erro na sincronização dos dados pendentes de ${table.name}`);
    }

  } catch (error) {
    console.log(error);
    return;
  }
}

module.exports = checkDataPending;
