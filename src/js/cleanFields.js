const cleanFields = async () => {
  const main = document.querySelector("#main");
  try {
    // Obtém todos os selects dentro do elemento com o ID específico
    const selects = Array.from(main.querySelectorAll("select"));

    // Percorre todos os selects e define o selectedIndex como 0 (primeira opção)
    for (let i = 0; i < selects.length; i++) {
      selects[i].selectedIndex = 0;
    }
    
  } catch (error) {
    console.warn(error);
  }

  try {
    // Obtém todos os inputs dentro do elemento com o ID específico
    const fields = Array.from(main.querySelectorAll("input"));

    // Percorre todos os inputs e define o valor deles como uma string vazia ("")
    for (let i = 0; i < fields.length; i++) {
      if (i !== 0) fields[i].value = "";
    }
    
  } catch (error) {
    console.warn(error);
  }
}
