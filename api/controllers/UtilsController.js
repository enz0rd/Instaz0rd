const db = require('../models');

class UtilsController {
  static async getCountries(req, res) {
    try {
      const states = await db.Country.findAll({
        attributes: ['id', 'nameCountry'],
      });
      res.json(states);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UtilsController;