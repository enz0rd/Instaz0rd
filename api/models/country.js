'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Country.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nameCountry: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Country',
  });

  Country.associate = (models) => {
    Country.hasMany(models.User, {
      foreignKey: 'countryFrom',
      as: 'users',  // Alias reverso, se necessário
    });
  };
  
  return Country;
};