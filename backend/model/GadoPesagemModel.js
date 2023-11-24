const { Op, DataTypes } = require('sequelize');
const sequelize = require('../../base/db');
const GadoPasto = require('./GadoPastoModel');

const GadoPesagem = sequelize.define('tbl_gado_pesagem', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
  },
  brinco: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sexo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  raca: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lote: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pasto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  peso: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  fase: {
    type: DataTypes.STRING(1),
    allowNull: true,
  },
}, {
  indexes: [
    {
      name: 'un_brinco_data',
      unique: true,
      fields: ['brinco', 'data'],
    }
  ],
  freezeTableName: true,
});

GadoPesagem.findAllDateGreater = async function (paramDate) {
  try {
    const result = await this.findAll({
      where: {
        data: {
          [Op.gte]: paramDate,
        },
      },
    });

    return result;
    
  } catch (error) {
    throw new Error('Erro ao buscar os dados: ' + error.message);
  }
};

GadoPesagem.resetAutoIncrement = async function () {
  try {
    // Nome da tabela que será redefinido o auto incremento
    const tableName = 'tbl_gado_pesagem';

    // Executa o comando SQL para zerar o auto incremento
    await sequelize.query(`DELETE FROM sqlite_sequence WHERE name='${tableName}'`);

    // Retorna uma mensagem de sucesso
    return 'Auto incremento zerado com sucesso.';
  } catch (error) {
    throw new Error('Erro ao zerar o auto incremento: ' + error.message);
  }
};

/**
 * Método para excluir todos os registros da tabela.
 * @function
 * @returns {Promise<void>} - Promessa vazia que indica o término da operação.
 * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
 */
GadoPesagem.resetTable = async () => {
  try {
    // Excluir todos os registros da tabela
    await GadoPesagem.destroy({ truncate: true });
    return true;
    
  } catch (error) {
    console.error('Erro ao excluir registros da tbl_gado_pesagem:', error);
    throw error;
  }
};

module.exports = GadoPesagem;
