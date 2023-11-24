/**
 * Modelo para a tabela tbl_gado_pasto.
 * @typedef {Object} GadoPasto
 * @property {string} pasto - O nome do pasto.
 * @property {number} unidade - O número da unidade.
 * @property {string} descricao - A descrição do pasto.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../../base/db');

const GadoPasto = sequelize.define('tbl_gado_pasto', {
  pasto: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  unidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  freezeTableName: true,
  createdAt: false,
  updatedAt: false,
});

/**
 * Método para excluir todos os registros da tabela.
 * @function
 * @returns {Promise<void>} - Promessa vazia que indica o término da operação.
 * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
 */
GadoPasto.resetTable = async () => {
  try {
    // Excluir todos os registros da tabela
    await GadoPasto.destroy({ truncate: true });
    return true;

  } catch (error) {
    console.error('Erro ao excluir registros da tbl_gado_pasto:', error);
    throw error;
  }
};

module.exports = GadoPasto;
