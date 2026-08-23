'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('gallery_items', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      imageUrl: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'Other',
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('gallery_items', ['active', 'sortOrder'], {
      name: 'gallery_items_active_sort',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('gallery_items', 'gallery_items_active_sort');
    await queryInterface.dropTable('gallery_items');
  },
};
