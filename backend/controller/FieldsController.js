
const GadoRacaController = require("./GadoRacaController");
const GadoLoteController = require("./GadoLoteController");
const GadoPastoController = require("./GadoPastoController");
const GadoFaseController = require("./GadoFaseController");

const FieldsController = {
  async get(page) {
    let fields;

    try {
      switch (page) {
        case 'gadopesagem':
          fields = {
            raca: await GadoRacaController.get(),
            lote: await GadoLoteController.get(),
            pasto: await GadoPastoController.get(),
            fase: await GadoFaseController.get(),
          }
          break;
        default:
          fields = false;
      }

      return fields;
      
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

module.exports = FieldsController;
