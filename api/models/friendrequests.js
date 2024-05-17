'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FriendRequests extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FriendRequests.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userFromId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    userToId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    statusID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Statuses',
        key: 'id'
      }
    },
    dateSent: DataTypes.DATE,
    dateReplied: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'FriendRequests',
  });
  return FriendRequests;
};