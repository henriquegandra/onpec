const { Op, DataTypes } = require('sequelize');
const sequelize = require('../../base/db');

const GadoPesagemQueued = sequelize.define('tbl_gado_pesagem_queued', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  brinco: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sexo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  raca: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lote: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pasto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  peso: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  fase: {
    type: DataTypes.STRING(1),
    allowNull: true,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  indexes: [
    {
      name: 'un_brinco_data_queue',
      unique: true,
      fields: ['brinco', 'data'],
    }
  ],
  freezeTableName: true,
});

GadoPesagemQueued.resetAutoIncrement = async function () {
  try {

    // Executa o comando SQL para zerar o auto incremento
    await sequelize.query(`DELETE FROM sqlite_sequence WHERE name = 'tbl_gado_pesagem_queued'`);

    // Retorna uma mensagem de sucesso
    return 'Contagem de auto incremento zerado com sucesso.';
  } catch (error) {
    throw new Error('Erro ao zerar o auto incremento: ' + error.message);
  }
};

module.exports = GadoPesagemQueued;
