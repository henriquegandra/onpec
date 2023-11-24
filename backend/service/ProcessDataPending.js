require('dotenv').config();
const ReplicationController = require('../controller/ReplicationController');
const cleanDataPending = require('./CleanDataPending');
const sleep = require('../util/sleepDelay');
const BKP = require('../bkp/bkp');

// Sincronizar dados locais
const processDataPending = async (proc, render, step, pendingList, model) => {
  try {
    // Verificar se a lista de registros está vazia
    if (pendingList.length === 0) {
      console.log('Não há registros para processar.');
      return false;
    }

    let chunkList = [];
    let returnList = [];
    let actual = 50;

    // Percorrer a lista de registros
    for (i = 0; i < pendingList.length; i++) {
      const pendingData = pendingList[i].dataValues;

      if (
        pendingData.sexo.length < 1 ||
        pendingData.sexo === '0'
      ) pendingData.sexo = 'F';

      if (
        pendingData.raca.length < 1 ||
        pendingData.raca === '0'
      ) pendingData.raca = 'NEL';

      if (
        pendingData.lote.length < 1 ||
        pendingData.lote === '0'
      ) pendingData.lote = 'ERROR';

      if (
        pendingData.pasto.length < 1 ||
        pendingData.pasto === '0'
      ) pendingData.pasto = 'ERROR';

      chunkList.push(pendingData);

      if (i === actual) {
        returnList.push(await ReplicationController.put(chunkList, model));
        chunkList = [];
        actual += 50;
      }
      
      switch (proc) {
        case 'main':
          statusProgress = { step: step, message: `Sincronizando dados para a nuvem\n${i} de ${pendingList.length}` };
          render.webContents.send('updateStep', statusProgress);
          break;
        case 'index':
          render.send('logEvent', `Sincronizando dados para a nuvem\n${i} de ${pendingList.length}`);
      }
    }
    
    returnList.push(await ReplicationController.put(chunkList, model));

    switch (proc) {
      case 'main':
        statusProgress = { step: step, message: `Sincronizando dados para a nuvem\n${pendingList.length} de ${pendingList.length}` };
        render.webContents.send('updateStep', statusProgress);
        break;
      case 'index':
        render.send('logEvent', `Sincronizando dados para a nuvem\n${pendingList.length} de ${pendingList.length}`);
    }
    
    console.log('Processamento de registros concluído.\n\n');
    const resClean = await cleanDataPending(returnList);
    console.log('--> L58 | REG CLEAN ERROR', resClean.error);

    if (resClean.error !== undefined && resClean.error.length > 0) {
      const registro = [];

      for (const regCleanError of resClean.error) {
        const object = regCleanError.data[0].data;
        const row = Object.values(object);

        await BKP.gen(object[0].data, 'cleanLocal', 'gadopesagemqueued', 'csv');

        const rowString = row.map(values => (typeof values === 'string' && values.includes(',')
        ? `"${values}"` : values)).join(', ');

        registro.push(`${regCleanError.message}\n${rowString}`);
      }

      switch (proc) {
        case 'main':
          statusProgress = { step: step, message: `Os dados abaixo não foram gravados na nuvem, contate o administrador.\nFoi salvo um backup Local.\n\n${registro}\n`, errorAlert: true };
          render.webContents.send('updateStep', statusProgress);
          break;
        case 'index':
          render.send('logEvent', `Os dados abaixo não foram gravados na nuvem, contate o administrador.\nFoi salvo um backup Local.\n\n${registro}\n`);
          await sleep(8000);
      }
    }

    return true;

  } catch (error) {
    console.error('Erro ao processar registros:', error);
    return null;
  }
};

module.exports = processDataPending;
