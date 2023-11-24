require('dotenv').config();
const app = require('electron').app;
const Sequelize = require('sequelize');
const path = require('path');

const rootMode = `${process.env.ONPEC_MODE}` || 'prod';

const db = (rootMode.includes('dev'))
  ? path.join(app.getAppPath(), './base/local-test.db')
  : path.join(app.getAppPath(), './base/local.db');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: db,
    pool: {
      max: 20, // Define o número máximo de conexões do pool
    },
    logging: false
  })
 
module.exports = sequelize;
