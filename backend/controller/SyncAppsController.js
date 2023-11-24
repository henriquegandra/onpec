require('dotenv').config();
const axios = require('axios');
const localUserData = require('../localUserData');
const sequelize = require('../../base/db');
const SyncApps = require('../model/SyncAppsModel');

const rootMode = `${process.env.ONPEC_MODE}` || 'prod';

/**
 * Controlador para operações relacionadas a SyncApps.
 *
 * @typedef {Object} SyncAppsController - Controlador para manipular dados de sincronização.
 */

const SyncAppsController = {
  
  /**
   * Busca sincronizações cuja data seja maior que a data fornecida.
   *
   * @param {string} dispositivo - Dispositivo de origem.
   * @param {string} usuario - Solicitante.
   * @param {string} modulo - Modulo utilizado no momento.
   *
   * @returns {Promise<SyncApps[]>} - Retorna um array de objetos representando os registros encontrados.
   * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
   */
  
  async findMostRecentDate() {
    try {
      const result = await SyncApps.findOne({
        attributes: [
          [sequelize.fn('max', sequelize.col('createdAt')), 'mostRecentDate']
        ]
      });
  
      return result.dataValues.mostRecentDate;
  
    } catch (error) {
      throw new Error('Erro ao buscar a data mais recente: ' + error);
    }
  },
  
  async push(mostRecentDate = false) {
    const url = (rootMode.includes('dev'))
      ? `${process.env.API_URL}:5115`
      : `${process.env.API_URL}:${process.env.API_PORT}`;

    const userData = await localUserData();

    try {
      const responseAPI = await axios.post(`${url}/api/syncapps/push`, null, {
        headers: {
          client: JSON.stringify(userData),
          datagreater: JSON.stringify(mostRecentDate),
        }
      });
      //console.log(responseAPI.data.data);
      
      return {
        result: true,
        data: responseAPI.data,
        message: 'SyncApps atualizado com sucesso.'
      };
    
    } catch (error) {
      console.log(error);
      return {
        result: false,
      };
    }
  },

  async import(proc, render, step, data = []) {
    let count = 0;
    //console.log(data);
    
    const transaction = await sequelize.transaction();

    try {
      await SyncApps.sync({ freezeTableName: true });
      /* await SyncApps.resetTable();
      await SyncApps.resetAutoIncrement(); */

      if (Array.isArray(data)) {
        for (const item of data) {
          await SyncApps.upsert(item, {
            transaction,
            fields: [
              'id',
              'dispositivo',
              'usuario',
              'modulo',
              'createdAt',
            ]
          });
    
          count++;
          
          switch (proc) {
            case 'main':
              let statusProgress = { step: step, message: `Sincronizando dados da nuvem\n> Sync Apps: ${count} de ${data.length}` };
              render.webContents.send('updateStep', statusProgress);
              break;
            case 'index':
              render.send('logEvent', `Sincronizando dados da nuvem\n> Sync Apps: ${count} de ${data.length}`);
          }
        }
      } else {
        await SyncApps.upsert(data, {
          transaction,
          fields: [
            'id',
            'dispositivo',
            'usuario',
            'modulo',
            'createdAt',
          ]
        });

        switch (proc) {
          case 'main':
            let statusProgress = { step: step, message: `Sincronizando dados da nuvem\n> Sync Apps: 1 de 1` };
            render.webContents.send('updateStep', statusProgress);
            break;
          case 'index':
            render.send('logEvent', `Sincronizando dados da nuvem\n> Sync Apps: 1 de 1`);
            break;
        }
      }

      await transaction.commit();
      console.log('Dados Sync Apps inseridos/atualizados com sucesso.');
      return true;

    } catch (error) {
      console.error('Erro ao inserir/atualizar os dados:', error);
      await transaction.rollback();
      return false;
    }
  },

  /**
   * Exclui todos os registros da tabela.
   * 
   * @returns {Promise<void>} - Promessa vazia que indica o término da operação.
   * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
   */
  async resetTable() {
    try {
      return await SyncApps.resetTable();

    } catch (error) {
      throw new Error('Erro ao excluir registros da tbl_gado_pesagem: ' + error.message);
    }
  }
}

module.exports = SyncAppsController;
