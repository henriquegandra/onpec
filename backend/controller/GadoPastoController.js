require('dotenv').config();
const axios = require("axios");
const localUserData = require("../localUserData");
const sequelize = require('../../base/db');
const GadoPasto = require('../model/GadoPastoModel');

const rootMode = `${process.env.ONPEC_MODE}` || 'prod';

/**
 * Controller responsável por criar ou atualizar dados de um GadoPasto.
 *
 * @param {string} pasto - O nome do pasto (até 20 caracteres).
 * @param {number} unidade - O número da unidade.
 * @param {string} descricao - A descrição do pasto (até 255 caracteres).
 *
 * @returns {Promise<Object>} - Retorna um objeto com o status da operação e os dados do GadoPasto.
 * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
 */

const GadoPastoController = {
  async get() {
    try {
      const result = await GadoPasto.findAll();
      //console.log(result);
      return result;
      
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  /**
   * Sincroniza as pesagens com a API usando a data mais recente como referência.
   *
   * @returns {Promise<object>} - Retorna um objeto com os resultados da busca se a operação for bem-sucedida, ou false em outros casos.
   * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
   * @property {Array} data - Retorna um Array com dados atualizados de Gado Pasto.
   */
  async push() {
    const userData = await localUserData();
    const url = (rootMode.includes('dev'))
      ? `${process.env.API_URL}:5115`
      : `${process.env.API_URL}:${process.env.API_PORT}`;

    try {
      const response = await axios.post(`${url}/api/gadopasto/push`, null, {
        headers: {
          client: JSON.stringify(userData)
        }
      });
      //console.log(response.data.data);
      return response.data;

    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  async import(proc, render, step, data = []) {
    let count = 0;
    const transaction = await sequelize.transaction();

    try {
      await GadoPasto.sync({ freezeTableName: true });

      for (const item of data) {
        //console.log(item);
        await GadoPasto.upsert(item, {
          transaction,
          fields: [
            'pasto',
            'unidade',
            'descricao',
          ]
        });
  
        count++;
        
        switch (proc) {
          case 'main':
            let statusProgress = { step: step, message: `Sincronizando dados da nuvem\n> Gado Pasto: ${count} de ${data.length}` };
            render.webContents.send('updateStep', statusProgress);
            break;
          case 'index':
            render.send('logEvent', `Sincronizando dados da nuvem\n> Gado Pasto: ${count} de ${data.length}`);
        }
      }

      await transaction.commit();
      console.log('Dados Gado Pasto inseridos/atualizados com sucesso.');
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
      return await GadoPasto.resetTable();

    } catch (error) {
      throw new Error('Erro ao excluir registros da tbl_gado_pesagem: ' + error.message);
    }
  }
};

module.exports = GadoPastoController;
