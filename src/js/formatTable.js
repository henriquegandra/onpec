const formatTable = async (dadosBrinco) => {
  await manipPesagem(dadosBrinco);
  
  const tabelaHead = Object.keys(dadosBrinco[0].dataValues);

  const table = document.getElementById('lista');

  // Criar a linha de cabeçalho
  const headerRow = document.createElement('tr');

  for (let i = 0; i < tabelaHead.length; i++) {
    const cell = document.createElement('th');
    cell.textContent = i === 0
      ? 'REGISTRO'
      : tabelaHead[i].toUpperCase();

    headerRow.appendChild(cell);
  }
  
  const gmdParcial = document.createElement('th');
  gmdParcial.textContent = 'GMD PARCIAL';
  headerRow.appendChild(gmdParcial);
  table.appendChild(headerRow);

  // Criar a linha de cada registro
  for (let i = 0; i < dadosBrinco.length; i++) {
    const row = document.createElement('tr');
    
    // Destaca a linha caso a data do registro for igual a data atual e for o primeiro registro lista
    sinal && i === 0 ? row.style.background = '#B88600' : row.style.background = '';
    
    const valuesBrinco = dadosBrinco[i].dataValues;

    for (let j = 0; j < tabelaHead.length; j++) {
      const cell = row.insertCell();
      const columnKey = tabelaHead[j];
      
      if (j === 2) {
        if (valuesBrinco[columnKey] === 'F') {
          cell.textContent = 'FÊMEA'
        }
        if (valuesBrinco[columnKey] === 'M') {
          cell.textContent = 'MACHO'
        }

      } else if (j === 6) {
        const dataRow = valuesBrinco[columnKey] ? 
          new Date(valuesBrinco[columnKey] + ' 00:00:00').toLocaleString('pt-BR').split(',')[0] : null;
        
        //console.log(dataRow);
        cell.textContent = dataRow;

      } else {
        cell.textContent = valuesBrinco[columnKey] || '-';
      }
    }
    
    const valuesBrincoAnt = (dadosBrinco[i + 1] === undefined || !dadosBrinco[i + 1])
      ? null
      : dadosBrinco[i + 1].dataValues

    // GMD PARCIAL
    const gmdRow = row.insertCell();

    const gmdParcialValue = valuesBrincoAnt !== null
    ? {
        p1: valuesBrincoAnt[tabelaHead[7]],
        p2: valuesBrinco[tabelaHead[7]],
        d1: new Date(valuesBrincoAnt[tabelaHead[6]]),
        d2: new Date(valuesBrinco[tabelaHead[6]])
      }
    : null;

    gmdRow.textContent = valuesBrincoAnt !== null ? await calcGMD(gmdParcialValue) : '-';

    table.appendChild(row);
  }

  if (dadosBrinco.length > 1) {
    // GMD GERAL
    const gmdGeral = document.createElement('tr');
    const rowGmdGeral = gmdGeral.insertCell();

    // Célula irá ocupar o tamanho de todas as colunas
    rowGmdGeral.colSpan = tabelaHead.length + 1;

    const lastBrinco = dadosBrinco[0].dataValues;
    const firstBrinco = dadosBrinco[dadosBrinco.length - 1].dataValues;

    const gmdGeralValue = {
      p1: lastBrinco.peso,
      p2: firstBrinco.peso,
      d1: new Date(lastBrinco.data),
      d2: new Date(firstBrinco.data),
    }
    rowGmdGeral.textContent = `GMD GERAL = ${await calcGMD(gmdGeralValue)}`;

    rowGmdGeral.style.background = "#00423b";
    rowGmdGeral.style.color = "#efefef";
    rowGmdGeral.style.fontSize = "calc(10px + 0.5vw)";
    rowGmdGeral.style.fontWeight = "bold";

    table.appendChild(rowGmdGeral);
  }
}
