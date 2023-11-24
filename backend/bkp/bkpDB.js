const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function bkpDB(db) {
  try {
    const agora = new Date();
    const timestamp = `${agora.getFullYear()}${(agora.getMonth() + 1).toString().padStart(2, '0')}${agora.getDate().toString().padStart(2, '0')}_${agora.getHours().toString().padStart(2, '0')}${agora.getMinutes().toString().padStart(2, '0')}${agora.getSeconds().toString().padStart(2, '0')}`;

    const extensao = path.extname(db);
    const nomeBase = path.basename(db, extensao);

    const novoNome = `${nomeBase}_${timestamp}${extensao}`;

    const novoCaminho = path.join(path.dirname(db), novoNome);

    await fs.promises.copyFile(db, novoCaminho);

    console.log(`bkpDB criada com sucesso: ${novoCaminho}`);
  } catch (error) {
    console.log(`Ocorreu um erro ao fazer bkpDB:\n${error}`);
  }
}

module.exports = bkpDB;
