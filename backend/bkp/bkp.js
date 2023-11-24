require('dotenv').config();
const app = require('electron').app;
const fs = require('fs');
const path = require('path');
const rootPath = app.getAppPath();

const BKP = {
  async gen (dados, action, name, type, altPath = false) {
    try {
      const dateNow = new Date().toLocaleString('AF-az').split(' ')[0];
      
      const repo = path.join(rootPath, `./backend/bkp/${type}`);
      
      const fileName = `${dateNow}_${name}.${type}`;
  
      const netFolderPath = (altPath === false) ? false : `${altPath}\\${fileName}`;
      const appFolderPath = path.join(repo, fileName);
  
      const header = Object.keys(dados);
      const headerCSV = header.map(valor => (typeof valor === 'string' && valor.includes(',')
        ? `"${valor}"`.toUpperCase() : valor.toUpperCase())).join(',') + `,ACAO\n`;
        
      const row = Object.values(dados);
      const linhaCSV = row.map(valor => (typeof valor === 'string' && valor.includes(',')
        ? `"${valor}"` : valor)).join(',') + `,${action}\n`;
  
      // Verifica se o arquivo de log já existe
      try {
        await fs.promises.access(appFolderPath, fs.constants.F_OK);
        await fs.promises.appendFile(appFolderPath, linhaCSV, 'utf-8');

        if (altPath !== false) {
          await fs.promises.appendFile(netFolderPath, linhaCSV, 'utf-8');
        }
  
        return {
          result: true,
          data: 'Backup do registro concluído com sucesso',
        }
  
      } catch (error) {
        /* console.log('Arquivo não existe', error); */
  
        try {
          // Cria o arquivo CSV e adiciona o cabeçalho
          await fs.promises.writeFile(appFolderPath, headerCSV, 'utf-8');
          await fs.promises.appendFile(appFolderPath, linhaCSV, 'utf-8');
  
          if (altPath !== false) {
            await fs.promises.writeFile(netFolderPath, headerCSV, 'utf-8');
            await fs.promises.appendFile(netFolderPath, linhaCSV, 'utf-8');
          }
          
          return {
            result: true,
            data: 'Backup do registro concluído com sucesso',
          }
          
        } catch (error) {
          console.warn(error);
          return {
            result: false,
            data: '=== ERRO BKP: ' + error,
          }
        }
      }
      
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = BKP;
