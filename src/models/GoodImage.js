const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GoodImage = sequelize.define(
  'GoodImage',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    goodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    altText: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'good_images',
  }
);

module.exports = GoodImage;
