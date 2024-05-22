'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Followers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Followers.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    FollowerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    FollowedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    dateAdded: DataTypes.DATE,
    dateRemoved: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Followers',
    indexes: [
      {
        unique: true,
        fields: ['FollowerId', 'FollowedId']
      }
    ]
  });

  Followers.associate = function (models) {
    Followers.belongsTo(models.User, {
      foreignKey: 'FollowerId',
      as: 'Follower'
    });
    Followers.belongsTo(models.User, {
      foreignKey: 'FollowedId',
      as: 'Followed'
    });
  }
  return Followers;
};