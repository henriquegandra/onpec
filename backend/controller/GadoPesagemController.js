require('dotenv').config();
const axios = require('axios');
const sequelize = require('../../base/db');
const GadoPesagem = require('../model/GadoPesagemModel');
const GadoPesagemService = require('../service/GadoPesagemService');
const GadoPesagemQueuedService = require('../service/GadoPesagemQueuedService');
const BKP = require('../bkp/bkp');

const rootMode = `${process.env.ONPEC_MODE}` || 'prod';

/**
 * Valida e manipula dados que irão integir com GadoPesagem.
 * 
 * @typedef {Object} GadoPesagemService - Serviço que faz o CRUD dos dados para o banco local e da nuvem.
 * @typedef {Object} GadoPesagemQueuedService - Serviço que faz o CRUD dos dados que não foram enviados para a nuvem.
 * @typedef {Object} GadoPesagemPushService - Serviço que traz somente os dados novos e/ou atualizados para o banco local.
 *
 * @param {string} brinco - O número de identificação do gado (até 20 caracteres).
 * @param {string} sexo - O sexo do gado (até 1 caractere).
 * @param {string} raca - A raça do gado (até 20 caracteres).
 * @param {string} lote - O lote do gado (até 20 caracteres).
 * @param {string} pasto - O pasto onde o gado está (até 20 caracteres).
 * @param {string} data - A data da pesagem no formato "YYYY-MM-DD hh:mm:ss".
 * @param {number} peso - O peso do gado (entre 0.0 e 2000.0).
 * @param {string} fase - A fase do gado (até 1 caractere).
 *
 * @returns {Promise<GadoPesagem>} - Retorna um objeto representando a pesagem após a operação de upsert.
 * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação ou se as verificações falharem.
 */

const GadoPesagemController = {
  
  async findAll(brinco) {
    //console.log('findAll', brinco);
    try {  
      const result = await GadoPesagem.findAll({
        where: { brinco: brinco },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        order: [ ['data', 'DESC'] ],
      });
  
      return result;
      
    } catch (error) {
      console.error('Erro ao inserir/atualizar os dados:', error);
      return false;
    }
  },

  /**
   * Encontra pesagens a partir de uma data especificada.
   *
   * @param {string} paramDate - A data de referência para a busca.
   * 
   * @returns {Promise<Array<GadoPesagem>>} - Retorna um array de objetos representando as pesagens encontradas.
   * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
   */
  async findFromDate(paramDate) {
    try {
      if (!paramDate && paramDate !== false) {
        throw new Error('Data inválida.');
      }

      const result = await GadoPesagem.findAllDateGreater(paramDate);

      const rows = result.map((registro) => registro.get());

      return rows;

    } catch (error) {
      throw new Error('Erro ao buscar os dados:\n', error.message);
    }
  },

  async findMostRecentDate() {
    try {
      const result = await GadoPesagem.findOne({
        attributes: [
          [sequelize.fn('max', sequelize.col('updatedAt')), 'mostRecentDate']
        ]
      });
  
      return result.dataValues.mostRecentDate;
  
    } catch (error) {
      throw new Error('Erro ao buscar a data mais recente: ' + error);
    }
  },
  
  async upsert(dados) {
    const {
      id,
      brinco,
      sexo,
      raca,
      lote,
      pasto,
      data = new Date().toLocaleString('AF-az').split(' ')[0],
      peso,
      fase = 'null'
    } = dados.data;

    try {
      
      // Brinco deve ser String de até 20 caracteres
      if (typeof brinco !== 'string' || brinco.length > 20) {
        throw new Error('O parâmetro "brinco" deve ser uma string com até 20 caracteres.');
      }
      
      // Sexo deve ser String de até 1 caractere
      if (typeof sexo !== 'string' || sexo.length > 1) {
        throw new Error('O parâmetro "sexo" deve ser uma string com até 1 caractere.');
      }
      
      // Raca deve ser String de até 20 caracteres
      if (typeof raca !== 'string' || raca.length > 20) {
        throw new Error('O parâmetro "raca" deve ser uma string com até 20 caracteres.');
      }
      
      // Lote deve ser String de até 20 caracteres
      if (typeof lote !== 'string' || lote.length > 20) {
        throw new Error('O parâmetro "lote" deve ser uma string com até 20 caracteres.');
      }
      
      // Pasto deve ser String de até 20 caracteres
      if (typeof pasto !== 'string' || pasto.length > 20) {
        throw new Error('O parâmetro "pasto" deve ser uma string com até 20 caracteres.');
      }
      
      // Peso deve ser Float entre 0.0 e 2000.0
      const parsedPeso = parseFloat(peso);
      if (isNaN(parsedPeso) || parsedPeso < 0.0 || parsedPeso > 2000.0) {
        throw new Error('O parâmetro "peso" deve ser um número entre 0.0 e 2000.0.');
      }
      
      // Fase deve ser String de até 1 caractere
      if (typeof fase !== 'string' || fase.length > 1) {
        throw new Error('O parâmetro "fase" deve ser uma string com até 1 caractere.');
      }

    } catch(error) {
      throw new Error('Erros de parâmetros\n' + error);
    }

    let apiData;

    try {
      if (id === null || id === 'null') delete dados.data.id;
      
      await BKP.gen(
        {
          brinco,
          sexo,
          raca,
          lote,
          pasto,
          data: new Date(data).toLocaleDateString('AF-az'),
          peso,
          fase,
          createdAt: new Date().toLocaleString('AF-az'),
          updatedAt: new Date().toLocaleString('AF-az'),
          status: 'A'
        },
        'upsert', 'gadopesagem', 'csv');

      // Service responsável por criar/atualizar dados de GadoPesagem
      const apiResponse = await GadoPesagemService.upsertApi( dados );
      apiData = apiResponse.data;
      console.log('=== RES API UPSERT', apiData.result);

      if (apiData.result === 'connection') {
        throw new Error('Sem conexão com a API', apiData.result);
      }

      if (apiData.result === 'UPDATEAT/LT') {
        return {
          result: 'UPDATEAT/LT',
          data: apiData.message
        };
      }
      
      if (apiData.result === null) {
        // Se a API externa não retornou todos os dados necessários,
        // cai para o bloco catch
        console.error('API externa não retornou todos os dados necessários\n', apiResponse);
        const instance = await GadoPesagem.destroy({
          where: {
            brinco: reg.brinco,
            data: reg.data,
          }
        });
        return {
          result: false,
          data: apiResponse
        };
      }

      // Cria ou atualiza GadoPesagem Local
      const reg = apiData.data;
      const [instance, created] = await GadoPesagem.upsert(
        reg,
        {
          where: {
            brinco: reg.brinco,
            data: reg.data,
          }
        }
      );

      await GadoPesagemQueuedService.removeSyncOk(reg);

      return {
        result: apiData.result,
        data: instance.data,
      };
      
    } catch (error) {
      console.log(error);
      try {
        // Em caso de erro no Axios ou a API externa não retornou os dados, persiste a QUEUE
        const response = await GadoPesagem.upsert( dados.data );
  
        const instanceQueued = await GadoPesagemQueuedService.upsertQueued(
          { brinco, sexo, raca, lote, pasto, data, peso, fase, action: 'upsert' }
        );

        return {
          result: apiData.result,
          data: response,
        };
        
      } catch (error) {
        console.error(error);
        return {
          result: false,
          data: error
        };
      }
    }
  },

  async destroy(dados) {
    const {
      brinco,
      sexo,
      raca,
      lote,
      pasto,
      data,
      peso,
      fase
    } = dados.data;
      
    await BKP.gen(
      {
        brinco,
        sexo,
        raca,
        lote,
        pasto,
        data: new Date(data).toLocaleDateString('AF-az'),
        peso,
        fase,
        createdAt: new Date().toLocaleString('AF-az'),
        updatedAt: new Date().toLocaleString('AF-az'),
        status: 'D'
      },
      'destroy', 'gadopesagem', 'csv');

    let apiData;
    try {
      const apiResponse = await GadoPesagemService.deleteApi( dados );
      apiData = apiResponse.data;
      console.log('=== RES API DESTROY', apiData.result);

      if (apiData.result === 'connection') {
        throw new Error('Sem conexão com a API', apiData.result);
      }
      
      if (apiData.result === null) {
        // Se a API externa não retornou todos os dados necessários,
        // cai para o bloco catch
        console.error('API externa não retornou todos os dados necessários\n', apiResponse);
        const instance = await GadoPesagem.destroy({
          where: {
            brinco: reg.brinco,
            data: reg.data,
          }
        });

        return {
          result: false,
          data: apiResponse
        };
      }

      // Cria ou atualiza GadoPesagem Local
      const reg = apiData.data;
      const instance = await GadoPesagem.destroy({
        where: {
          brinco: reg.brinco,
          data: reg.data,
        }
      });

      return {
        result: apiData.result,
        data: instance.data,
      };
      
    } catch (error) {
      console.log(error.message);
      
      try {
        // Em caso de erro no Axios ou a API externa não retornou os dados, persiste a QUEUE
        const responseLocal = await GadoPesagem.destroy({
          where: {
            brinco: brinco,
            data: data,
          }
        });

        const resSyncOk = await GadoPesagemQueuedService.removeSyncOk({
          brinco, data
        });
  
        if (resSyncOk < 0) {
          const instanceQueued = await GadoPesagemQueuedService.upsertQueued(
            { brinco, sexo, raca, lote, pasto, data, peso, fase, action: 'destroy' }
          );

          return {
            result: apiData.result,
            data: instanceQueued,
          };
        }
          
        return {
          result: apiData.result,
          data: resSyncOk,
        };
        
      } catch (error) {
        console.error(error);
        return {
          result: false,
          data: error
        };
      }
    }
  },

  /**
   * Sincroniza as pesagens com a API usando a data mais recente como referência.
   *
   * @returns {Promise<object>} - Retorna um objeto com os resultados da busca se a operação for bem-sucedida, ou false em outros casos.
   * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
   * @param {Object} mostRecentDate - Objeto contendo a data mais recente.
   * @property {Array} data - Retorna um Array com dados atualizados de GadoPesagem.
   */
  async push(mostRecentDate) {
    const url = (rootMode.includes('dev'))
      ? `${process.env.API_URL}:5115`
      : `${process.env.API_URL}:${process.env.API_PORT}`;
    
    try {
      const response = await axios.post(`${url}/api/gadopesagem/push`, null, {
        headers: {
          dategreater: JSON.stringify(mostRecentDate),
        }
      });
      
      return response.data;

    } catch (error) {
      console.log(error);
      return false;
    }
  },

  async import(proc, render, step, data = []) {
    let count = 0;
    const u = data.upsert ? data.upsert.length : 0;
    const d = data.destroy ? data.destroy.length : 0;
    const itemsCount = u + d;
    
    const transaction = await sequelize.transaction();

    try {
      await GadoPesagem.sync({ freezeTableName: true });

      if (u > 0) {
        for (const item of data.upsert) {
          const reg = await GadoPesagem.findOne({
            where: { brinco: item.brinco, data: `${item.data}` }
          });

          const [reponse, created] = (reg)
            ? await GadoPesagem.update(item, {
              where: { 
                brinco: reg.brinco,
                data: reg.data
              },
              transaction,
            })
            : await GadoPesagem.upsert(item, {
              where: { 
                brinco: item.brinco,
                data: item.data
              },
              transaction,
            });
    
          count++;
          
          switch (proc) {
            case 'main':
              let statusProgress = { step: step, message: `Sincronizando dados da nuvem\n> Gado Pesagem: ${count} de ${itemsCount}` };
              render.webContents.send('updateStep', statusProgress);
              break;
            case 'index':
              render.send('logEvent', `Sincronizando dados da nuvem\n> Gado Pesagem: ${count} de ${itemsCount}`);
          }
        }
      }

      if (d > 0) {
        for (const item of data.destroy) {
          await GadoPesagem.destroy({
            where: {
              id: item.id,
              brinco: item.brinco,
              data: item.data
            },
            transaction,
          });
    
          count++;
          
          switch (proc) {
            case 'main':
              let statusProgress = { step: step, message: `Sincronizando dados da nuvem\n> Gado Pesagem: ${count} de ${itemsCount}` };
              render.webContents.send('updateStep', statusProgress);
              break;
            case 'index':
              render.send('logEvent', `Sincronizando dados da nuvem\n> Gado Pesagem: ${count} de ${itemsCount}`);
          }
        }
      }

      await transaction.commit();
      console.log('Dados GadoPesagem inseridos/atualizados com sucesso.');
      return true;

    } catch (error) {
      console.error('Erro ao inserir/atualizar os dados:', error);
      await transaction.rollback();
      return false;
    }
  },

  /**
   * Reseta o contador do auto incremento na tabela de pesagem de gado.
   * 
   * @returns {Promise<string>} - Retorna uma mensagem indicando o resultado da operação.
   * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
   */
  /* async resetAutoIncrement() {
    try {
      return await GadoPesagem.resetAutoIncrement();

    } catch (error) {
      throw new Error('Erro ao zerar o auto incremento: ' + error.message);
    }
  }, */

  /**
   * Exclui todos os registros da tabela de pesagem de gado.
   * 
   * @returns {Promise<void>} - Promessa vazia que indica o término da operação.
   * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
   */
  /* async resetTable() {
    try {
      return await GadoPesagem.resetTable();

    } catch (error) {
      throw new Error('Erro ao excluir registros da tbl_gado_pesagem: ' + error.message);
    }
  } */
};

module.exports = GadoPesagemController;
