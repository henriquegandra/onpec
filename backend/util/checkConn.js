require('dotenv').config();
const axios = require('axios');

const rootMode = `${process.env.ONPEC_MODE}` || 'prod';

// Verificar a conexão com a internet
const verificarConexao = async () => {

  // USE LINKS DA SUA API
  const url = (rootMode.includes('dev'))
      ? `${process.env.API_URL}:5115`
      : `${process.env.API_URL}:${process.env.API_PORT}`;
  
  try {
    const response = await axios.get(`${url}/api`);
    const { active } = response.data;
    
    return active;
    
  } catch(error) {
    console.log('Servidor Offline');
    return false;
  }
}

module.exports = { verificarConexao };
