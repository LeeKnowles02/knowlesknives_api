'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('admin'),
        allowNull: false,
        defaultValue: 'admin',
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

    await queryInterface.createTable('knives', {
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
      steelType: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      handleMaterial: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      bladeLength: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      overallLength: {
        type: Sequelize.STRING(50),
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

    await queryInterface.createTable('services', {
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
      slug: {
        type: Sequelize.STRING(220),
        allowNull: false,
        unique: true,
      },
      shortDescription: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      enquiryType: {
        type: Sequelize.ENUM(
          'Custom Knife',
          'Knife Making Course',
          'Engraving',
          'Repairs / Sharpening',
          'General',
          'Other'
        ),
        allowNull: false,
        defaultValue: 'General',
      },
      imageUrl: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      featured: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    await queryInterface.createTable('knife_images', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      knifeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'knives',
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

    await queryInterface.createTable('enquiries', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      enquiryType: {
        type: Sequelize.ENUM(
          'General',
          'Knife Enquiry',
          'Custom Knife',
          'Knife Making Course',
          'Engraving',
          'Repairs / Sharpening',
          'Other'
        ),
        allowNull: false,
      },
      selectedKnifeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'knives',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      selectedKnifeName: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      selectedServiceId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'services',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      selectedServiceName: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('New', 'Contacted', 'Closed'),
        allowNull: false,
        defaultValue: 'New',
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable('enquiries');
    await queryInterface.dropTable('knife_images');
    await queryInterface.dropTable('services');
    await queryInterface.dropTable('knives');
    await queryInterface.dropTable('users');
  },
};
