const validarCampoPesagem = async (element) => {
  if (!/^[0-9]{1,5}(.[0-9]{1,3})?$/.test(element.value)) {
    element.value = '';
  }
}