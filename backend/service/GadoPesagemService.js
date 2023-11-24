require('dotenv').config();
const axios = require('axios');
const GadoPesagem = require('../model/GadoPesagemModel');

const rootMode = `${process.env.ONPEC_MODE}` || 'prod';

/**
 * Serviço responsável por lidar com operações relacionadas a dados de pesagem de gado.
 * 
 * @typedef {Object} axios - Para conexões HTTP.
 * @typedef {Object} GadoPesagem - Model da tabela 'tbl_gado_pesagem'.
 *
 * @property {string} url - Endereço HTTP de conexão a API.
 * 
 * @param {object} dados - Contém as propriedades abaixo:
 * @property {number} id - O ID da pesagem (Propriedade Opcional).
 * @property {string} brinco - O número de identificação do brinco.
 * @property {string} sexo - O sexo do brinco.
 * @property {string} raca - A raça do brinco.
 * @property {string} lote - O lote do brinco.
 * @property {string} pasto - O pasto onde o brinco está.
 * @property {string} data - A data da pesagem no formato "YYYY-MM-DD hh:mm:ss".
 * @property {number} peso - O peso do brinco.
 * @property {string} fase - A fase do brinco.
 */

const GadoPesagemService = {
  /**
   * Cria ou atualiza uma entrada.
   *
   * @property {object} axios - Efetua uma conexão POST na url.
   * @returns {Promise<GadoPesagem>} - Retorna um objeto após a operação de upsert.
   * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
   */
  async upsertApi(dados, retries = 0) {
    const url = (rootMode.includes('dev'))
      ? `${process.env.API_URL}:5115`
      : `${process.env.API_URL}:${process.env.API_PORT}`;

    try {
      return await axios.post(`${url}/api/gadopesagem`, null, {
        headers: {
          itemsdb: JSON.stringify(dados)
        },
        timeout: 2000
      });

    } catch (error) {
      console.warn('UPSERT API', error.message);
  
      // Se for um erro de conexão, você pode tentar novamente a requisição
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        // Este é o caso em que ocorreu um timeout
        console.warn('Sem conexão.');
        
        if (retries === 0) {
          console.log('Tentando enviar novamente...');
          retries = 1;
          return this.upsertApi(dados, retries);
        } else {
          return {
            data: {
              result: 'connection',
            }
          };
        }

      } else if (
        error.code === 'ECONNABORTED' ||
        error.code === 'ECONNRESET' ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT' ||
        error.code === 'ENOTFOUND' ||
        (
          error.response &&
          error.response.status >= 500 &&
          error.response.status <= 599
          )
      ) {
        if (retries === 0) {
          console.log('Tentando enviar novamente...');
          retries = 1;
          return this.upsertApi(dados, retries);
        } else {
          return {
            data: {
              result: 'connection',
            }
          };
        }

      } else if (error.request && retries === 0) {
        // A requisição foi feita, mas não houve resposta
        console.log('Tentando enviar novamente...');
        retries = 1;
        return this.upsertApi(dados, retries);

      } else {
        // Algo aconteceu durante a configuração da requisição que gerou o erro
        console.error('Erro ao configurar a requisição:', error.message);
        return {
          data: {
            result: null,
          }
        };
      }
    }
  },

  /**
   * Remove uma entrada.
   *
   * @property {object} axios - Efetua uma conexão POST na url.
   * @returns {Promise<GadoPesagem>} - Retorna um objeto após a operação de delete.
   * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
   */
  async deleteApi(dados, retries = 0) {
    const url = (rootMode.includes('dev'))
      ? `${process.env.API_URL}:5115`
      : `${process.env.API_URL}:${process.env.API_PORT}`;

    try {
      return await axios.delete(`${url}/api/gadopesagem`, {
        headers: {
          itemsdb: JSON.stringify(dados),
        },
        timeout: 2000
      });

    } catch (error) {
      console.warn('DELETE API', error.message);
  
      // Se for um erro de conexão, você pode tentar novamente a requisição
      if (
        error.code === 'ECONNABORTED' ||
        error.code === 'ECONNRESET' ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT' ||
        error.code === 'ENOTFOUND'
        (
          error.response &&
          error.response.status >= 500 &&
          error.response.status <= 599
          )
      ) {
        if (retries === 0) {
          console.log('Tentando enviar novamente...');
          retries = 1;
          return this.deleteApi(dados, retries);
        } else {
          return {
            data: {
              result: 'connection',
            }
          };
        }

      } else if (error.request && retries === 0) {
        // A requisição foi feita, mas não houve resposta
        console.log('Tentando enviar novamente...');
        retries = 1;
        return this.deleteApi(dados, retries);

      } else {
        // Algo aconteceu durante a configuração da requisição que gerou o erro
        console.error('Erro ao configurar a requisição:', error.message);
        return {
          data: {
            result: null,
          }
        };
      }
    }
  },
};

module.exports = GadoPesagemService;
