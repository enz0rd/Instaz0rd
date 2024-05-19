'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }, 
    password: DataTypes.STRING,
    userIcon: DataTypes.STRING,
    bio: DataTypes.STRING,
    phonenum: {
      type: DataTypes.STRING,
      allowNull: true
    },
    countryFrom: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Country',
        key: 'id'
      }
    },
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });

  User.associate = (models) => {
    User.belongsTo(models.Country, {
      foreignKey: 'countryFrom',
      as: 'country',  // Alias utilizado na consulta
    });
  
    User.hasMany(models.Post, {
      foreignKey: 'userId',
    });
  
    // User.hasMany(models.CommentsPosts, {
    //   foreignKey: 'userId',
    // });
  
    User.hasMany(models.LikesPosts, {
      foreignKey: 'userId',
    });
  
    // User.hasMany(models.Friends, {
    //   foreignKey: 'ownerId',
    // });
  
    // User.hasMany(models.Friends, {
    //   foreignKey: 'friendId',
    // });
  
    // Adicione uma nova associação para notificações de usuário de e para
    User.hasMany(models.Notification, {
      foreignKey: 'userFromId',
      as: 'userFrom', // Defina um alias para a associação
    });
  
    User.hasMany(models.Notification, {
      foreignKey: 'userToId',
      as: 'userTo', // Defina um alias para a associação
    });
  };
  
  
  

  
  return User;
};