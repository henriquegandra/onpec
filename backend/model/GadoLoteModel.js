/**
 * Modelo para a tabela tbl_gado_lote.
 * @typedef {Object} GadoLote
 * @property {string} lote - O número do lote.
 * @property {number} unidade - O número da unidade.
 * @property {string} descricao - A descrição do lote.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../../base/db');

const GadoLote = sequelize.define('tbl_gado_lote', {
  lote: {
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
GadoLote.resetTable = async () => {
  try {
    // Excluir todos os registros da tabela
    await GadoLote.destroy({ truncate: true });
    return true;

  } catch (error) {
    console.error('Erro ao excluir registros da tbl_gado_lote:', error);
    throw error;
  }
};

module.exports = GadoLote;
