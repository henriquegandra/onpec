const ReplicationController = require("../controller/ReplicationController");

const cleanDataPending = async (list) => {
  const cleanListOK = [];
  const cleanListError = [];

  try {
    for (const chunk of list) {
      for (const reg of chunk) {
        const { result, data, message } = reg;
        if (
          `${result}`.includes('UPDATEDAT/LT') ||
          `${result}`.includes('SYNC/LT') ||
          `${result}`.includes('NaN')
        ) {
          cleanListError.push(reg);

        } else {
          const regDeleted = await ReplicationController.cleanQueue(reg);

          if (regDeleted.result === true) {
            cleanListOK.push(regDeleted);
          } else {
            cleanListError.push(regDeleted);
          }
        }
      }
    }
  
    return {
      ok: cleanListOK,
      error: cleanListError,
    };
    
  } catch (error) {
    console.error(error);
    return;
  }
}

module.exports = cleanDataPending;
