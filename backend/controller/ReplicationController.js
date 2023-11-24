require('dotenv').config();
const axios = require("axios");
const GadoPesagemQueued = require("../model/GadoPesagemQueuedModel");

const rootMode = `${process.env.ONPEC_MODE}` || 'prod';

const ReplicationController = {
  async put(dados, model) {
    //console.log(`PENDENTES ${model} PARA NUVEM:\n`, dados);

    const url = (rootMode.includes('dev'))
      ? `${process.env.API_URL}:5115`
      : `${process.env.API_URL}:${process.env.API_PORT}`;

    try {
  
      const response = await axios.put(`${url}/api/replication`, null, {
        headers: { itemsdb: JSON.stringify(dados), model: JSON.stringify(model) }
      });
  
      return response.data.data;
  
    } catch (error) {
      console.error('Erro ao realizar o SYNC GADO PESAGEM:', error);
      return false;
    }
  },

  async cleanQueue(dados) {
    const { result, data } = dados;

    if (result === true) {
      try {
        const instance = await GadoPesagemQueued.destroy({
          where: { brinco: data.brinco, data: data.data },
        });
        
        return {
          result: true,
          data: instance,
        };
        
      } catch (error) {
        console.error(error);
        return {
          result: 'LOCALCLEAN/ERROR',
          data: [ dados ],
          message: 'Ocorreu um erro durante a limpeza de dado pendente, contate o administrador',
        };
      }

    } else {
      return {
        result: 'LOCALCLEAN/ERROR',
        data: [ dados ],
        message: 'Ocorreu um erro durante a limpeza de dado pendente, contate o administrador',
      };
    }
  }
}

module.exports = ReplicationController;
