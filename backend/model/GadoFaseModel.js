/**
 * Modelo para a tabela tbl_gado_fase.
 * @typedef {Object} GadoFase
 * @property {string} codigo - O código da fase.
 * @property {string} fase - O nome da fase.
 * @property {string} descricao - A descrição da fase.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../../base/db');

const GadoFase = sequelize.define('tbl_gado_fase', {
  codigo: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  fase: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  freezeTableName: true,
  logging: false,
  createdAt: false,
  updatedAt: false,
});

/**
 * Método para excluir todos os registros da tabela.
 * @function
 * @returns {Promise<void>} - Promessa vazia que indica o término da operação.
 * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
 */
GadoFase.resetTable = async () => {
  try {
    // Excluir todos os registros da tabela
    await GadoFase.destroy({ truncate: true });
    return true;
    
  } catch (error) {
    console.error('Erro ao excluir registros da tbl_gado_fase:', error);
    throw error;
  }
};

module.exports = GadoFase;
