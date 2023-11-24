require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sequelize = require('../base/db');

const { verificarConexao } = require('./util/checkConn');
const { setStatusProgress } = require('./util/setStatusProgress');
const { checkTblLocal } = require('../base/checkTable');

const tables = require('../base/tablesConfig');
const SyncAppsController = require('./controller/SyncAppsController');
const GadoPesagemController = require('./controller/GadoPesagemController');
const checkDataPending = require('./service/CheckDataPending');
const bkpDB = require('./bkp/bkpDB');
const sleep = require('./util/sleepDelay');

const rootMode = `${process.env.ONPEC_MODE}` || 'prod';

const init = async (mw, appPath) => {
  
  const db = (rootMode.includes('dev'))
    ? path.join(appPath, './base/local-test.db')
    : path.join(appPath, './base/local.db');

  mw.setProgressBar(0.1);
  
  try {
    await fs.promises.access(db, fs.constants.F_OK);
    await bkpDB(db);
    console.log('\nArquivo DB local encontrado.\n', db);

  } catch (error) {
    try {
      // Se o arquivo não existe, cria ele
      await fs.promises.writeFile(db, '');
      console.log('\nArquivo DB local criado.\n', db);
      
    } catch (error) {
      console.error(error);
    }
  }

  let step = 1;

  try {
    // Abrir conexão com o banco de dados local
    await sequelize.authenticate();
    await setStatusProgress(mw.webContents, 'updateStep', step++, 'Conectado ao banco local');
    
  } catch (error) {
    await setStatusProgress(mw.webContents, 'updateStep', step++, 'Erro ao inicializar SQLITE');
    await sleep(2000);
    return false;
  }

  step++;
  // Verifica lista de tabelas e cria no banco local caso necessario
  try {
    for (const table of tables) {
      await setStatusProgress(mw.webContents, 'updateStep', step, `Checar se tabelas existem\n"${table.name}"`);
      const res = await checkTblLocal(table.db, table.model);
      if (res.result === false) throw error(res.error);
    }
    
  } catch (error) {
    console.error('Erro ao obter os dados:', error);
    return null;
  }
  
  // Checar conexão com API
  const conexao = await verificarConexao();

  if (conexao) {
    mw.setProgressBar(0.2);
    await setStatusProgress(mw.webContents, 'updateStep', step++, 'Conectado a API do ON Roncador');

    try {
      for (let i = 0; i < tables.length; i++) {
        if (tables[i].model.includes('Queued')) {
          await checkDataPending('main', mw, step, tables[i]);
        }
      }

      await setStatusProgress(mw.webContents, 'updateStep', step++, 'Buscar novos dados da nuvem.');
      mw.setProgressBar(0.6);

      // Buscar dados atualizados da nuvem a partir da data do registro mais recente
      const mostRecentDate = await SyncAppsController.findMostRecentDate();

      console.log('\nRegistro mais recente', mostRecentDate);

      // Baixar os dados conforme data da última atualização
      const resPush = await GadoPesagemController.push(mostRecentDate);
      console.log('\nExistem novos dados para baixar?', resPush.result);
      mw.setProgressBar(0.8);

      if (resPush.result === true || resPush.result === 'true') {
        const resImport = await GadoPesagemController.import('main', mw, step++, resPush.data);
        
        if (resImport === false) {
          // Fechar a aplicação se o banco de dados local não existir
          await setStatusProgress(mw.webContents, 'updateStep', step++, 'Erro na sincronização, reinicie a aplicação');
          await sleep(2000);
          return null;
        }

        const resSyncPush = await SyncAppsController.push(mostRecentDate);
        console.log('\nBaixar SyncApps?', resSyncPush.result);
        
        if (resSyncPush.result !== undefined && resSyncPush.result !== 'undefined' && resSyncPush.result !== false && resSyncPush.result !== 'false') {
          const resSyncImport = await SyncAppsController.import('main', mw, step++, resSyncPush.data.data);
  
          if (resSyncImport === false) {
            // Fechar a aplicação se o banco de dados local não existir
            await setStatusProgress(mw.webContents, 'updateStep', step++, 'Erro na sincronização, reinicie a aplicação');
            await sleep(2000);
            return null;
          }
        }
      }

      await sleep(1200);
      step++;
      for (let i = 0; i < tables.length; i++) {
        if (tables[i].exec !== false && tables[i].exec !== 'false') {
          const Controller = require(`./controller/${tables[i].model}Controller`);
          const resetTables = await Controller.resetTable();
          //console.log('Tabela reiniciada: ' + resetTables);
          const resStaticTables = await Controller.push();

          if (resStaticTables.result !== false && resStaticTables.result !== 'false') {
            const resStaticTablesImport = await Controller.import('main', mw, step, resStaticTables.data);
            
            if (resStaticTablesImport === false) {
              // Exibir erro
              console.warn('Erro ao baixar dados da tabela ' + tables[i].name);
              await setStatusProgress(mw.webContents, 'updateStep', step, 'Erro na sincronização, reinicie a aplicação');
              await sleep(1500);
              return null;
            }
          }
        }
        await sleep(500);
      }
      return true;
      
    } catch (error) {
      console.error('Erro ao obter os dados:', error);
      const message = (error.statusMessage) ? `Contate o Administrador!\n${error.statusMessage}\n${error}` : error;

      await setStatusProgress(mw.webContents, 'updateStep', null, message);
      await sleep(2500);
      return false;
    }
  } else {
    await setStatusProgress(mw.webContents, 'updateStep', step, 'Sem conexão com a nuvem.');
    await sleep(1500);
  }

  mw.setProgressBar(1);
  await setStatusProgress(mw.webContents, 'updateStep', null, 'Iniciando aplicação ...');
  await sleep(1500);

  return true;
}

module.exports = { init };
