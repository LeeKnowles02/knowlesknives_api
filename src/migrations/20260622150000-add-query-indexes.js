'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('knives', ['active', 'category'], {
      name: 'knives_active_category',
    });
    await queryInterface.addIndex('knives', ['active', 'featured'], {
      name: 'knives_active_featured',
    });
    await queryInterface.addIndex('enquiries', ['status'], {
      name: 'enquiries_status',
    });
    await queryInterface.addIndex('enquiries', ['createdAt'], {
      name: 'enquiries_created_at',
    });
    await queryInterface.addIndex('services', ['active', 'featured'], {
      name: 'services_active_featured',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('services', 'services_active_featured');
    await queryInterface.removeIndex('enquiries', 'enquiries_created_at');
    await queryInterface.removeIndex('enquiries', 'enquiries_status');
    await queryInterface.removeIndex('knives', 'knives_active_featured');
    await queryInterface.removeIndex('knives', 'knives_active_category');
  },
};
