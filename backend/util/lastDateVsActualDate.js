const moment = require('moment');

const lastDateVsActualDate = async (lastDate) => {
  // Verifica se o parâmetro passado é uma data válida
  if (!moment(lastDate).isValid()) {
    throw new Error('Data inválida.');
  }

  // Obtem a data atual
  const currentDate = moment();

  // Compara a data atual com a data passada como parâmetro
  return currentDate.isAfter(lastDate);
}

module.exports = lastDateVsActualDate;
