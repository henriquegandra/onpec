const sequelize = require('./db');

// Verificar a tabela local
async function checkTblLocal(tbl, model) {

  const Model = require(`../backend/model/${model}Model`);
  try {
    // Verificar se a tabela existe no banco de dados
    const tableExists = await sequelize.getQueryInterface().showAllTables()
      .then(tables => tables.includes(tbl));

    if (tableExists) {
      return true;
    } else {
      // Criar a tabela com base no modelo
      const resultTable = await Model.sync({ freezeTableName: true });
      console.log(resultTable);
      
      return {
        result: true,
        data: []
      };
    }

  } catch (error) {
    console.error('Erro ao verificar a tabela:', error);

    return {
      result: false,
      data: error
    };
  }
}

module.exports = { checkTblLocal };
