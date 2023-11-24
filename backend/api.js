const { BrowserWindow, ipcMain } = require("electron");
const { verificarConexao } = require("./util/checkConn");
const syncCloud = require("./syncCloud");
const GadoPesagemController = require("./controller/GadoPesagemController");
const FieldsController = require("./controller/FieldsController");

const calls = () => {

  ipcMain.handle('syncCloud', async () => {
    try {
      // Função que sincronizará as mudanças e/ou dados
      return await syncCloud(BrowserWindow.getFocusedWindow());

    } catch (error) {
      console.error('Erro ao sincronizar mudanças e/ou dados:', error);
      return false;
    }
  });

  ipcMain.handle('getBrinco', async (event, dados) => {
    try {
      // Função que buscará os dados
      return await GadoPesagemController.findAll(dados);
      
    } catch (error) {
      console.error('Erro ao buscar dados locais:', error);
      return false;
    }
  });

  ipcMain.handle('upsertBrinco', async (event, dados) => {
    try {
      // Função que fará o upsert no banco de dados
      return await GadoPesagemController.upsert(dados);

    } catch (error) {
      console.error('Erro ao fazer upsert:', error);
      return false;
    }
  });

  ipcMain.handle('destroyBrinco', async (event, dados) => {
    try {
      // Função que fará o delete no banco com o brinco e data
      return await GadoPesagemController.destroy(dados);

    } catch (error) {
      console.error('Erro ao fazer upsert:', error);
      return false;
    }
  });

  ipcMain.handle('listFields', async (event, page) => {
    try {
      // Função que irá carregar os dados dos campos da página
      return await FieldsController.get(page);

    } catch (error) {
      console.log('Erro ao verificar conexão com a internet');
      return false;
    }
  });

  ipcMain.handle('getConnStatus', async () => {
    try {
      return await verificarConexao();

    } catch (error) {
      console.log('Erro ao verificar conexão com a internet');
      return false;
    }
  });
}

module.exports = { calls };
