/**
 * Serviço responsável por lidar com operações relacionadas a dados de pesagem de gado em fila.
 * 
 * @typedef {Object} GadoPesagemQueued - Model da tabela 'tbl_gado_pesagem_queued'.
 *
 * @param {object} dados - Contém as propriedades abaixo:
 * @property {number} id - O ID da pesagem.
 * @property {string} brinco - O número de identificação do brinco.
 * @property {string} sexo - O sexo do brinco.
 * @property {string} raca - A raça do brinco.
 * @property {string} lote - O lote do brinco.
 * @property {string} pasto - O pasto onde o brinco está.
 * @property {string} data - A data da pesagem no formato "YYYY-MM-DD hh:mm:ss".
 * @property {number} peso - O peso do brinco.
 * @property {string} fase - A fase do brinco.
 */

const { Op } = require("sequelize");
const GadoPesagemQueued = require("../model/GadoPesagemQueuedModel");

/**
 * Busca os dados pendentes de sincronização
 * 
 * @returns {Promise<GadoPesagemQueued>} - Retorna a lista de registros pendentes para sincronização.
 * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
 */
const GadoPesagemQueuedService = {
  async findAll() {
    try {
      const queuedData = await GadoPesagemQueued.findAll({
        order: [['updatedAt', 'ASC']],
      });
      return queuedData;
      
    } catch (error) {
      throw new Error(error, '\nErro ao buscar os dados:\n', error.message);
    }
  },

  async removeSyncOk(dados) {
    try {
      const { brinco, data, updatedAt } = dados;

      const queuedData = await GadoPesagemQueued.destroy({
        where: {
          brinco: brinco, data: data,
        }
      });

      return queuedData;
      
    } catch (error) {
      console.log(error);
    } finally {
      return;
    }
  },

  /**
   * Cria ou atualiza uma entrada de pesagem de gado em fila.
   *
   * @returns {Promise<GadoPesagem>} - Retorna um objeto representando a pesagem após a operação de upsert.
   * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
   */
  async upsertQueued(dados) {
    try {
      // Cria ou atualiza a entrada de pesagem de gado em fila
      const response = await GadoPesagemQueued.upsert(
        dados,
        {
          where: {
            brinco: dados.brinco,
            data: dados.data,
            action: dados.action
          }
        }
      );

      return response.data;

    } catch (error) {
      throw new Error('Erro ao inserir/atualizar os dados:\n', error.message);
    }
  },

  /**
   * Exclui uma entrada de pesagem de gado em fila.
   *
   * @returns {Promise<number>} - Retorna o número de linhas excluídas.
   * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
   */
  async deleteQueued(dados) {
    try {
      const { brinco = false, data = false, action = false } = dados;
      if (brinco === false || data === false || action === false) throw new Error('Dados incompletos:\n', error.message);

      const deletedRows = await GadoPesagemQueued.destroy({
        where: {
          brinco: brinco,
          data: data,
          action: action
        }
      });

      return deletedRows;

    } catch (error) {
      throw new Error('Erro ao deletar os dados:\n', error.message);
    }
  }
};

module.exports = GadoPesagemQueuedService;
