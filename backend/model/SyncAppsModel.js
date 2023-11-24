const { DataTypes } = require('sequelize');
const sequelize = require('../../base/db');
const axios = require('axios');
const moment = require('moment');

const SyncApps = sequelize.define('tbl_sync_apps', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  dispositivo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  modulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  updatedAt: false,
});

// Método estático para inserir um novo registro e fazer a requisição com Axios
SyncApps.insertAndRequest = async function (infoMachine) {
  try {
    // Insere o novo registro no banco de dados
    const newReg = await this.create(infoMachine);
    console.log('Registro inserido:', newReg.toJSON().id);

    // Recupera os dados do registro inserido
    const dados = {
      dispositivo: newReg.dispositivo,
      usuario: newReg.usuario,
      modulo: newReg.modulo,
    };

    // Faz a requisição com Axios
    const response = await axios.post('http://on.roncador.com.br:7007/api/inSyncApps', null, { headers: dados });
    const data = JSON.parse(response.data);

    console.log('Sync registrado na nuvem');

    return data.result;
    
  } catch (error) {
    throw new Error('Erro ao inserir o novo registro:', error.message);
  }
};

// Método estático para pegar a data mais recente
SyncApps.getMostRecentDate = async function () {
  try {
    const result = await this.findOne({
      attributes: [[sequelize.fn('max', sequelize.col('createdAt')), 'mostRecentDate']],
    });

    if (!result || !result.getDataValue('mostRecentDate')) {
      return false;
    }

    const dateValue = new Date(result.getDataValue('mostRecentDate'));

    //console.log('=====>', dateValue.toLocaleDateString('pt-br'));
    //console.log('=====>', Intl.DateTimeFormat('pt-br', { dateStyle: 'short', timeStyle: 'medium' }).format(dateValue));
    
    //return moment.utc(result.getDataValue('mostRecentDate'), 'YYYY-MM-DD HH:mm:ss.SSS Z').format('YYYY-MM-DD HH:mm:ss');
    const utcDate = moment.utc(result.getDataValue('mostRecentDate'), 'YYYY-MM-DD HH:mm:ss.SSS Z');
    
    //console.log(`==================== ${result.getDataValue('mostRecentDate')}`);
    //console.log(`==================== ${utcDate}`);

    return utcDate.local().format('YYYY-MM-DD HH:mm:ss');
    
  } catch (error) {
    console.error('Erro ao obter a data mais recente: ' + error.message);
    return null;
  }
};

SyncApps.resetAutoIncrement = async function () {
  try {
    // Nome da tabela que será redefinido o auto incremento
    const tableName = 'tbl_sync_apps';

    // Executa o comando SQL para zerar o auto incremento
    await sequelize.query(`DELETE FROM sqlite_sequence WHERE name='${tableName}'`);

    // Retorna uma mensagem de sucesso
    return 'Auto incremento zerado com sucesso.';
  } catch (error) {
    throw new Error('Erro ao zerar o auto incremento: ' + error.message);
  }
};

SyncApps.resetTable = async function () {
  try {
    // Excluir todos os registros da tabela
    await SyncApps.destroy({ truncate: true });
    return true;
    
  } catch (error) {
    console.error('Erro ao excluir registros da tbl_gado_pesagem:', error);
    throw error;
  }
}

module.exports = SyncApps;
