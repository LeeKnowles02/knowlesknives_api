'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('goods', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(220),
        allowNull: false,
        unique: true,
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      shortDescription: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      availability: {
        type: Sequelize.ENUM('Available', 'Reserved', 'Sold', 'Made to Order'),
        allowNull: false,
        defaultValue: 'Available',
      },
      material: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      finish: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      dimensions: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      personalization: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      featured: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      featuredOrder: {
        type: Sequelize.INTEGER,
        allowNull: true,
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

    await queryInterface.createTable('good_images', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      goodId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'goods',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      imageUrl: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      altText: {
        type: Sequelize.STRING(255),
        allowNull: true,
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

    await queryInterface.addIndex('goods', ['active', 'category'], {
      name: 'goods_active_category',
    });
    await queryInterface.addIndex('goods', ['active', 'featured'], {
      name: 'goods_active_featured',
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE enquiries
      MODIFY COLUMN enquiryType ENUM(
        'General',
        'Knife Enquiry',
        'Goods Enquiry',
        'Custom Knife',
        'Knife Making Course',
        'Engraving',
        'Repairs / Sharpening',
        'Other'
      ) NOT NULL
    `);

    await queryInterface.addColumn('enquiries', 'selectedGoodId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'goods',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('enquiries', 'selectedGoodName', {
      type: Sequelize.STRING(200),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('enquiries', 'selectedGoodName');
    await queryInterface.removeColumn('enquiries', 'selectedGoodId');

    await queryInterface.sequelize.query(`
      ALTER TABLE enquiries
      MODIFY COLUMN enquiryType ENUM(
        'General',
        'Knife Enquiry',
        'Custom Knife',
        'Knife Making Course',
        'Engraving',
        'Repairs / Sharpening',
        'Other'
      ) NOT NULL
    `);

    await queryInterface.removeIndex('goods', 'goods_active_featured');
    await queryInterface.removeIndex('goods', 'goods_active_category');
    await queryInterface.dropTable('good_images');
    await queryInterface.dropTable('goods');
  },
};
