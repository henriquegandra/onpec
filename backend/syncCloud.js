require('dotenv').config();
const app = require('electron').app;
const path = require('path');
const rootPath = app.getAppPath();

const { verificarConexao } = require('./util/checkConn');

const tables = require('../base/tablesConfig');
const SyncAppsController = require('./controller/SyncAppsController');
const GadoPesagemController = require('./controller/GadoPesagemController');
const checkDataPending = require('./service/CheckDataPending');
const bkpDB = require('./bkp/bkpDB');
const sleep = require('./util/sleepDelay');

const rootMode = `${process.env.ONPEC_MODE}` || 'prod';

const syncCloud = async (actualWin) => {
  const db = (rootMode.includes('dev'))
    ? path.join(rootPath, './base/local-test.db')
    : path.join(rootPath, './base/local.db');

  const conexao = await verificarConexao();

  if (conexao) {
    actualWin.send('logEvent', 'Conectado ao servidor');
    await bkpDB(db);
    await sleep(500);

    try {
      for (let i = 0; i < tables.length; i++) {
        if (tables[i].model.includes('Queued')) {
          await checkDataPending('index', actualWin, false, tables[i]);
        }
      }

      actualWin.send('logEvent', 'Buscar novos dados da nuvem.');

      // Buscar dados atualizados da nuvem a partir da data do registro mais recente
      const mostRecentDate = await SyncAppsController.findMostRecentDate();

      console.log('\nRegistro mais recente', mostRecentDate);

      // Baixar os dados conforme data da última atualização
      const resPush = await GadoPesagemController.push(mostRecentDate);
      console.log('\nExistem novos dados para baixar?', resPush.result);
      
      if (resPush.result === true || resPush.result === 'true') {
        const resImport = await GadoPesagemController.import('index', actualWin, false, resPush.data);
        await sleep(750);

        if (resImport === false) {
          actualWin.send('logEvent', 'Erro na sincronização, reinicie a aplicação');
          await sleep(2000);
          return false;
        }

        const resSyncPush = await SyncAppsController.push(mostRecentDate);
        console.log('\nBaixar SyncApps?', resSyncPush.result);
        
        if (resSyncPush.result !== undefined && resSyncPush.result !== 'undefined' && resSyncPush.result !== false && resSyncPush.result !== 'false') {
          const resSyncImport = await SyncAppsController.import('index', actualWin, false, resSyncPush.data.data);
          
          if (resSyncImport === false) {
            // Fechar a aplicação se o banco de dados local não existir
            actualWin.send('logEvent', 'Erro na sincronização, reinicie a aplicação');
            await sleep(2000);
            return false;
          }
        }
      }
        
      await sleep(1200);
      for (let i = 0; i < tables.length; i++) {
        if (tables[i].exec === true) {
          const Controller = require(`./controller/${tables[i].model}Controller`);
          const resetTables = await Controller.resetTable();
          //console.log('Tabela reiniciada: ' + resetTables);
          const resStaticTables = await Controller.push();

          if(resStaticTables.result !== false && resStaticTables.result !== 'false') {
            const resStaticTablesImport = await Controller.import('index', actualWin, false, resStaticTables.data);
            
            if (resStaticTablesImport === false) {
              // Exibir erro
              console.warn('Erro ao baixar dados da tabela ' + tables[i].name);
              actualWin.send('logEvent', 'Erro na sincronização, reinicie a aplicação');
              await sleep(1500);
              return false;
            }
          }
        }
        await sleep(500);
      }

      actualWin.send('logEvent', 'Concluído!');
      return true;

    } catch (error) {
      console.error('Erro ao obter os dados:', error);
      actualWin.send('logEvent', `Sem conexão com a nuvem.\n${error}`);
      return false;
    }
  } else {
    actualWin.send('logEvent', 'Sem conexão com a nuvem.');
    return false;
  }
};

module.exports = syncCloud;
