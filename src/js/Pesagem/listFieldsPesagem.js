const listFields = async (page) => {
  try {
    const fields = await ipcRenderer.invoke('listFields', page.toLowerCase());
    return fields;

  } catch (error) {
    console.error(error.message);
    return false;
  }
}
