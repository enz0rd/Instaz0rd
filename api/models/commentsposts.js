'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommentsPosts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CommentsPosts.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Post',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    comment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CommentsPosts',
  });

  CommentsPosts.associate = (models) => {
    CommentsPosts.belongsTo(models.Post, {
      foreignKey: 'postId'
    });
    CommentsPosts.belongsTo(models.User, {
      foreignKey: 'userId'
    });

    CommentsPosts.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'commentsUser'
    });
  };
  return CommentsPosts;
};