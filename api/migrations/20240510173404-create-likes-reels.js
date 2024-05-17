'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LikesReels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reelId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Reels',
          key: 'id'
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addIndex('LikesReels', ['reelId', 'userId'], {
      unique: true,
      name: 'unique_like_reel'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('LikesReels');
  }
};