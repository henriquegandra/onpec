const destroyBrinco = async () => {
  const campoBrinco = document.getElementById('campo-brinco-pesagem-gado');

  try {
    await processingLoad(true);
    
    if (manip !== null && manip !== undefined && manip !== false) {
      const data = {
        type: 'destroy',
        data: manip,
      };

      const resultDestroy = await ipcRenderer.invoke('destroyBrinco', data);
      console.log(resultDestroy);
      
      if (resultDestroy === false) {
        processingLoad(null, 'Erro ao inserir os dados, tente novamente');
        await delay(2500);
        throw new Error(resultDestroy.data.message);
      }
    }
    
  } catch (error) {
    console.log(error);
  } finally {
    await cleanFields();
    await getBrinco(campoBrinco.value);

    campoBrinco.focus();

    await processingLoad(false);
  }
}
