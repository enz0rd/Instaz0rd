'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notification.init({
    notificationMessage: {
      allowNull: false,
      type: DataTypes.STRING
    },
    userFromId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    userToId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
  }, {
    sequelize,
    modelName: 'Notification',
  });

  Notification.associate = function(models) {
    Notification.belongsTo(models.User, {
      foreignKey: 'userFromId',
      as: 'userFrom',
    });
  
    Notification.belongsTo(models.User, {
      foreignKey: 'userToId',
      as: 'userTo',
    });
  };
  
  return Notification;
};