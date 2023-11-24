/**
 * Modelo para a tabela tbl_gado_raca.
 * @typedef {Object} GadoRaca
 * @property {string} raca - O número do raca.
 * @property {string} sigla - A sigla do raca.
 * @property {string} descricao - A descrição do raca.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../../base/db');

const GadoRaca = sequelize.define('tbl_gado_raca', {
  sigla: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  raca: {
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
GadoRaca.resetTable = async () => {
  try {
    // Excluir todos os registros da tabela
    await GadoRaca.destroy({ truncate: true });
    return true;
    
  } catch (error) {
    console.error('Erro ao excluir registros da tbl_gado_raca:', error);
    throw error;
  }
};

module.exports = GadoRaca;
