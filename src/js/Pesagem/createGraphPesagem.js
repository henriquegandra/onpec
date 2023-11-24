const createGraph = async (action = true) => {
  // Limpar o conteúdo do gráfico se action for false
  if (chart) {
    chart.destroy();
  }

  // Limpar o conteúdo do gráfico se action for false
  if (!action) {
    const chartCanvas = document.getElementById('chart');
    const ctx = chartCanvas.getContext('2d');
    ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
  } else {

    // Obter os dados da tabela
    const tabela = document.getElementById('lista');
    const linhas = tabela.querySelectorAll('tr');
    const dados = [];
    const datas = [];
    const gmdParcial = []; // Adicionado para armazenar os valores do GMD PARCIAL

    linhas.forEach((linha, index) => {
      if (index > 0) {
        const colunas = linha.querySelectorAll('td');
        const peso = parseFloat(colunas[7].textContent);
        const data = colunas[6].textContent;
        const gmd = (colunas[9].textContent === '-') ? null : colunas[9].textContent; // Adicionado para obter o GMD PARCIAL
        dados.push(peso); // Armazenar peso e GMD como um objeto
        datas.push(data);
        gmdParcial.push(gmd); // Armazenar o GMD PARCIAL
      }
    });

    // Inverter os dados, datas e GMD PARCIAL
    dados.reverse();
    datas.reverse();
    gmdParcial.reverse();

    // Configuração do gráfico
    const ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: datas,
        datasets: [
          {
            label: 'PESO (kg)',
            data: dados.map(item => item),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: 'GMD PARCIAL',
            data: gmdParcial.map(item => item), 
            type: 'line',
            borderColor: 'rgb(255, 219, 74)',
            borderWidth: 2,
            fill: false,
            yAxisID: 'gmdY',
            pointStyle: gmdParcial.map(value => value ? 'circle' : 'rect'), // Define o estilo do ponto (círculo ou quadrado)
            pointRadius: 6, // Define o raio do ponto
            pointHoverRadius: 10, // Define o raio do ponto quando o mouse passa por cima
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: Math.max(...dados.map(item => item)) + 50,
            title: {
              display: true,
              text: 'PESO (kg)',
              font: {
                weight: 'bold',
                size: 12,
              },
              color: 'rgba(255, 255, 255, 0.9)'
            },
            position: 'left',
            grid: {
              display: false
            },
            ticks: {
              font: {
                weight: 'bold',
                size: 14,
              },
              color: 'rgba(255, 255, 255, 0.9)'
            }
          },
          gmdY: {
            beginAtZero: true,
            max: Math.max(...gmdParcial.map(item => (parseFloat(item)) ? parseFloat(item) : 0.0)) + 0.5,
            title: {
              display: true,
              text: 'GMD PARCIAL',
              font: {
                weight: 'bold',
                size: 14,
              },
              color: 'rgba(255, 255, 255, 0.9)'
            },
            position: 'right',
            grid: {
              color: 'rgba(239, 239, 239, 0.1)'
            },
            ticks: {
              font: {
                weight: 'bold',
                size: 12,
              },
              color: 'rgba(255, 255, 255, 0.9)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'DATA DA PESAGEM',
              font: {
                weight: 'bold',
                size: 12,
              },
              color: 'rgba(255, 255, 255, 0.9)'
            },
            grid: {
              color: 'rgba(239, 239, 239, 0)'
            },
            ticks: {
              font: {
                weight: 'bold',
                size: 14,
              },
              color: 'rgba(255, 255, 255, 0.9)'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'rgba(255, 255, 255, 0.9)',
              font: {
                weight: 'bold',
                size: 14,
              }
            }
          },
          tooltip: {
            titleSpacing: 6,
            titleFont: {
              weight: 'bold',
              size: 12,
            },
            bodySpacing: 6,
            bodyFont: {
              size: 14,
            },
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                return `${label}: ${value}`;
              }
            }
          }
        }
      }
    });
  }
}
