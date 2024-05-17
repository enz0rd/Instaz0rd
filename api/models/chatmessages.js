'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatMessages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ChatMessages.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Chat',
        key: 'id'
      }
    },
    messageType: {
      type: DataTypes.INTEGER,
      references: {
        model: 'ContentType',
        key: 'id'
      }
    },
    messageText: DataTypes.STRING,
    messageOther: DataTypes.BLOB,
    dateSent: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ChatMessages',
  });
  return ChatMessages;
};